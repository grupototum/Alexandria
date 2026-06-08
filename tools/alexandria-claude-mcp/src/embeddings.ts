import { z } from "zod";

/**
 * Embedding client — gera vetor CLIENT-SIDE pra passar pras RPCs do Supabase.
 *
 * Armadilha do schema (ALEXANDRIA_SCHEMA_2026-06-03.md §A): a função SQL
 * `generate_embedding(text)` é um PLACEHOLDER que retorna NULL. NUNCA chamar.
 * Geração tem que ser aqui no servidor MCP.
 *
 * Dimensão: 768 (giles_knowledge / alexandria_documents / hermione base).
 * Modelo default: gemini-embedding-001 @ outputDimensionality=768 (M134).
 * `text-embedding-004` foi deprecado pelo Google (404). MRL truncado <3072
 * vem NÃO-normalizado → L2-norm aplicada antes de devolver (cosine).
 */

export type EmbeddingProvider = "google" | "ollama" | "stub";

export interface EmbeddingConfig {
  provider: EmbeddingProvider;
  model: string;
  apiKey?: string;
  dimensions: number;
  // Endpoint do Ollama local (loopback na VPS) quando provider='ollama'.
  ollamaUrl?: string;
}

export function loadEmbeddingConfig(): EmbeddingConfig {
  const provider = (process.env.EMBEDDING_PROVIDER ?? "google") as EmbeddingProvider;
  // Default de modelo é provider-aware: nomic no Ollama, gemini no Google.
  const defaultModel = provider === "ollama" ? "nomic-embed-text" : "gemini-embedding-001";
  const model = process.env.EMBEDDING_MODEL ?? defaultModel;
  const dimensions = Number(process.env.EMBEDDING_DIMENSIONS ?? 768);
  return {
    provider,
    model,
    dimensions,
    ollamaUrl: process.env.OLLAMA_URL ?? "http://127.0.0.1:11434",
    ...(process.env.EMBEDDING_API_KEY ? { apiKey: process.env.EMBEDDING_API_KEY } : {}),
  };
}

const GoogleEmbedResponseSchema = z.object({
  embedding: z.object({
    values: z.array(z.number()),
  }),
});

// Ollama /api/embed devolve { embeddings: [[...]] } (array de vetores, 1 por input).
const OllamaEmbedResponseSchema = z.object({
  embeddings: z.array(z.array(z.number())).min(1),
});

/**
 * Gera um vetor de embedding para `text`. Retorna `number[]` na dimensão
 * configurada (default 768). Em modo `stub` (testes), retorna um vetor
 * pseudo-determinístico — útil para asserts mas inútil semanticamente.
 */
export type EmbeddingTaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

export async function generateEmbedding(
  text: string,
  cfg: EmbeddingConfig,
  // O MCP só embeda QUERIES de busca (ingestão é no app frontend) → default QUERY.
  taskType: EmbeddingTaskType = "RETRIEVAL_QUERY",
): Promise<number[]> {
  if (!text.trim()) {
    throw new Error("generateEmbedding: input vazio");
  }

  if (cfg.provider === "stub") {
    return deterministicStub(text, cfg.dimensions);
  }

  if (cfg.provider === "ollama") {
    // Ollama local (loopback VPS) — nomic-embed-text @ 768d, sem API key.
    // taskType é ignorado (nomic não distingue document/query).
    const base = cfg.ollamaUrl ?? "http://127.0.0.1:11434";
    const response = await fetch(`${base}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: cfg.model, input: text }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`embedding provider http ${response.status}: ${body.slice(0, 200)}`);
    }
    const raw: unknown = await response.json();
    const parsed = OllamaEmbedResponseSchema.parse(raw);
    const values = parsed.embeddings[0];
    if (!values || values.length !== cfg.dimensions) {
      throw new Error(
        `embedding dimension mismatch: got ${values?.length ?? 0}, expected ${cfg.dimensions}`,
      );
    }
    // nomic já devolve normalizado; re-normalizamos por garantia (idempotente).
    return normalizeL2(values);
  }

  if (!cfg.apiKey) {
    throw new Error(
      "EMBEDDING_API_KEY ausente — defina no .env ou use EMBEDDING_PROVIDER=stub em dev.",
    );
  }

  // Google Gemini: gemini-embedding-001 com outputDimensionality=768 (MRL).
  // text-embedding-004 foi deprecado (M134). https://ai.google.dev/gemini-api/docs/embeddings
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.model)}:embedContent?key=${cfg.apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      taskType,
      outputDimensionality: cfg.dimensions,
    }),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`embedding provider http ${response.status}: ${body.slice(0, 200)}`);
  }
  const raw: unknown = await response.json();
  const parsed = GoogleEmbedResponseSchema.parse(raw);
  if (parsed.embedding.values.length !== cfg.dimensions) {
    throw new Error(
      `embedding dimension mismatch: got ${parsed.embedding.values.length}, expected ${cfg.dimensions}`,
    );
  }
  // gemini-embedding-001 com outputDimensionality<3072 (MRL) vem NÃO-normalizado
  // → L2-norm para cosine (match_documents usa cosine distance).
  return normalizeL2(parsed.embedding.values);
}

/**
 * L2-normaliza um vetor (||v|| = 1 → cosine ≡ produto interno). Vetor nulo
 * retorna como está (evita divisão por zero).
 */
export function normalizeL2(vec: number[]): number[] {
  let sumSq = 0;
  for (const v of vec) sumSq += v * v;
  const norm = Math.sqrt(sumSq);
  if (norm === 0) return vec;
  return vec.map((v) => v / norm);
}

// Stub determinístico — hash simples sobre os caracteres distribuído em [-1,1].
// Apenas para testes; não tem semântica real.
function deterministicStub(text: string, dim: number): number[] {
  const out = new Array<number>(dim).fill(0);
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    const idx = (code + i) % dim;
    const sign = (code + i) % 2 === 0 ? 1 : -1;
    const safeIdx = idx >= 0 && idx < dim ? idx : 0;
    const prev = out[safeIdx] ?? 0;
    out[safeIdx] = prev + sign * ((code % 17) / 17);
  }
  return normalizeL2(out);
}
