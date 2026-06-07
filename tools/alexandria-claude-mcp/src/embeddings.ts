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

export interface EmbeddingConfig {
  provider: "google" | "stub";
  model: string;
  apiKey?: string;
  dimensions: number;
}

export function loadEmbeddingConfig(): EmbeddingConfig {
  const provider = (process.env.EMBEDDING_PROVIDER ?? "google") as "google" | "stub";
  const model = process.env.EMBEDDING_MODEL ?? "gemini-embedding-001";
  const dimensions = Number(process.env.EMBEDDING_DIMENSIONS ?? 768);
  return {
    provider,
    model,
    dimensions,
    ...(process.env.EMBEDDING_API_KEY ? { apiKey: process.env.EMBEDDING_API_KEY } : {}),
  };
}

const GoogleEmbedResponseSchema = z.object({
  embedding: z.object({
    values: z.array(z.number()),
  }),
});

/**
 * Gera um vetor de embedding para `text`. Retorna `number[]` na dimensão
 * configurada (default 768). Em modo `stub` (testes), retorna um vetor
 * pseudo-determinístico — útil para asserts mas inútil semanticamente.
 */
export async function generateEmbedding(
  text: string,
  cfg: EmbeddingConfig,
): Promise<number[]> {
  if (!text.trim()) {
    throw new Error("generateEmbedding: input vazio");
  }

  if (cfg.provider === "stub") {
    return deterministicStub(text, cfg.dimensions);
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
  return parsed.embedding.values;
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
  // Normaliza para a esfera unitária (cosine ≡ produto interno).
  let norm = 0;
  for (const v of out) norm += v * v;
  norm = Math.sqrt(norm) || 1;
  return out.map((v) => v / norm);
}
