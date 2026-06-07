import { describe, it, expect, vi, afterEach } from 'vitest';
import { geminiEmbed, normalizeL2, EMBEDDING_DIM } from './embeddingModel';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('normalizeL2', () => {
  it('retorna ||v|| ≈ 1 para vetor não-nulo', () => {
    const out = normalizeL2([3, 4]); // norma 5 → [0.6, 0.8]
    expect(out[0]).toBeCloseTo(0.6, 6);
    expect(out[1]).toBeCloseTo(0.8, 6);
    expect(Math.sqrt(out[0] ** 2 + out[1] ** 2)).toBeCloseTo(1, 6);
  });

  it('vetor nulo retorna como está (sem divisão por zero)', () => {
    expect(normalizeL2([0, 0, 0])).toEqual([0, 0, 0]);
  });
});

describe('geminiEmbed', () => {
  it('sem VITE_GEMINI_API_KEY → null (degrada p/ fallback)', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    expect(await geminiEmbed('x', { taskType: 'RETRIEVAL_QUERY' })).toBeNull();
  });

  it('normaliza (|v|≈1), valida dim 768 e envia taskType + outputDimensionality', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'fake');
    const unnormalized = new Array<number>(EMBEDDING_DIM).fill(0.5); // norma ≈ 13.86
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ embedding: { values: unnormalized } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const vec = await geminiEmbed('hello', { taskType: 'RETRIEVAL_DOCUMENT' });
    expect(vec).not.toBeNull();
    expect(vec!.length).toBe(768);
    expect(Math.sqrt(vec!.reduce((a, v) => a + v * v, 0))).toBeCloseTo(1, 6);

    // O body precisa carregar o modelo novo + os params do M134.
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe('models/gemini-embedding-001');
    expect(body.taskType).toBe('RETRIEVAL_DOCUMENT');
    expect(body.outputDimensionality).toBe(768);
  });

  it('dimensão inesperada → null (guard contra corrupção silenciosa)', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'fake');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ embedding: { values: [1, 2, 3] } }), { status: 200 })),
    );
    expect(await geminiEmbed('x', { taskType: 'RETRIEVAL_QUERY' })).toBeNull();
  });

  it('http !ok (ex: 404 modelo morto) → null (degrada, não lança)', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'fake');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('not found', { status: 404 })));
    expect(await geminiEmbed('x', { taskType: 'RETRIEVAL_QUERY' })).toBeNull();
  });

  it('respeita maxChars (trunca o input enviado)', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'fake');
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ embedding: { values: new Array<number>(EMBEDDING_DIM).fill(0.1) } }), {
          status: 200,
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    await geminiEmbed('a'.repeat(5000), { taskType: 'RETRIEVAL_DOCUMENT', maxChars: 500 });
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.content.parts[0].text.length).toBe(500);
  });
});
