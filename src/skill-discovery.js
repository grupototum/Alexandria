const express = require('express');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function getEmbedding(text) {
  const key = process.env.GOOGLE_API_KEY;
  const body = JSON.stringify({
    model: 'models/gemini-embedding-001',
    content: { parts: [{ text }] },
    outputDimensionality: 768
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-embedding-001:embedContent?key=${key}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const d = JSON.parse(data);
          if (d.error) return reject(new Error(d.error.message));
          resolve(d.embedding.values);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

router.post('/discover', async (req, res) => {
  try {
    const { query, context = '' , types = ['skill', 'pop', 'doc'], limit = 5 } = req.body;
    if (!query) return res.status(400).json({ error: 'query é obrigatório' });

    const fullQuery = context ? `${query} ${context}` : query;
    const embedding = await getEmbedding(fullQuery);

    const results = [];
    const typeMap = { skill: 'search_skills', pop: 'search_pops', doc: 'search_docs' };

    for (const type of types) {
      const fn = typeMap[type];
      if (!fn) continue;
      const { data, error } = await supabase.rpc(fn, {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit,
        doc_type: type
      });
      if (!error && data) results.push(...data.map(r => ({ ...r, type })));
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

    res.json({ discovered: top, recommended_action, primary_skill, query_used: fullQuery });
  } catch (err) {
    console.error('[discover] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/rag/search', async (req, res) => {
  try {
    const { query, doc_type = 'skill', threshold = 0.7, limit = 5 } = req.body;
    if (!query) return res.status(400).json({ error: 'query é obrigatório' });

    const embedding = await getEmbedding(query);
    const fnMap = { skill: 'search_skills', pop: 'search_pops', doc: 'search_docs' };
    const fn = fnMap[doc_type] || 'search_skills';

    const { data, error } = await supabase.rpc(fn, {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: limit,
      doc_type
    });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ results: data || [] });
  } catch (err) {
    console.error('[rag/search] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/ingest', async (req, res) => {
  try {
    const { title, content, doc_type, path, metadata = {} } = req.body;
    if (!title || !content || !doc_type) return res.status(400).json({ error: 'title, content e doc_type são obrigatórios' });

    const embedding = await getEmbedding(`${title}\n${content}`);

    const { data, error } = await supabase.from('alexandria_documents').upsert({
      title, content, doc_type, path, metadata, embedding,
      updated_at: new Date().toISOString()
    }, { onConflict: 'title,doc_type' }).select('id').single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('[ingest] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/ingest/batch', async (req, res) => {
  try {
    const { documents } = req.body;
    if (!Array.isArray(documents) || documents.length === 0)
      return res.status(400).json({ error: 'documents[] é obrigatório' });

    const results = [];
    for (const doc of documents) {
      const { title, content, doc_type, path, metadata = {} } = doc;
      if (!title || !content || !doc_type) { results.push({ title, error: 'campos obrigatórios faltando' }); continue; }
      try {
        const embedding = await getEmbedding(`${title}\n${content}`);
        const { data, error } = await supabase.from('alexandria_documents').upsert({
          title, content, doc_type, path, metadata, embedding,
          updated_at: new Date().toISOString()
        }, { onConflict: 'title,doc_type' }).select('id').single();
        results.push(error ? { title, error: error.message } : { title, id: data?.id, ok: true });
      } catch (e) { results.push({ title, error: e.message }); }
    }

    res.json({ processed: results.length, results });
  } catch (err) {
    console.error('[ingest/batch] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
