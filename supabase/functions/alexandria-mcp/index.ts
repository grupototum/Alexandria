declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

type AlexandriaAction = "search" | "get_artifact" | "context_pack" | "manifest";

interface AlexandriaRequest {
  action?: AlexandriaAction;
  query?: string;
  artifactId?: string;
  artifactType?: string;
  agent?: string;
  domain?: string;
  includeReview?: boolean;
  limit?: number;
}

interface ArtifactSummary {
  id: string;
  title: string;
  artifact_type: string;
  status: string;
  scope: string | null;
  summary: string | null;
  tags: string[] | null;
  updated_at: string | null;
  metadata: Record<string, unknown> | null;
  content?: string | null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-alexandria-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const MCP_TOKEN = Deno.env.get("ALEXANDRIA_MCP_TOKEN") || "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return json({ ok: true });
  }

  if (req.method === "GET") {
    return json(pluginManifest());
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: "Supabase service credentials are not configured." }, 500);
  }

  const providedToken = req.headers.get("x-alexandria-token") || bearerToken(req.headers.get("authorization"));
  if (!MCP_TOKEN || providedToken !== MCP_TOKEN) {
    return json({ error: "Unauthorized Alexandria MCP request." }, 401);
  }

  try {
    const body = (await req.json().catch(() => ({}))) as AlexandriaRequest;
    const action = body.action || "search";

    if (action === "manifest") {
      return json(pluginManifest());
    }

    if (action === "search") {
      return json(await searchArtifacts({
        artifactType: body.artifactType,
        domain: body.domain,
        includeContent: false,
        includeReview: Boolean(body.includeReview),
        limit: body.limit || 8,
        query: body.query || "",
      }));
    }

    if (action === "get_artifact") {
      if (!body.artifactId) return json({ error: "artifactId is required." }, 400);
      return json(await getArtifact(body.artifactId));
    }

    if (action === "context_pack") {
      return json(await buildContextPack({
        agent: body.agent || "unknown",
        domain: body.domain,
        includeReview: Boolean(body.includeReview),
        limit: body.limit || 6,
        query: body.query || "",
      }));
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : "Unknown Alexandria MCP error.",
    }, 500);
  }
});

function pluginManifest() {
  return {
    name: "alexandria",
    title: "Alexandria Universal Context Plugin",
    version: "0.1.0",
    description: "Camada universal de contexto da Totum para IAs, agentes, web, mobile e terminais.",
    protocol: {
      http: {
        method: "POST",
        auth: "x-alexandria-token",
        actions: ["search", "get_artifact", "context_pack", "manifest"],
      },
      mcp: {
        tools: ["alexandria_search", "alexandria_get_artifact", "alexandria_context_pack"],
      },
    },
    examples: [
      { action: "search", query: "POP de SDR", limit: 8 },
      { action: "context_pack", query: "criar campanha para cliente odontologico", agent: "pepper", limit: 6 },
      { action: "get_artifact", artifactId: "<uuid>" },
    ],
  };
}

async function searchArtifacts(options: {
  query: string;
  limit: number;
  artifactType?: string;
  domain?: string;
  includeReview?: boolean;
  includeContent?: boolean;
}) {
  const safeLimit = Math.min(Math.max(options.limit || 8, 1), 20);
  const selectedColumns = options.includeContent
    ? "id,title,artifact_type,status,scope,summary,tags,updated_at,metadata,content"
    : "id,title,artifact_type,status,scope,summary,tags,updated_at,metadata";
  const normalizedQuery = normalizeText(options.query);
  const tokens = usefulTokens(options.query);
  const candidateLimit = normalizedQuery ? Math.max(safeLimit * 8, 60) : safeLimit;

  const params = new URLSearchParams({
    select: selectedColumns,
    order: "updated_at.desc",
    limit: String(Math.min(candidateLimit, 160)),
  });

  if (options.includeReview) {
    params.set("status", "in.(approved,review,draft)");
  } else {
    params.set("status", "eq.approved");
  }

  if (options.artifactType) {
    params.set("artifact_type", `eq.${sanitizeSearch(options.artifactType)}`);
  }

  if (options.domain) {
    params.set("scope", `eq.${sanitizeSearch(options.domain)}`);
  }

  const phrase = sanitizeSearch(options.query);
  const orParts: string[] = [];
  if (phrase) {
    orParts.push(`title.ilike.*${phrase}*`, `summary.ilike.*${phrase}*`, `content.ilike.*${phrase}*`);
  }
  for (const token of tokens) {
    const safeToken = sanitizeSearch(token);
    if (!safeToken) continue;
    orParts.push(`title.ilike.*${safeToken}*`, `summary.ilike.*${safeToken}*`, `content.ilike.*${safeToken}*`);
  }
  if (orParts.length) {
    params.set("or", `(${unique(orParts).join(",")})`);
  }

  let artifacts = await supabaseRest(`/rest/v1/hermione_artifacts?${params.toString()}`);

  if (normalizedQuery && Array.isArray(artifacts) && artifacts.length === 0 && tokens.length > 1) {
    const broadParams = new URLSearchParams(params);
    broadParams.delete("or");
    broadParams.set("limit", String(Math.min(candidateLimit, 160)));
    artifacts = await supabaseRest(`/rest/v1/hermione_artifacts?${broadParams.toString()}`);
  }

  const ranked = Array.isArray(artifacts)
    ? rankArtifacts(artifacts as ArtifactSummary[], normalizedQuery, tokens).slice(0, safeLimit)
    : [];

  return {
    query: options.query,
    count: ranked.length,
    mode: normalizedQuery ? "hybrid_text_fallback" : "recent_text_fallback",
    tokens,
    artifacts: ranked,
  };
}

function rankArtifacts(artifacts: ArtifactSummary[], normalizedQuery: string, tokens: string[]) {
  return artifacts
    .map((artifact) => ({ artifact, score: relevanceScore(artifact, normalizedQuery, tokens) }))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      const statusDelta = statusWeight(right.artifact.status) - statusWeight(left.artifact.status);
      if (statusDelta !== 0) return statusDelta;
      return timestampWeight(right.artifact.updated_at) - timestampWeight(left.artifact.updated_at);
    })
    .map((item) => item.artifact);
}

function relevanceScore(artifact: ArtifactSummary, normalizedQuery: string, tokens: string[]) {
  const title = normalizeText(artifact.title);
  const summary = normalizeText(artifact.summary || "");
  const content = normalizeText(artifact.content || "");
  const tags = (artifact.tags || []).map((tag) => normalizeText(tag)).filter(Boolean);
  const tagText = tags.join(" ");

  let score = statusWeight(artifact.status) + timestampWeight(artifact.updated_at) / 100000000000000;

  if (!normalizedQuery) return score;

  if (title.includes(normalizedQuery)) score += 120;
  if (tagText.includes(normalizedQuery)) score += 70;
  if (summary.includes(normalizedQuery)) score += 45;
  if (content.includes(normalizedQuery)) score += 25;

  for (const token of tokens) {
    if (title.includes(token)) score += 28;
    if (tags.some((tag) => tag === token || tag.includes(token))) score += 18;
    if (summary.includes(token)) score += 9;
    if (content.includes(token)) score += 4;
  }

  if (tokens.length && tokens.every((token) =>
    title.includes(token) || summary.includes(token) || content.includes(token) || tagText.includes(token)
  )) {
    score += 35;
  }

  return score;
}

function statusWeight(status: string) {
  if (status === "approved") return 30;
  if (status === "review") return 10;
  if (status === "draft") return 2;
  return 0;
}

function timestampWeight(value: string | null) {
  const time = value ? Date.parse(value) : 0;
  return Number.isFinite(time) ? time : 0;
}

function normalizeText(value: unknown) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function usefulTokens(value: string) {
  const stopwords = new Set([
    "a", "ao", "aos", "as", "com", "como", "da", "das", "de", "do", "dos", "e", "em", "na", "nas", "no", "nos", "o", "os", "ou", "para", "por", "que", "um", "uma",
    "the", "and", "or", "of", "to", "in", "for", "with", "on", "from",
  ]);
  return unique(normalizeText(value).split(" ").filter((token) => token && !stopwords.has(token) && (token.length > 2 || /\d/.test(token))));
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

async function getArtifact(artifactId: string) {
  const params = new URLSearchParams({
    id: `eq.${artifactId}`,
    select: "*",
    limit: "1",
  });
  const rows = await supabaseRest(`/rest/v1/hermione_artifacts?${params.toString()}`);
  const artifact = Array.isArray(rows) ? rows[0] : null;

  if (!artifact) {
    return { artifact: null, sources: [] };
  }

  const sourceParams = new URLSearchParams({
    artifact_id: `eq.${artifactId}`,
    select: "contribution_type,hermione_sources(id,title,file_name,origin,author,source_type,detected_type,tags,created_at)",
  });
  const sources = await supabaseRest(`/rest/v1/hermione_artifact_sources?${sourceParams.toString()}`);

  return { artifact, sources: Array.isArray(sources) ? sources : [] };
}

async function buildContextPack(options: {
  query: string;
  limit: number;
  agent: string;
  domain?: string;
  includeReview?: boolean;
}) {
  const result = await searchArtifacts({
    domain: options.domain,
    includeContent: true,
    includeReview: options.includeReview,
    limit: options.limit,
    query: options.query,
  });
  const artifacts = Array.isArray(result.artifacts) ? result.artifacts as ArtifactSummary[] : [];
  const generatedAt = new Date().toISOString();
  const official = artifacts.filter((artifact) => artifact.status === "approved");
  const nonOfficial = artifacts.filter((artifact) => artifact.status !== "approved");
  const lines = [
    `# Alexandria Context Pack`,
    ``,
    `Tarefa: ${options.query || "geral"}`,
    `Agente: ${options.agent || "unknown"}`,
    `Domínio: ${options.domain || "geral"}`,
    `Gerado em: ${generatedAt}`,
    `Modo de busca: ${result.mode}`,
    ``,
    `## Fontes consultadas`,
    ``,
    artifacts.length
      ? artifacts
          .map((artifact, index) =>
            `${index + 1}. ${artifact.title} — ${artifact.artifact_type} — ${artifact.status} — ${artifact.id}`
          )
          .join("\n")
      : "Nenhum artefato encontrado.",
    ``,
    `## Contexto aprovado`,
    ``,
    official.length
      ? official.map(renderArtifactExcerpt).join("\n\n")
      : "Nenhuma fonte aprovada encontrada para esta consulta.",
    ``,
    `## Fontes não oficiais retornadas`,
    ``,
    nonOfficial.length
      ? nonOfficial.map(renderArtifactExcerpt).join("\n\n")
      : "Nenhuma fonte em rascunho/revisão incluída.",
    ``,
    `## Restrições`,
    ``,
    `- Use fontes aprovadas como base principal.`,
    `- Trate fontes em review/draft como apoio, não como verdade final.`,
    `- Não use segredos, tokens ou dados pessoais como conhecimento operacional.`,
    ``,
    `## Lacunas`,
    ``,
    artifacts.length ? "- Validar se há fontes oficiais mais recentes para esta tarefa." : "- Alexandria não encontrou contexto suficiente. Hermione deve curar ou criar fonte para este tema.",
  ];

  return {
    query: options.query,
    agent: options.agent,
    domain: options.domain || null,
    generatedAt,
    artifactCount: artifacts.length,
    mode: result.mode,
    markdown: lines.join("\n"),
    artifacts: artifacts.map((artifact) => ({
      id: artifact.id,
      title: artifact.title,
      type: artifact.artifact_type,
      status: artifact.status,
      scope: artifact.scope,
      summary: artifact.summary,
      tags: artifact.tags || [],
      updated_at: artifact.updated_at,
      metadata: artifact.metadata || {},
    })),
  };
}

function renderArtifactExcerpt(artifact: ArtifactSummary) {
  const content = String(artifact.content || artifact.summary || "").trim();
  const excerpt = content.length > 1200 ? `${content.slice(0, 1200)}...` : content;
  return [
    `### ${artifact.title}`,
    `- ID: ${artifact.id}`,
    `- Tipo: ${artifact.artifact_type}`,
    `- Status: ${artifact.status}`,
    `- Escopo: ${artifact.scope || "geral"}`,
    `- Tags: ${(artifact.tags || []).join(", ") || "sem tags"}`,
    ``,
    excerpt || artifact.summary || "Sem conteúdo/resumo disponível.",
  ].join("\n");
}

async function supabaseRest(path: string) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `Supabase REST ${response.status}`);
  }

  return payload;
}

function sanitizeSearch(value: string) {
  return String(value || "")
    .trim()
    .replace(/[,%()]/g, "")
    .slice(0, 160);
}

function bearerToken(value: string | null): string {
  if (!value) return "";
  return value.toLowerCase().startsWith("bearer ") ? value.slice(7).trim() : value.trim();
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
