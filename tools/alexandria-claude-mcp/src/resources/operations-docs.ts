import { z } from "zod";
import type { Config } from "../config.js";
import type { Logger } from "../logger.js";
import { getSupabase } from "../supabase.js";
import { generateEmbedding, loadEmbeddingConfig } from "../embeddings.js";
import type { ResourceContent } from "./metadata-agents.js";

export const OPERATIONS_DOCS_URI_TEMPLATE = "alexandria://operations/docs{?type,q,limit}";
export const OPERATIONS_DOCS_URI_BASE = "alexandria://operations/docs";

const DocTypeSchema = z.enum(["doc", "pop", "skill"]);

const QuerySchema = z.object({
  type: DocTypeSchema.default("doc"),
  q: z.string().min(1, "query 'q' obrigatória"),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

/**
 * Linhas retornadas por `search_docs/search_pops/search_skills`:
 *   TABLE(id uuid, title text, content text, doc_type text, path text,
 *         relevance float8)
 * Fonte: ALEXANDRIA_SCHEMA_2026-06-03.md §4.
 */
export interface AlexandriaDocMatch {
  id: string;
  title: string;
  content: string;
  doc_type: string;
  path: string | null;
  relevance: number;
}

/**
 * RESOURCE `alexandria://operations/docs?type={doc|pop|skill}&q={query}&limit={n}`
 *
 * Busca semântica em `alexandria_documents` (RLS authenticated read,
 * service_role write). Cada `type` mapeia pra uma RPC dedicada:
 *   - doc   → search_docs(query_embedding, threshold, count, doc_type='doc')
 *   - pop   → search_pops (mesma assinatura)
 *   - skill → search_skills
 *
 * São RPCs separadas (decisão arquitetural M75) — não unificar com
 * alexandria://knowledge/search (que ataca giles_knowledge, dataset
 * totalmente diferente).
 */
export async function readOperationsDocs(params: {
  uri: string;
  config: Config;
  logger: Logger;
}): Promise<ResourceContent> {
  const { uri, config, logger } = params;
  const parsed = parseQuery(uri);

  const embeddingCfg = loadEmbeddingConfig();
  const queryEmbedding = await generateEmbedding(parsed.q, embeddingCfg);

  const rpcName = rpcByType(parsed.type);
  logger.debug(
    { q: parsed.q, type: parsed.type, rpc: rpcName, dim: queryEmbedding.length },
    "operations: query embedding generated",
  );

  const supabase = getSupabase(config);
  const rpc = await supabase.rpc(rpcName, {
    query_embedding: queryEmbedding,
    match_threshold: config.supabase.knowledgeThreshold,
    match_count: parsed.limit,
  });
  if (rpc.error) {
    throw new Error(`${rpcName} (alexandria_documents) falhou: ${rpc.error.message}`);
  }

  const matches = (rpc.data ?? []) as AlexandriaDocMatch[];
  return jsonResource(uri, {
    source: "alexandria_documents",
    rpc: rpcName,
    doc_type: parsed.type,
    embedding_model: embeddingCfg.model,
    threshold: config.supabase.knowledgeThreshold,
    limit: parsed.limit,
    matches,
  });
}

function rpcByType(type: z.infer<typeof DocTypeSchema>): "search_docs" | "search_pops" | "search_skills" {
  switch (type) {
    case "doc":
      return "search_docs";
    case "pop":
      return "search_pops";
    case "skill":
      return "search_skills";
  }
}

function jsonResource(uri: string, payload: unknown): ResourceContent {
  return {
    uri,
    mimeType: "application/json",
    text: JSON.stringify(payload, null, 2),
  };
}

function parseQuery(uri: string): z.infer<typeof QuerySchema> {
  const url = new URL(uri);
  return QuerySchema.parse({
    type: url.searchParams.get("type") ?? undefined,
    q: url.searchParams.get("q") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
}
