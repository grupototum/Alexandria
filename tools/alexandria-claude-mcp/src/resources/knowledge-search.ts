import { z } from "zod";
import type { Config } from "../config.js";
import type { Logger } from "../logger.js";
import { getSupabase } from "../supabase.js";
import { generateEmbedding, loadEmbeddingConfig } from "../embeddings.js";
import type { ResourceContent } from "./metadata-agents.js";

export const KNOWLEDGE_SEARCH_URI_TEMPLATE = "alexandria://knowledge/search{?q,limit}";
export const KNOWLEDGE_SEARCH_URI_BASE = "alexandria://knowledge/search";

const QuerySchema = z.object({
  q: z.string().min(1, "query 'q' obrigatória"),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

/**
 * Linhas retornadas pela RPC `match_documents` contra `giles_knowledge`:
 *   TABLE(id uuid, doc_id text, content text, hierarchical_path text,
 *         metadata jsonb, similarity float8)
 * Fonte: ALEXANDRIA_SCHEMA_2026-06-03.md §4.
 */
export interface GilesMatch {
  id: string;
  doc_id: string;
  content: string;
  hierarchical_path: string;
  metadata: unknown;
  similarity: number;
}

/**
 * RESOURCE `alexandria://knowledge/search?q=<query>&limit=<n>`
 *
 * Busca semântica em `giles_knowledge` (657 linhas, 100% embedded) via RPC
 * `match_documents(query_embedding vector, match_threshold float, match_count int)`.
 *
 * Armadilhas aplicadas (ALEXANDRIA_SCHEMA_2026-06-03.md):
 *   A) embedding é gerado AQUI (`embeddings.ts`); jamais chamar `generate_embedding`
 *      no banco — ele é placeholder e retorna NULL.
 *   B) vetor 768d (text-embedding-004 default; M79 vai confirmar).
 *   C) cosine via `<=>` operator — abstraído pela RPC.
 *
 * NÃO há fallback `ilike` aqui: se a busca vetorial falhar, propagamos o
 * erro pro chamador. Cair em fallback textual sobre uma base que assume
 * vetor mascara incidente real e deve ser tratado.
 */
export async function readKnowledgeSearch(params: {
  uri: string;
  config: Config;
  logger: Logger;
}): Promise<ResourceContent> {
  const { uri, config, logger } = params;
  const parsed = parseQuery(uri);

  const embeddingCfg = loadEmbeddingConfig();
  const queryEmbedding = await generateEmbedding(parsed.q, embeddingCfg);
  logger.debug(
    { q: parsed.q, model: embeddingCfg.model, dim: queryEmbedding.length },
    "knowledge: query embedding generated",
  );

  const supabase = getSupabase(config);
  const rpc = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_threshold: config.supabase.knowledgeThreshold,
    match_count: parsed.limit,
  });
  if (rpc.error) {
    throw new Error(`match_documents (giles_knowledge) falhou: ${rpc.error.message}`);
  }

  const matches = (rpc.data ?? []) as GilesMatch[];
  return jsonResource(uri, {
    source: "giles_knowledge",
    rpc: "match_documents",
    embedding_model: embeddingCfg.model,
    threshold: config.supabase.knowledgeThreshold,
    limit: parsed.limit,
    matches,
  });
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
    q: url.searchParams.get("q") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
}
