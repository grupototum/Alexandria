import { describe, it, expect, vi, afterEach } from "vitest";
import { generateEmbedding, normalizeL2, type EmbeddingConfig } from "../src/embeddings.js";

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
      model: "gemini-embedding-001",
      dimensions: 768,
      apiKey: "fake",
    };
    await expect(generateEmbedding("hi", cfg)).rejects.toThrow(/dimension mismatch/);
  });

  it("L2-normaliza o vetor do Google (MRL truncado vem não-normalizado)", async () => {
    // Vetor não-normalizado: 768 × 0.5 → norma = sqrt(768)·0.5 ≈ 13.86, longe de 1.
    const unnormalized = new Array<number>(768).fill(0.5);
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ embedding: { values: unnormalized } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as unknown as typeof fetch;

    const cfg: EmbeddingConfig = {
      provider: "google",
      model: "gemini-embedding-001",
      dimensions: 768,
      apiKey: "fake",
    };
    const vec = await generateEmbedding("normalize me", cfg);
    const norm = Math.sqrt(vec.reduce((acc, v) => acc + v * v, 0));
    expect(norm).toBeCloseTo(1, 6);
  });
});

describe("normalizeL2", () => {
  it("retorna ||v|| ≈ 1 para vetor não-nulo", () => {
    const out = normalizeL2([3, 4]); // norma 5 → [0.6, 0.8]
    expect(Math.sqrt(out[0]! ** 2 + out[1]! ** 2)).toBeCloseTo(1, 6);
    expect(out[0]).toBeCloseTo(0.6, 6);
    expect(out[1]).toBeCloseTo(0.8, 6);
  });

  it("vetor nulo retorna como está (sem divisão por zero)", () => {
    expect(normalizeL2([0, 0, 0])).toEqual([0, 0, 0]);
  });
});
