import { describe, it, expect, vi, afterEach } from "vitest";
import { generateEmbedding, type EmbeddingConfig } from "../src/embeddings.js";

const STUB_CFG: EmbeddingConfig = {
  provider: "stub",
  model: "stub-model",
  dimensions: 768,
};

describe("embeddings — stub provider", () => {
  it("retorna vetor na dimensão configurada", async () => {
    const vec = await generateEmbedding("hello world", STUB_CFG);
    expect(vec.length).toBe(768);
  });

  it("é determinístico (mesmo input → mesmo vetor)", async () => {
    const a = await generateEmbedding("alexandria", STUB_CFG);
    const b = await generateEmbedding("alexandria", STUB_CFG);
    expect(a).toEqual(b);
  });

  it("rejeita texto vazio", async () => {
    await expect(generateEmbedding("   ", STUB_CFG)).rejects.toThrow(/vazio/);
  });

  it("retorna vetor normalizado (norma ≈ 1)", async () => {
    const vec = await generateEmbedding("normalize me", STUB_CFG);
    const norm = Math.sqrt(vec.reduce((acc, v) => acc + v * v, 0));
    expect(norm).toBeCloseTo(1, 5);
  });
});

describe("embeddings — google provider", () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("rejeita se EMBEDDING_API_KEY ausente", async () => {
    const cfg: EmbeddingConfig = {
      provider: "google",
      model: "text-embedding-004",
      dimensions: 768,
    };
    await expect(generateEmbedding("x", cfg)).rejects.toThrow(/EMBEDDING_API_KEY/);
  });

  it("chama Gemini e valida dimensão", async () => {
    const fakeVec = new Array<number>(768).fill(0.001);
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ embedding: { values: fakeVec } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as unknown as typeof fetch;

    const cfg: EmbeddingConfig = {
      provider: "google",
      model: "text-embedding-004",
      dimensions: 768,
      apiKey: "fake",
    };
    const vec = await generateEmbedding("hello", cfg);
    expect(vec.length).toBe(768);
  });

  it("rejeita quando dimensão da resposta não bate", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ embedding: { values: [1, 2, 3] } }), { status: 200 }),
    ) as unknown as typeof fetch;

    const cfg: EmbeddingConfig = {
      provider: "google",
      model: "text-embedding-004",
      dimensions: 768,
      apiKey: "fake",
    };
    await expect(generateEmbedding("hi", cfg)).rejects.toThrow(/dimension mismatch/);
  });
});
