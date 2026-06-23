/**
 * M134 — Re-index idempotente e atômico de giles_knowledge.
 *
 * Por quê: text-embedding-004 morreu (404). Os 657 embeddings existentes estão
 * num espaço vetorial inalcançável (não dá pra gerar query no mesmo modelo). Este
 * script re-embeda TODOS os chunks com gemini-embedding-001 @ outputDim=768 +
 * L2-norm + taskType=RETRIEVAL_DOCUMENT, numa coluna temporária, e troca de forma
 * atômica — busca segue funcionando na coluna antiga até o swap.
 *
 * SEGURANÇA / SEQUÊNCIA:
 *   1. DDL prévio (NÃO feito aqui — supabase-js não roda ALTER):
 *        ALTER TABLE public.giles_knowledge ADD COLUMN IF NOT EXISTS embedding_new vector(768);
 *      (o script aborta com instrução se a coluna não existir)
 *   2. Este script: preenche embedding_new + metadata, resumível (WHERE embedding_new IS NULL).
 *   3. Validação automática (count 657, dim 768, |v|≈1 em amostra).
 *   4. SWAP atômico (SQL impresso ao final, rodar manualmente após validar):
 *        BEGIN;
 *          ALTER TABLE public.giles_knowledge RENAME COLUMN embedding TO embedding_old;
 *          ALTER TABLE public.giles_knowledge RENAME COLUMN embedding_new TO embedding;
 *        COMMIT;
 *        -- recriar índice HNSW cosine + DROP embedding_old após smoke.
 *
 * USO:
 *   EMBEDDING_API_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     npx tsx scripts/reindex-giles.ts [--dry-run] [--batch=25]
 *
 * NUNCA loga secrets — só counts.
 */
import { createClient } from "@supabase/supabase-js";
import { generateEmbedding, loadEmbeddingConfig } from "../src/embeddings.js";

interface GilesRow {
  id: string | number;
  content: string | null;
  subcategoria: string | null;
}

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const BATCH = Number(
  [...args].find((a) => a.startsWith("--batch="))?.split("=")[1] ?? 25,
);

function fail(msg: string): never {
  console.error(`[reindex-giles] ERRO: ${msg}`);
  process.exit(1);
}

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) fail("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes.");

  const cfg = loadEmbeddingConfig();
  if (!DRY_RUN && cfg.provider === "stub") {
    fail("EMBEDDING_PROVIDER=stub; re-index real exige 'google' ou 'ollama'.");
  }
  // Só o provider 'google' precisa de API key; 'ollama' é loopback local.
  if (!DRY_RUN && cfg.provider === "google" && !cfg.apiKey) {
    fail("EMBEDDING_API_KEY ausente (provider google).");
  }

  const sb = createClient(url, key, { auth: { persistSession: false } });

  // Guard: a coluna temporária precisa existir (DDL prévio).
  const probe = await sb.from("giles_knowledge").select("embedding_new").limit(1);
  if (probe.error) {
    fail(
      "coluna embedding_new ausente. Rode primeiro:\n" +
        "  ALTER TABLE public.giles_knowledge ADD COLUMN IF NOT EXISTS embedding_new vector(768);",
    );
  }

  const { count: total, error: cErr } = await sb
    .from("giles_knowledge")
    .select("id", { count: "exact", head: true });
  if (cErr) fail(`count total falhou: ${cErr.message}`);

  const { count: pending, error: pErr } = await sb
    .from("giles_knowledge")
    .select("id", { count: "exact", head: true })
    .is("embedding_new", null);
  if (pErr) fail(`count pending falhou: ${pErr.message}`);

  console.log(`[reindex-giles] total=${total} pendentes=${pending} batch=${BATCH} dry-run=${DRY_RUN}`);
  if (DRY_RUN) {
    console.log("[reindex-giles] dry-run: nada gravado. Saindo.");
    return;
  }

  let done = 0;
  let failed = 0;
  // Loop resumível: sempre busca o próximo lote ainda sem embedding_new.
  for (;;) {
    const { data, error } = await sb
      .from("giles_knowledge")
      .select("id, content, subcategoria")
      .is("embedding_new", null)
      .limit(BATCH);
    if (error) fail(`select lote falhou: ${error.message}`);
    const rows = (data ?? []) as GilesRow[];
    if (rows.length === 0) break;

    for (const row of rows) {
      // Reproduz o texto de ingestão: heading (subcategoria) + content.
      const text = [row.subcategoria, row.content].filter(Boolean).join("\n\n").trim();
      if (!text) {
        failed += 1;
        console.warn(`[reindex-giles] id=${row.id} sem texto — pulado.`);
        continue;
      }
      try {
        const vec = await generateEmbedding(text, cfg, "RETRIEVAL_DOCUMENT");
        const upd = await sb
          .from("giles_knowledge")
          .update({
            embedding_new: vec,
            embedding_model: cfg.model, // gemini-embedding-001 ou nomic-embed-text
            embedding_dim: vec.length,
            embedded_at: new Date().toISOString(),
          })
          .eq("id", row.id);
        if (upd.error) throw new Error(upd.error.message);
        done += 1;
      } catch (err) {
        failed += 1;
        console.warn(`[reindex-giles] id=${row.id} falhou: ${(err as Error).message}`);
      }
    }
    console.log(`[reindex-giles] progresso: ${done} ok / ${failed} falhos / ${pending} alvo`);
    // Pausa defensiva entre lotes (rate-limit Google).
    await new Promise((r) => setTimeout(r, 500));
  }

  // ── Validação ──────────────────────────────────────────────────────────────
  const { count: filled } = await sb
    .from("giles_knowledge")
    .select("id", { count: "exact", head: true })
    .not("embedding_new", "is", null);
  const sample = await sb
    .from("giles_knowledge")
    .select("embedding_new")
    .not("embedding_new", "is", null)
    .limit(5);
  let normOk = true;
  let dimOk = true;
  for (const r of (sample.data ?? []) as Array<{ embedding_new: number[] | string }>) {
    const v = Array.isArray(r.embedding_new)
      ? r.embedding_new
      : (JSON.parse(r.embedding_new) as number[]);
    if (v.length !== 768) dimOk = false;
    const norm = Math.sqrt(v.reduce((a, x) => a + x * x, 0));
    if (Math.abs(norm - 1) > 1e-3) normOk = false;
  }

  console.log("─".repeat(60));
  console.log(`[reindex-giles] RESULTADO: ok=${done} falhos=${failed} preenchidos=${filled}/${total}`);
  console.log(`[reindex-giles] validação: dim768=${dimOk} norm≈1=${normOk}`);
  if (filled !== total || !dimOk || !normOk || failed > 0) {
    fail("validação NÃO passou — NÃO faça o swap. Investigar falhas acima.");
  }
  console.log("[reindex-giles] ✅ validação OK. SWAP atômico (rodar manual após smoke):");
  console.log(
    [
      "BEGIN;",
      "  ALTER TABLE public.giles_knowledge RENAME COLUMN embedding TO embedding_old;",
      "  ALTER TABLE public.giles_knowledge RENAME COLUMN embedding_new TO embedding;",
      "COMMIT;",
      "-- Recriar índice HNSW cosine:",
      "CREATE INDEX CONCURRENTLY giles_knowledge_embedding_idx",
      "  ON public.giles_knowledge USING hnsw (embedding vector_cosine_ops);",
      "-- Após smoke alexandria.search verde:",
      "ALTER TABLE public.giles_knowledge DROP COLUMN embedding_old;",
      "ALTER TABLE public.giles_knowledge ALTER COLUMN embedding_model SET DEFAULT 'gemini-embedding-001';",
    ].join("\n"),
  );
}

main().catch((err) => fail((err as Error).message));
