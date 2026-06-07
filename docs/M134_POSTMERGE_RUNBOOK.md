# M134 — Runbook pós-merge (Rael + Sentinela)

**Objetivo:** restaurar a busca semântica do Alexandria após a morte do
`text-embedding-004`, migrando para `gemini-embedding-001 @ 768d`.
**Pré-condição:** PR #6 (`fix/embedding-model-migration-m134`) **mergeado** em `main`.
**Executores:** Rael (apply migration + key) · Sentinela (re-index na VPS).
**Tempo total estimado:** ~25–40 min (dominado pelo re-index dos 657 docs).

> ⚠️ **Por que existe este runbook:** a sessão Alexandria (Alex) **não pôde**
> executar nada disto — sem `.env`/key local, e schema/produção é No-Fly (D-042).
> Tudo aqui roda com Rael presente, na ordem exata abaixo.

---

## Visão geral da cascata

```
[1] apply migration (colunas metadata)   ── Supabase, additive, reversível
[2] add coluna temp embedding_new        ── Supabase, additive
[3] atualizar GOOGLE_API_KEY no VPS       ── Sentinela, .env alex-api
[4] rodar reindex-giles.ts (657 docs)     ── Sentinela, ~5–10 min
[5] verify (count/dim/norm)               ── SQL read-only
[6] SWAP atômico embedding_new→embedding  ── Supabase, transação
[7] recriar índice HNSW + smoke           ── Supabase + curl
[8] cleanup (drop embedding_old, default) ── Supabase
```

A busca **continua funcionando na coluna antiga** até o passo [6]. Zero downtime.

---

## Passo 1 — Apply migration (colunas de metadata)

**Quem:** Rael (Supabase MCP `apply_migration` ou SQL editor).
**Arquivo:** `supabase/migrations/20260607120000_m134_giles_knowledge_embedding_metadata.sql`

```sql
ALTER TABLE public.giles_knowledge
  ADD COLUMN IF NOT EXISTS embedding_model text        NOT NULL DEFAULT 'text-embedding-004',
  ADD COLUMN IF NOT EXISTS embedding_dim   integer     NOT NULL DEFAULT 768,
  ADD COLUMN IF NOT EXISTS embedded_at     timestamptz NOT NULL DEFAULT now();
```

**Output esperado:** `ALTER TABLE`. Os 657 rows ganham `embedding_model='text-embedding-004'`
(reality — ainda não re-indexados).

**Rollback:**
```sql
ALTER TABLE public.giles_knowledge
  DROP COLUMN IF EXISTS embedding_model,
  DROP COLUMN IF EXISTS embedding_dim,
  DROP COLUMN IF EXISTS embedded_at;
```
**Tempo:** <5s.

---

## Passo 2 — Coluna temporária `embedding_new`

**Quem:** Rael (Supabase).
```sql
ALTER TABLE public.giles_knowledge ADD COLUMN IF NOT EXISTS embedding_new vector(768);
```
**Output esperado:** `ALTER TABLE`. (O script `reindex-giles.ts` aborta com instrução se esta coluna faltar.)
**Rollback:** `ALTER TABLE public.giles_knowledge DROP COLUMN IF EXISTS embedding_new;`
**Tempo:** <5s.

---

## Passo 3 — Atualizar GOOGLE_API_KEY na VPS

**Quem:** Sentinela (host VPS `alexandria-api`).
1. Editar o `.env` do serviço:
   ```
   EMBEDDING_PROVIDER=google
   EMBEDDING_MODEL=gemini-embedding-001
   EMBEDDING_DIMENSIONS=768
   EMBEDDING_API_KEY=<NOVA_KEY_A_ROTACIONADA_M27>
   SUPABASE_URL=https://cgpkfhrqprqptvehatad.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service_role>
   ```
2. **Não** commitar `.env` (D-021).
**Verificação:** `grep EMBEDDING_MODEL .env` → `gemini-embedding-001`.
**Rollback:** restaurar `.env` anterior (Sentinela mantém backup).
**Tempo:** ~2 min.

---

## Passo 4 — Rodar o re-index (657 docs)

**Quem:** Sentinela (VPS, dir `tools/alexandria-claude-mcp`).
```bash
cd tools/alexandria-claude-mcp
npm ci
# dry-run primeiro (não grava — só conta pendentes):
npx tsx scripts/reindex-giles.ts --dry-run
# re-index real:
EMBEDDING_API_KEY=$EMBEDDING_API_KEY \
SUPABASE_URL=$SUPABASE_URL \
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY \
EMBEDDING_PROVIDER=google EMBEDDING_MODEL=gemini-embedding-001 \
  npx tsx scripts/reindex-giles.ts --batch=25
```
**Output esperado (counts, sem secrets):**
```
[reindex-giles] total=657 pendentes=657 batch=25 dry-run=false
[reindex-giles] progresso: 25 ok / 0 falhos / 657 alvo
... (continua até ~657)
[reindex-giles] RESULTADO: ok=657 falhos=0 preenchidos=657/657
[reindex-giles] validação: dim768=true norm≈1=true
[reindex-giles] ✅ validação OK. SWAP atômico (rodar manual após smoke):
<SQL impresso>
```
**Idempotência:** se interromper, re-rodar — só processa `embedding_new IS NULL`.
**Se `falhos>0` ou validação `false`:** **NÃO** prosseguir pro swap. Investigar (rate-limit Google? texto vazio?). Re-rodar cobre falhas transitórias.
**Tempo:** ~5–10 min (657 calls + sleep 500ms/lote; free-tier ~330K tokens OK).

---

## Passo 5 — Verify (read-only)

**Quem:** Rael/Sentinela (Supabase SQL).
```sql
SELECT
  count(*)                                            AS total,
  count(embedding_new)                                AS preenchidos,
  vector_dims((SELECT embedding_new FROM giles_knowledge
               WHERE embedding_new IS NOT NULL LIMIT 1)) AS dim_new
FROM public.giles_knowledge;
```
**Esperado:** `total=657 · preenchidos=657 · dim_new=768`.
Sanity de norma (amostra):
```sql
SELECT round((SELECT sqrt(sum(x*x)) FROM unnest(embedding_new::real[]) AS x)::numeric, 4) AS norma
FROM public.giles_knowledge WHERE embedding_new IS NOT NULL LIMIT 3;
```
**Esperado:** `~1.0000` em todas.
**Se `preenchidos < 657`:** voltar ao passo 4 (re-rodar, é idempotente).

---

## Passo 6 — SWAP atômico

**Quem:** Rael (Supabase, transação). **Só após passo 5 verde.**
```sql
BEGIN;
  ALTER TABLE public.giles_knowledge RENAME COLUMN embedding TO embedding_old;
  ALTER TABLE public.giles_knowledge RENAME COLUMN embedding_new TO embedding;
COMMIT;
```
**Output esperado:** `COMMIT`. A busca passa a usar os embeddings novos.
**Rollback (se smoke do passo 7 falhar):**
```sql
BEGIN;
  ALTER TABLE public.giles_knowledge RENAME COLUMN embedding TO embedding_new;
  ALTER TABLE public.giles_knowledge RENAME COLUMN embedding_old TO embedding;
COMMIT;
```
**Tempo:** <5s (rename é metadata-only, instantâneo).

---

## Passo 7 — Recriar índice HNSW + smoke E2E

**Quem:** Rael (Supabase) + smoke.
```sql
-- O índice antigo aponta p/ embedding_old; recriar no novo embedding:
DROP INDEX IF EXISTS giles_knowledge_embedding_idx;
CREATE INDEX giles_knowledge_embedding_idx
  ON public.giles_knowledge USING hnsw (embedding vector_cosine_ops);
```
**Smoke E2E** (com a key viva, na VPS ou via MCP stdio):
```bash
# Via MCP stdio (driver JSON-RPC) ou via app:
#   resources/read alexandria://knowledge/search?q=D-001%20Supabase&limit=3
# Esperado: array NÃO-vazio, ≥3 docs, similaridade > threshold (0.7).
```
**Critério GREEN:** `alexandria.search("D-001 Supabase migração")` retorna **≥3 docs relevantes**.
Repetir p/ Hermione (`match_knowledge`) — também volta a funcionar.
**Se vazio:** verificar (a) índice criado, (b) embeddings normalizados (passo 5), (c) threshold. Se persistir → rollback passo 6.
**Tempo:** ~30s (build do índice em 657 rows é rápido) + smoke.

---

## Passo 8 — Cleanup (após smoke verde)

**Quem:** Rael (Supabase).
```sql
ALTER TABLE public.giles_knowledge DROP COLUMN IF EXISTS embedding_old;
ALTER TABLE public.giles_knowledge ALTER COLUMN embedding_model SET DEFAULT 'gemini-embedding-001';
```
**Output esperado:** `ALTER TABLE` ×2. Default agora reflete o estado pós-migração.
**Tempo:** <5s.

---

## Resultado final

- 657 docs re-embedados com `gemini-embedding-001 @ 768d`, normalizados, `embedding_model` correto.
- Busca semântica restaurada (Alexandria + Hermione) — sem cair no fallback textual de `rag_documents`.
- **M134.1** (watcher Sentinela) vira verde automático ao detectar `embedding_model='gemini-embedding-001'` nos 657.

## Checklist rápido (copiar/colar)

- [ ] 1. apply migration colunas metadata
- [ ] 2. add coluna `embedding_new vector(768)`
- [ ] 3. `.env` VPS: key nova + `EMBEDDING_MODEL=gemini-embedding-001`
- [ ] 4. `reindex-giles.ts --dry-run` → real; ok=657 falhos=0
- [ ] 5. verify SQL: preenchidos=657, dim=768, norma≈1
- [ ] 6. SWAP atômico (transação)
- [ ] 7. recriar HNSW + smoke `alexandria.search` ≥3 results
- [ ] 8. drop `embedding_old` + flip default

> Qualquer passo que falhe tem rollback acima. Em dúvida no 4–6, **pare antes do swap** — a coluna antiga ainda serve a busca.
