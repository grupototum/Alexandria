import { describe, it, expect, vi, afterEach } from "vitest";
import { generateEmbedding, type EmbeddingConfig } from "../src/embeddings.js";

/**
 * Cobertura de error-paths do cliente de embedding (M140·D). Complementa
 * embeddings.test.ts sem editá-lo (evita conflito com PRs em voo).
 */
const googleCfg: EmbeddingConfig = {
  provider: "google",
  model: "text-embedding-004",
  dimensions: 768,
  apiKey: "fake",
};

describe("embeddings — error paths (google)", () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("lança em http não-2xx (ex: 404 modelo deprecado)", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response("model not found", { status: 404 }),
    ) as unknown as typeof fetch;
    await expect(generateEmbedding("x", googleCfg)).rejects.toThrow(/http 404/);
  });

  it("lança em 401 (auth inválida)", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response("unauthorized", { status: 401 }),
    ) as unknown as typeof fetch;
    await expect(generateEmbedding("x", googleCfg)).rejects.toThrow(/http 401/);
  });

  it("propaga erro de rede (fetch lança — timeout/conn refused)", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error("ETIMEDOUT");
    }) as unknown as typeof fetch;
    await expect(generateEmbedding("x", googleCfg)).rejects.toThrow(/ETIMEDOUT/);
  });

  it("rejeita input vazio antes de qualquer chamada de rede", async () => {
    const spy = vi.fn();
    globalThis.fetch = spy as unknown as typeof fetch;
    await expect(generateEmbedding("   ", googleCfg)).rejects.toThrow(/vazio/);
    expect(spy).not.toHaveBeenCalled();
  });

  it("rejeita quando apiKey ausente no provider google", async () => {
    const cfg: EmbeddingConfig = { provider: "google", model: "m", dimensions: 768 };
    await expect(generateEmbedding("x", cfg)).rejects.toThrow(/EMBEDDING_API_KEY/);
  });
});
