/**
 * Modelo de embedding canônico do Alexandria (M134).
 *
 * `text-embedding-004` foi DEPRECADO pelo Google (404 em v1/v1beta). Migrado
 * para `gemini-embedding-001` com `outputDimensionality=768` (MRL — Matryoshka),
 * mantendo o schema pgvector `vector(768)` e o índice HNSW (teto de índice do
 * pgvector é 2000 dims; 768 cabe nativo).
 *
 * Helper DRY dos call-sites do frontend (search, ingestion, Hermione). O MCP
 * server (`tools/alexandria-claude-mcp`) tem seu próprio cliente env-driven —
 * pacote separado, não importa daqui.
 */

export const EMBEDDING_MODEL = 'gemini-embedding-001';
export const EMBEDDING_DIM = 768;

/**
 * Gera um embedding via Gemini. Retorna `null` em falta de key/erro/dimensão
 * inesperada — cada caller decide o fallback (busca textual, etc.). NUNCA
 * lança: o frontend degrada graciosamente.
 */
export async function geminiEmbed(
  text: string,
  opts?: { maxChars?: number },
): Promise<number[] | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) return null;

  const input = opts?.maxChars ? text.substring(0, opts.maxChars) : text;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${EMBEDDING_MODEL}`,
          content: { parts: [{ text: input }] },
          outputDimensionality: EMBEDDING_DIM,
        }),
      },
    );
    if (!response.ok) {
      console.warn(`geminiEmbed: http ${response.status} — fallback`);
      return null;
    }
    const data = await response.json();
    const values: number[] = data?.embedding?.values ?? [];
    if (values.length !== EMBEDDING_DIM) {
      console.warn(`geminiEmbed: dim ${values.length} != ${EMBEDDING_DIM} — fallback`);
      return null;
    }
    return values;
  } catch (err) {
    console.warn('geminiEmbed: falhou — fallback:', err);
    return null;
  }
}
