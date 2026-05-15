declare const Deno: {
  env: { get(key: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

type ToolAction = "search" | "get_pop" | "get_client_brief" | "capture";

interface ProxyRequest {
  action?: ToolAction;
  artifactType?: string;
  author?: string;
  clientName?: string;
  content?: string;
  limit?: number;
  metadata?: Record<string, unknown>;
  popId?: string;
  query?: string;
  sourceName?: string;
  sourceUrl?: string;
  status?: string;
  tags?: string[];
  title?: string;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const CAPTURE_TOKEN = Deno.env.get("ALEXANDRIA_CAPTURE_TOKEN") || "";
const BASE_URL =
  Deno.env.get("ALEXANDRIA_PROXY_PUBLIC_URL") ||
  "https://cgpkfhrqprqptvehatad.supabase.co/functions/v1/alexandria-proxy";

const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({ ok: true });

  if (req.method === "GET") {
    return json(pluginManifest());
  }

  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return json({ error: "supabase_service_not_configured" }, 500);
  }

  try {
    const body = (await req.json().catch(() => ({}))) as ProxyRequest;
    const routeAction = actionFromPath(new URL(req.url).pathname);
    const action = routeAction || body.action || "search";

    if (action === "search") {
      return json(await searchAlexandria(body.query || "", body.limit, body.artifactType));
    }

    if (action === "get_pop") {
      return json(await getPop(body.popId, body.query));
    }

    if (action === "get_client_brief") {
      return json(await getClientBrief(body.clientName || body.query || "", body.limit));
    }

    if (action === "capture") {
      assertCaptureAuthorized(req);
      return json(await captureAlexandriaOutput(body), 201);
    }

    return json({ error: "unknown_action" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return json({ error: message }, errorStatus(message));
  }
});

function pluginManifest() {
  return {
    "$schema": "https://chat-plugins.lobehub.com/schema/plugin/v1.json",
    api: [
      {
        description:
          "Busca conhecimento na Alexandria, o second brain do Totum OS. Use para POPs, skills, decisoes, fontes, contexto institucional ou artefatos Hermione.",
        name: "searchAlexandria",
        parameters: {
          properties: {
            artifactType: {
              description: "Filtro opcional por tipo: pop, skill, prompt, decision, document, context_pack.",
              type: "string",
            },
            limit: {
              default: 8,
              description: "Quantidade de resultados, de 1 a 20.",
              type: "number",
            },
            query: {
              description: "Pergunta ou tema em linguagem natural.",
              type: "string",
            },
          },
          required: ["query"],
          type: "object",
        },
        url: `${BASE_URL}/search`,
      },
      {
        description:
          "Retorna um POP especifico por ID, ou busca POPs por titulo/departamento quando receber uma consulta.",
        name: "getPop",
        parameters: {
          properties: {
            popId: {
              description: "ID do POP, quando conhecido.",
              type: "string",
            },
            query: {
              description: "Titulo, departamento ou termo para localizar o POP.",
              type: "string",
            },
          },
          type: "object",
        },
        url: `${BASE_URL}/pop`,
      },
      {
        description:
          "Busca briefings, decisoes e contexto de um cliente na Alexandria antes de montar estrategias ou entregaveis.",
        name: "getClientBrief",
        parameters: {
          properties: {
            clientName: {
              description: "Nome do cliente ou conta.",
              type: "string",
            },
            limit: {
              default: 6,
              description: "Quantidade de artefatos de contexto.",
              type: "number",
            },
          },
          required: ["clientName"],
          type: "object",
        },
        url: `${BASE_URL}/client-brief`,
      },
    ],
    author: "Totum",
    homepage: "https://alexandria.grupototum.com",
    identifier: "alexandria",
    meta: {
      avatar: "📚",
      description: "Consulta o second brain do Totum OS",
      tags: ["knowledge", "totum", "rag"],
      title: "Alexandria",
    },
    version: "1.1.0",
  };
}

async function captureAlexandriaOutput(input: ProxyRequest) {
  const content = sanitizeContent(input.content || "");
  if (!content) {
    throw new Error("capture_content_required");
  }

  const sourceName = sanitizePlainText(input.sourceName || input.title || "captura-alexandria.md", 180);
  const title = sanitizePlainText(input.title || extractTitle(content) || sourceName, 180);
  const artifactType = normalizeArtifactType(input.artifactType || inferArtifactType(sourceName, content));
  const status = normalizeStatus(input.status || "review");
  const tags = normalizeTags([...(input.tags || []), artifactType, "captura"]);
  const contentHash = await hashContent(`${sourceName}\n${content}`);
  const metadata = sanitizeMetadata({
    ...(input.metadata || {}),
    capturedBy: "alexandria-proxy",
    sourceUrl: input.sourceUrl || null,
  });

  const sourceRows = await supabaseRestWrite(
    "/rest/v1/hermione_sources?on_conflict=content_hash",
    {
      author: sanitizePlainText(input.author || "n8n-capture", 120),
      content,
      content_hash: contentHash,
      detected_type: artifactType,
      file_name: sourceName,
      metadata,
      origin: input.sourceUrl ? "external_capture" : "n8n_capture",
      source_type: sourceName.toLowerCase().match(/\.(md|markdown)$/) ? "markdown" : "text",
      tags,
      title,
    },
    "POST",
    { prefer: "resolution=merge-duplicates,return=representation" }
  );
  const source = Array.isArray(sourceRows) ? sourceRows[0] : sourceRows;
  if (!source?.id) throw new Error("capture_source_insert_failed");

  const artifactRows = await supabaseRestWrite(
    "/rest/v1/hermione_artifacts",
    {
      artifact_type: artifactType,
      content: renderCapturedArtifact({ content, metadata, sourceName, title }),
      metadata: {
        ...metadata,
        sourceCount: 1,
        sourceId: source.id,
      },
      scope: "totum",
      status,
      summary: summarizeContent(content),
      tags,
      title,
      version: 1,
    },
    "POST"
  );
  const artifact = Array.isArray(artifactRows) ? artifactRows[0] : artifactRows;
  if (!artifact?.id) throw new Error("capture_artifact_insert_failed");

  await supabaseRestWrite("/rest/v1/hermione_artifact_versions", {
    artifact_id: artifact.id,
    change_note: "Captura automatica via Alexandria proxy",
    content: artifact.content,
    metadata: artifact.metadata || {},
    version: 1,
  });

  await supabaseRestWrite("/rest/v1/hermione_artifact_sources", {
    artifact_id: artifact.id,
    contribution_type: "source",
    source_id: source.id,
  });

  await supabaseRestWrite("/rest/v1/hermione_consultations", {
    artifact_ids: [artifact.id],
    metadata: {
      captureSource: sourceName,
      capturedBy: "alexandria-proxy",
    },
    query: `Captura automatica: ${title}`,
    response: summarizeContent(content),
    source_ids: [source.id],
  });

  return {
    artifact: normalizeArtifacts([artifact])[0],
    source: {
      id: source.id,
      title: source.title,
    },
  };
}

async function searchAlexandria(query: string, limit = 8, artifactType?: string) {
  const safeLimit = clampLimit(limit, 8);
  const safeQuery = sanitizeSearch(query);
  const params = new URLSearchParams({
    limit: String(safeLimit),
    order: "updated_at.desc",
    select: "id,title,artifact_type,status,scope,summary,tags,updated_at,metadata",
    status: "not.in.(deprecated,superseded)",
  });

  if (artifactType) params.set("artifact_type", `eq.${artifactType}`);
  if (safeQuery) {
    params.set("or", `(title.ilike.*${safeQuery}*,summary.ilike.*${safeQuery}*,content.ilike.*${safeQuery}*)`);
  }

  const rows = await supabaseRest(`/rest/v1/hermione_artifacts?${params.toString()}`);
  const artifacts = normalizeArtifacts(Array.isArray(rows) ? rows : []);

  return {
    count: artifacts.length,
    query,
    results: artifacts,
  };
}

async function getPop(popId?: string, query?: string) {
  const params = new URLSearchParams({
    limit: popId ? "1" : "5",
    order: "updated_at.desc",
    select: "*",
  });

  if (popId) {
    params.set("id", `eq.${popId}`);
  } else {
    const safeQuery = sanitizeSearch(query || "");
    if (safeQuery) {
      params.set("or", `(titulo.ilike.*${safeQuery}*,departamento.ilike.*${safeQuery}*,descricao.ilike.*${safeQuery}*)`);
    }
  }

  const rows = await supabaseRest(`/rest/v1/pops?${params.toString()}`);
  const pops = (Array.isArray(rows) ? rows : []).map((pop) => ({
    department: pop.departamento || null,
    description: pop.descricao || "",
    id: pop.id,
    owner: pop.responsavel || null,
    sla_hours: pop.sla_horas ?? null,
    status: pop.status || null,
    title: pop.titulo || "POP sem titulo",
    updated_at: pop.updated_at || pop.created_at || null,
  }));

  return {
    count: pops.length,
    pop: popId ? pops[0] || null : undefined,
    pops,
    query: query || popId || "",
  };
}

async function getClientBrief(clientName: string, limit = 6) {
  const safeClientName = sanitizeSearch(clientName);
  if (!safeClientName) {
    return { clientName, count: 0, results: [] };
  }

  const params = new URLSearchParams({
    limit: String(clampLimit(limit, 6)),
    order: "updated_at.desc",
    select: "id,title,artifact_type,status,scope,summary,tags,updated_at,metadata",
    status: "not.in.(deprecated,superseded)",
  });
  params.set("or", `(title.ilike.*${safeClientName}*,summary.ilike.*${safeClientName}*,content.ilike.*${safeClientName}*)`);

  const rows = await supabaseRest(`/rest/v1/hermione_artifacts?${params.toString()}`);
  const artifacts = normalizeArtifacts(Array.isArray(rows) ? rows : []);

  return {
    clientName,
    count: artifacts.length,
    results: artifacts,
  };
}

async function supabaseRest(path: string) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `supabase_rest_${response.status}`);
  }

  return payload;
}

async function supabaseRestWrite(
  path: string,
  body: Record<string, unknown>,
  method = "POST",
  options: { prefer?: string } = {}
) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      apikey: SERVICE_ROLE_KEY,
      authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    method,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `supabase_write_${response.status}`);
  }

  return payload;
}

function normalizeArtifacts(rows: Array<Record<string, unknown>>) {
  return rows.map((item) => ({
    id: item.id,
    metadata: item.metadata || {},
    scope: item.scope || null,
    status: item.status || null,
    summary: item.summary || "",
    tags: item.tags || [],
    title: item.title || "(sem titulo)",
    type: item.artifact_type || "document",
    updated_at: item.updated_at || null,
  }));
}

function actionFromPath(pathname: string): ToolAction | null {
  if (pathname.endsWith("/search")) return "search";
  if (pathname.endsWith("/pop")) return "get_pop";
  if (pathname.endsWith("/client-brief")) return "get_client_brief";
  if (pathname.endsWith("/capture")) return "capture";
  return null;
}

function clampLimit(value: number | undefined, fallback: number) {
  const numeric = Number(value || fallback);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(Math.max(Math.trunc(numeric), 1), 20);
}

function sanitizeSearch(value: string) {
  return String(value || "")
    .trim()
    .replace(/[,%()]/g, "")
    .slice(0, 160);
}

function assertCaptureAuthorized(req: Request) {
  if (!CAPTURE_TOKEN) {
    throw new Error("capture_token_not_configured");
  }

  const header = req.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (token !== CAPTURE_TOKEN) {
    throw new Error("capture_unauthorized");
  }
}

function sanitizeContent(value: string) {
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 120000);
}

function sanitizePlainText(value: string, limit: number) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

function sanitizeMetadata(value: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(value).filter(([key, item]) => key.length <= 80 && isJsonSafe(item))
  );
}

function isJsonSafe(value: unknown): boolean {
  if (value === null) return true;
  if (["string", "number", "boolean"].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(isJsonSafe);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).every(isJsonSafe);
  }
  return false;
}

async function hashContent(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeTags(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((tag) => sanitizePlainText(tag, 40).toLowerCase())
        .filter(Boolean)
    )
  ).slice(0, 12);
}

function normalizeArtifactType(value: string) {
  const allowed = new Set(["skill", "pop", "prompt", "decision", "summary", "document", "context_pack"]);
  return allowed.has(value) ? value : "document";
}

function normalizeStatus(value: string) {
  const allowed = new Set(["draft", "review", "approved", "deprecated", "superseded"]);
  return allowed.has(value) ? value : "review";
}

function inferArtifactType(sourceName: string, content: string) {
  const lower = `${sourceName}\n${content}`.toLowerCase();
  if (lower.includes("## entradas") || lower.includes("quando usar") || lower.includes("skill_id")) return "skill";
  if (lower.includes("pop") || lower.includes("procedimento operacional")) return "pop";
  if (lower.includes("decisão") || lower.includes("decisao")) return "decision";
  if (lower.includes("prompt")) return "prompt";
  if (content.length < 1200) return "summary";
  return "document";
}

function extractTitle(content: string) {
  return content.match(/^#\s+(.+)$/m)?.[1] || content.split("\n").find((line) => line.trim().length > 12);
}

function summarizeContent(content: string) {
  return sanitizePlainText(content.split(/\n{2,}/)[0] || content, 320);
}

function renderCapturedArtifact(input: {
  content: string;
  metadata: Record<string, unknown>;
  sourceName: string;
  title: string;
}) {
  return [
    `# ${input.title}`,
    "",
    `Fonte: ${input.sourceName}`,
    "",
    "## Conteudo capturado",
    "",
    input.content,
    "",
    "## Metadados",
    "",
    "```json",
    JSON.stringify(input.metadata, null, 2),
    "```",
  ].join("\n");
}

function errorStatus(message: string) {
  if (message === "capture_unauthorized") return 401;
  if (message === "capture_token_not_configured") return 503;
  if (message === "capture_content_required") return 400;
  return 500;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    status,
  });
}
