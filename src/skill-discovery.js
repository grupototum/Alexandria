const express = require('express');
const https = require('https');
const crypto = require('crypto');
const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const { validateConfig } = require('./config');

const config = validateConfig();
const router = express.Router();
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey, {
  realtime: { transport: WebSocket }
});
const SEARCH_FUNCTIONS = { skill: 'search_skills', pop: 'search_pops', doc: 'search_docs' };
const VALID_DOC_TYPES = new Set(Object.keys(SEARCH_FUNCTIONS));

async function getEmbedding(text) {
  const body = JSON.stringify({
    model: 'models/gemini-embedding-001',
    content: { parts: [{ text }] },
    outputDimensionality: 768
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-embedding-001:embedContent?key=${config.googleApiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const d = JSON.parse(data);
          if (res.statusCode >= 400) {
            return reject(new Error(d.error?.message || `Embedding API returned HTTP ${res.statusCode}`));
          }
          if (!Array.isArray(d.embedding?.values)) {
            return reject(new Error('Embedding API returned an invalid response'));
          }
          resolve(d.embedding.values);
        } catch (e) { reject(e); }
      });
    });
    req.setTimeout(config.embeddingTimeoutMs, () => req.destroy(new Error('Embedding API request timed out')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function requireInternalToken(req, res, next) {
  const token = req.get('x-alexandria-token');
  const expected = Buffer.from(config.alexandriaApiToken);
  const received = Buffer.from(token || '');
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    return res.status(401).json({ error: 'não autorizado' });
  }
  next();
}

function parsePositiveInteger(value, fallback, max) {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function parseThreshold(value, fallback = 0.7) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) return fallback;
  return parsed;
}

function isValidDocumentPayload(doc) {
  return doc
    && typeof doc.title === 'string'
    && doc.title.trim()
    && typeof doc.content === 'string'
    && doc.content.trim()
    && VALID_DOC_TYPES.has(doc.doc_type)
    && (doc.path === undefined || typeof doc.path === 'string')
    && (doc.metadata === undefined || isPlainObject(doc.metadata));
}

function isPlainObject(value) {
  return value === null || (typeof value === 'object' && !Array.isArray(value));
}

function normalizeSearchTerm(value) {
  return typeof value === 'string' ? value.trim() : '';
}

async function upsertDocument({ title, content, doc_type, path, metadata = {} }) {
  const embedding = await getEmbedding(`${title}\n${content}`);
  const { data, error } = await supabase.from('alexandria_documents').upsert({
    title,
    content,
    doc_type,
    path,
    metadata,
    embedding,
    updated_at: new Date().toISOString()
  }, { onConflict: 'title,doc_type' }).select('id').single();

  if (error) throw new Error(error.message);
  return data?.id;
}

router.get('/overview', async (req, res) => {
  try {
    const limit = parsePositiveInteger(req.query.limit, 80, 200);
    const { data, error } = await supabase
      .from('alexandria_documents')
      .select('id,title,doc_type,path,metadata,updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) return res.status(502).json({ error: error.message });

    const documents = data || [];
    const counts = documents.reduce((acc, item) => {
      const type = item.doc_type || 'doc';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      stats: {
        totalDocuments: documents.length,
        skills: counts.skill || 0,
        pops: counts.pop || 0,
        docs: counts.doc || 0,
        updatedAt: documents[0]?.updated_at || null
      },
      documents
    });
  } catch (err) {
    console.error('[overview] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/documents', async (req, res) => {
  try {
    const limit = parsePositiveInteger(req.query.limit, 50, 200);
    const docType = normalizeSearchTerm(req.query.doc_type);
    const query = normalizeSearchTerm(req.query.query);

    let request = supabase
      .from('alexandria_documents')
      .select('id,title,content,doc_type,path,metadata,updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (docType) {
      if (!VALID_DOC_TYPES.has(docType)) return res.status(400).json({ error: 'doc_type inválido' });
      request = request.eq('doc_type', docType);
    }

    if (query) {
      request = request.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
    }

    const { data, error } = await request;
    if (error) return res.status(502).json({ error: error.message });

    res.json({ documents: data || [] });
  } catch (err) {
    console.error('[documents] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/export', async (req, res) => {
  try {
    const format = req.query.format === 'json' ? 'json' : 'markdown';
    const limit = parsePositiveInteger(req.query.limit, 100, 500);
    const { data, error } = await supabase
      .from('alexandria_documents')
      .select('id,title,content,doc_type,path,metadata,updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) return res.status(502).json({ error: error.message });

    const documents = data || [];
    if (format === 'json') return res.json({ exported_at: new Date().toISOString(), documents });

    const markdown = [
      '# Alexandria Export',
      '',
      `Gerado em: ${new Date().toISOString()}`,
      '',
      ...documents.map((doc) => [
        `## ${doc.title}`,
        '',
        `- Tipo: ${doc.doc_type || 'doc'}`,
        doc.path ? `- Caminho: ${doc.path}` : null,
        doc.updated_at ? `- Atualizado em: ${doc.updated_at}` : null,
        '',
        doc.content || ''
      ].filter(Boolean).join('\n'))
    ].join('\n');

    res.type('text/markdown').send(markdown);
  } catch (err) {
    console.error('[export] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/discover', async (req, res) => {
  try {
    const { query, context = '', types = ['skill', 'pop', 'doc'] } = req.body;
    const limit = parsePositiveInteger(req.body.limit, 5, 25);
    if (typeof query !== 'string' || !query.trim()) return res.status(400).json({ error: 'query é obrigatório' });
    if (!Array.isArray(types)) return res.status(400).json({ error: 'types deve ser um array' });

    const fullQuery = context ? `${query} ${context}` : query;
    const embedding = await getEmbedding(fullQuery);

    const results = [];
    const errors = [];

    for (const type of types) {
      const fn = SEARCH_FUNCTIONS[type];
      if (!fn) continue;
      const { data, error } = await supabase.rpc(fn, {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit,
        doc_type: type
      });
      if (error) {
        errors.push({ type, error: error.message });
        continue;
      }
      if (data) results.push(...data.map(r => ({ ...r, type })));
    }

    if (results.length === 0 && errors.length > 0) {
      return res.status(502).json({ error: 'falha ao consultar Alexandria', details: errors });
    }

    results.sort((a, b) => b.relevance - a.relevance);
    const top = results.slice(0, limit);

    let recommended_action = 'proceed_with_base_knowledge';
    let primary_skill = null;
    if (top.length > 0) {
      const best = top[0];
      primary_skill = best.title;
      if (best.relevance >= 0.8) recommended_action = 'read_skill_first';
      else if (best.relevance >= 0.5) recommended_action = 'read_skill_as_context';
      else recommended_action = 'proceed_with_caution';
    }

    res.json({ discovered: top, recommended_action, primary_skill, query_used: fullQuery, warnings: errors });
  } catch (err) {
    console.error('[discover] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/rag/search', async (req, res) => {
  try {
    const { query, doc_type = 'skill' } = req.body;
    const threshold = parseThreshold(req.body.threshold);
    const limit = parsePositiveInteger(req.body.limit, 5, 25);
    if (typeof query !== 'string' || !query.trim()) return res.status(400).json({ error: 'query é obrigatório' });
    if (!VALID_DOC_TYPES.has(doc_type)) return res.status(400).json({ error: 'doc_type inválido' });

    const embedding = await getEmbedding(query);
    const fn = SEARCH_FUNCTIONS[doc_type];

    const { data, error } = await supabase.rpc(fn, {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
      doc_type
    });

    if (error) return res.status(502).json({ error: error.message });
    res.json({ results: data || [] });
  } catch (err) {
    console.error('[rag/search] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/ingest', requireInternalToken, async (req, res) => {
  try {
    if (!isValidDocumentPayload(req.body)) {
      return res.status(400).json({ error: 'title, content e doc_type válido são obrigatórios' });
    }

    const id = await upsertDocument(req.body);
    res.json({ success: true, id });
  } catch (err) {
    console.error('[ingest] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/ingest/batch', requireInternalToken, async (req, res) => {
  try {
    const { documents } = req.body;
    if (!Array.isArray(documents) || documents.length === 0)
      return res.status(400).json({ error: 'documents[] é obrigatório' });
    if (documents.length > config.maxBatchDocuments)
      return res.status(400).json({ error: `limite máximo de ${config.maxBatchDocuments} documentos por lote` });

    const results = [];
    for (const doc of documents) {
      const title = doc?.title;
      if (!isValidDocumentPayload(doc)) { results.push({ title, error: 'campos obrigatórios faltando ou doc_type inválido' }); continue; }
      try {
        const id = await upsertDocument(doc);
        results.push({ title, id, ok: true });
      } catch (e) { results.push({ title, error: e.message }); }
    }

    res.json({ processed: results.length, results });
  } catch (err) {
    console.error('[ingest/batch] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
