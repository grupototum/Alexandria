import { describe, it, expect, vi, afterEach } from "vitest";
import { generateEmbedding, loadEmbeddingConfig, type EmbeddingConfig } from "../src/embeddings.js";

/**
 * M134-C — provider 'ollama' (nomic-embed-text @ 768d, loopback VPS).
 * Mocka o /api/embed do Ollama; sem rede real.
 */
const ollamaCfg: EmbeddingConfig = {
  provider: "ollama",
  model: "nomic-embed-text",
  dimensions: 768,
  ollamaUrl: "http://127.0.0.1:11434",
};

function ollamaResponse(values: number[]) {
  return new Response(JSON.stringify({ embeddings: [values] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("embeddings — provider ollama", () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("gera vetor 768d e L2-normaliza (|v|≈1)", async () => {
    const raw = new Array<number>(768).fill(0.5); // não-normalizado de propósito
    globalThis.fetch = vi.fn(async () => ollamaResponse(raw)) as unknown as typeof fetch;

    const vec = await generateEmbedding("alexandria", ollamaCfg);
    expect(vec.length).toBe(768);
    const norm = Math.sqrt(vec.reduce((a, v) => a + v * v, 0));
    expect(norm).toBeCloseTo(1, 6);
  });

  it("POST em {ollamaUrl}/api/embed com body {model, input}", async () => {
    const fetchMock = vi.fn(async () => ollamaResponse(new Array<number>(768).fill(0.1)));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await generateEmbedding("query teste", ollamaCfg);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe("http://127.0.0.1:11434/api/embed");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.model).toBe("nomic-embed-text");
    expect(body.input).toBe("query teste");
  });

  it("usa default loopback quando ollamaUrl ausente", async () => {
    const fetchMock = vi.fn(async () => ollamaResponse(new Array<number>(768).fill(0.1)));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const cfg: EmbeddingConfig = { provider: "ollama", model: "nomic-embed-text", dimensions: 768 };
    await generateEmbedding("x", cfg);
    expect(String(fetchMock.mock.calls[0]![0])).toMatch(/127\.0\.0\.1:11434/);
  });

  it("lança em dimensão inesperada", async () => {
    globalThis.fetch = vi.fn(async () => ollamaResponse([1, 2, 3])) as unknown as typeof fetch;
    await expect(generateEmbedding("x", ollamaCfg)).rejects.toThrow(/dimension mismatch/);
  });

  it("lança em http não-2xx (Ollama down)", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response("connection refused", { status: 502 }),
    ) as unknown as typeof fetch;
    await expect(generateEmbedding("x", ollamaCfg)).rejects.toThrow(/http 502/);
  });

  it("ignora taskType (nomic não distingue document/query)", async () => {
    const fetchMock = vi.fn(async () => ollamaResponse(new Array<number>(768).fill(0.2)));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await generateEmbedding("x", ollamaCfg, "RETRIEVAL_DOCUMENT");
    const body = JSON.parse((fetchMock.mock.calls[0]![1] as RequestInit).body as string);
    expect(body.taskType).toBeUndefined();
  });
});

describe("loadEmbeddingConfig — provider-aware defaults", () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
  });

  it("EMBEDDING_PROVIDER=ollama → modelo default nomic-embed-text + url loopback", () => {
    process.env.EMBEDDING_PROVIDER = "ollama";
    delete process.env.EMBEDDING_MODEL;
    delete process.env.OLLAMA_URL;
    const cfg = loadEmbeddingConfig();
    expect(cfg.provider).toBe("ollama");
    expect(cfg.model).toBe("nomic-embed-text");
    expect(cfg.ollamaUrl).toBe("http://127.0.0.1:11434");
  });

  it("google continua default (back-compat) com gemini-embedding-001", () => {
    delete process.env.EMBEDDING_PROVIDER;
    delete process.env.EMBEDDING_MODEL;
    const cfg = loadEmbeddingConfig();
    expect(cfg.provider).toBe("google");
    expect(cfg.model).toBe("gemini-embedding-001");
  });
});
