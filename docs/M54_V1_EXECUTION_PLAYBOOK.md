# M54 V1 — Playbook de Execução (Alexandria → self-hosted)

**Status:** 🟦 PLAYBOOK — nada aplicado. Para review do Arquiteto/Rael.
**Base:** [docs/M54_alexandria_self_hosted_POC_design.md](M54_alexandria_self_hosted_POC_design.md) (design aprovado).
**Formato:** ~4 semanas quebradas em **15 PRs numerados**, executáveis em ordem.
**Princípio:** cada PR é **idempotente, com dry-run default, rollback explícito e smoke**.

> ⚠️ **D-042:** nenhum SQL/migration deste playbook foi aplicado em produção. Todos os
> scripts default **`--dry-run`**; o apply real exige Rael presente + janela combinada.

---

## Dependências globais (gate ANTES do PR M54-1)

- [x] **M27** — Key A rotacionada (Vercel) ✅
- [ ] **M134** mergeado + re-index 657 OK (embed funcionando — base limpa pré-migração)
- [ ] **M86** hardening Sentinela rodada (semana 0)
- [ ] Backup off-site (Google Drive) cobrindo o staging self-hosted
- [ ] Janela de manutenção **24–48h** combinada com Rael
- [ ] Host self-hosted provisionado (PostgreSQL 17 + pgvector 0.8 + MinIO + Keycloak realm `totum` M62)

**Decisões fixas (do design):** Auth=**GoTrue** no V1 · Target=**PG17** (paridade dump) · `send-invite`→API route · `alexandria-mcp` edge fn aposentável (M133).

---

## Mapa de PRs e dependências

```
Fase 1 (Semana 1)  M54-1 ─ M54-2 ─ M54-3        (schema + backup + conn)
Fase 2 (Semana 2)  M54-4 ─ M54-5 ─ M54-6 ─ M54-7 (dump/restore + RLS + storage + verify)
Fase 3 (Semana 3)  M54-8 ─ M54-9 ─ M54-10 ─ M54-11 (app integ + auth + invite + smoke)
Fase 4 (Semana 4)  M54-12 ─ M54-13 ─ M54-14 ─ M54-15 (cutover + obs + rollback + decom)

Dep crítica: M54-4 (restore) bloqueia toda a Fase 2+.  M54-11 (smoke staging verde)
é o GATE para iniciar a Fase 4.  M54-15 (decom) só após 7 dias verdes pós-cutover.
```

═══════════════════════════════════════════════════════════════════
## FASE 1 — Schema + connection (Semana 1)
═══════════════════════════════════════════════════════════════════

### PR M54-1 — Schema PostgreSQL 17 self-hosted + pgvector
**Deps:** host provisionado. **Bloqueia:** M54-4.
**SQL (NÃO aplicar — vai pro restore via dump):**
```sql
CREATE EXTENSION IF NOT EXISTS vector;        -- pgvector 0.8 (HNSW <2000 dims)
-- Schema vem do pg_dump da Cloud (M54-4); este PR só prepara DB + extensões + roles.
CREATE ROLE alexandria LOGIN PASSWORD :'pw';
CREATE DATABASE alexandria OWNER alexandria;
```
**Script:** `scripts/m54/01-init-db.sh --dry-run` (cria DB/role/ext; idempotente via IF NOT EXISTS).
**Aceite:** `SELECT extversion FROM pg_extension WHERE extname='vector'` → `0.8.x`.
**Rollback:** `DROP DATABASE alexandria; DROP ROLE alexandria;`
**Tempo:** 1–2h. **Riscos:** versão pgvector <0.8 no host → sem HNSW.

### PR M54-2 — pgBackRest sidecar (staging)
**Deps:** M54-1. **Bloqueia:** cutover (precisa backup antes).
**Config:** `pgbackrest.conf` (repo1, compress-type=zst, compress-level p/ ~87%).
**Script:** `scripts/m54/02-backup-init.sh --dry-run` (stanza-create + check).
**Aceite:** `pgbackrest --stanza=alexandria check` OK; backup full + restore teste em DB descartável.
**Rollback:** remover stanza; sem efeito em dados.
**Tempo:** 2–3h. **Riscos:** compressão <87% (ajustar level); espaço em disco repo.

### PR M54-3 — Connection pooling + env vars
**Deps:** M54-1. **Bloqueia:** M54-8.
**Config:** PgBouncer (transaction pooling) + `.env.example` self-hosted (sem segredos).
**Script:** `scripts/m54/03-pooler.sh --dry-run`.
**Aceite:** `psql` via pooler conecta; pool_size adequado p/ tráfego (<10k req/dia estimado).
**Rollback:** apontar conn direto ao Postgres (bypass pooler).
**Tempo:** 1–2h. **Riscos:** prepared statements + transaction pooling (PostgREST OK; checar app).

═══════════════════════════════════════════════════════════════════
## FASE 2 — Data migration (Semana 2)
═══════════════════════════════════════════════════════════════════

### PR M54-4 — pg_dump → restore idempotente
**Deps:** M54-1,3. **Bloqueia:** M54-5,6,7 (toda Fase 2+).
**Script:** `scripts/m54/04-dump-restore.sh --dry-run` (default só imprime comandos):
```bash
pg_dump --no-owner --no-privileges --schema=public \
  --exclude-table=rag_documents \   # legado morto (drop M78)
  "$SUPABASE_DB_URL" > alexandria.sql
psql "$SELFHOSTED_DB_URL" < alexandria.sql
# Recriar índice vetorial como HNSW pós-COPY (mais rápido).
```
**Aceite:** contagem de tabelas e rows bate com inventário (74 tabelas; giles_knowledge 657).
**Rollback:** `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` no self-hosted (staging).
**Tempo:** 2–4h (dump+restore; volume pequeno). **Riscos:** skew de versão (mitigado: PG17=PG17); extensões ausentes.

### PR M54-5 — RLS policies (auth.uid via GoTrue)
**Deps:** M54-4, GoTrue rodando. **Bloqueia:** M54-11.
**Contexto:** 209 policies vêm no dump (RLS nativo). O risco é `auth.uid()`/`auth.jwt()` → GoTrue provê o schema `auth` idêntico ao Supabase.
**Script:** `scripts/m54/05-rls-verify.sh --dry-run` (lista policies + roda suite de autorização por role).
**Aceite:** **suite de testes de autorização** (por role: anon/authenticated/service_role) — N asserts passam; nenhuma policy órfã referenciando função ausente.
**Rollback:** RLS já no dump; sem mudança destrutiva. Se falhar, corrigir GoTrue schema `auth`.
**Tempo:** 1 semana de esforço (testes). **Riscos:** ⚠️ **maior risco do projeto** — 209 policies sem coverage prévio. Construir a suite ANTES do cutover.

### PR M54-6 — Storage migration (MinIO)
**Deps:** M54-1. **Bloqueia:** M54-11 (se app usa storage).
**Buckets (do inventário):** `content-thumbnails`(pub), `avatars`(pub), `client_files`(priv), `files`(priv).
**Script:** `scripts/m54/06-storage-sync.sh --dry-run` (rclone Supabase Storage → MinIO + map ACL).
**Aceite:** counts de objetos batem; URL pública de `avatars`/`thumbnails` resolve; `client_files` nega anon.
**Rollback:** manter Supabase Storage como fonte; reverter URLs.
**Tempo:** 2–3h. **Riscos:** mapping ACL público/privado Supabase→policy MinIO; URLs assinadas.

### PR M54-7 — Backfill verify (counts + RLS test)
**Deps:** M54-4,5,6. **Bloqueia:** M54-11.
**Script:** `scripts/m54/07-verify.sh` (read-only):
```sql
SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY 1;  -- vs inventário
SELECT count(*), count(embedding) FROM giles_knowledge;          -- 657/657
```
**Aceite:** todas as 74 tabelas com counts esperados; giles_knowledge 657 emb 768d; suite RLS verde.
**Rollback:** N/A (read-only).
**Tempo:** 1–2h. **Riscos:** drift entre dump e prod se houve writes na janela (re-sync delta).

═══════════════════════════════════════════════════════════════════
## FASE 3 — App integration (Semana 3)
═══════════════════════════════════════════════════════════════════

### PR M54-8 — alexandria-api connection string
**Deps:** M54-3,4. **Bloqueia:** M54-11.
**Mudança:** `.env` (alexandria-api + MCP server) → endpoint PostgREST/pooler self-hosted. **Coordenar com M27** (trocar credenciais 1× só).
**Aceite:** API conecta ao self-hosted (staging); health endpoints OK.
**Rollback:** reverter `.env` p/ Supabase (versionar `.env` de cutover).
**Tempo:** 1–2h. **Riscos:** nunca IP direto — `https://<host>.grupototum.com` via CF Tunnel + TLS (lição PR #6 item-5).

### PR M54-9 — GoTrue auth substitution
**Deps:** M54-5. **Bloqueia:** M54-11.
**Mudança:** frontend `VITE_SUPABASE_URL`/`ANON_KEY` → GoTrue self-hosted endpoints; manter contrato Supabase Auth.
**Aceite:** login/signup/refresh funcionam contra GoTrue; `auth.uid()` resolve nas RLS.
**Rollback:** reverter envs p/ Supabase Auth.
**Tempo:** 2–3h. **Riscos:** templates de email/OAuth providers; refresh token rotation.

### PR M54-10 — send-invite rewrite (API route)
**Deps:** M54-8. **Bloqueia:** M54-11.
**Mudança:** Edge Function `send-invite` (Deno) → rota Node no alexandria-api + SMTP (Mailgun/SendGrid free tier).
**Aceite:** convite end-to-end (cria token + envia email + link válido).
**Rollback:** manter edge fn `send-invite` ativa até a rota validar.
**Tempo:** 3–4h. **Riscos:** deliverability SMTP; rate limit; template parity.

### PR M54-11 — Smoke E2E staging (GATE Fase 4)
**Deps:** M54-7,8,9,10. **Bloqueia:** TODA a Fase 4.
**Aceite (critério GREEN do design):**
- [ ] Smoke stdio **e** SSE do MCP verdes (incl. metadata/workflows pós-M118)
- [ ] `alexandria.search` ≥3 results (embed via gemini-embedding-001 pós-M134)
- [ ] Latência embed query **<200ms p95** (medição real)
- [ ] Login GoTrue + RLS por role OK · send-invite OK · storage URLs OK
- [ ] Backup pgBackRest ~87% compress + restore testado
**Rollback:** N/A (gate read/smoke). Se falhar → **não inicia Fase 4**.
**Tempo:** 1 semana (estabilização). **Riscos:** qualquer falha aqui adia o cutover.

═══════════════════════════════════════════════════════════════════
## FASE 4 — Cutover + observability (Semana 4)
═══════════════════════════════════════════════════════════════════

### PR M54-12 — DNS read-replica → switch
**Deps:** M54-11 verde. **Bloqueia:** M54-15.
**Plano (zero-downtime):** logical replication/sync 24h → validar → **switch DNS** (CF Tunnel) → Supabase Cloud vira **read-only 1 semana**.
**Aceite:** synthetic check contínuo durante cutover = **0 downtime**; writes chegam no self-hosted.
**Rollback:** **switch DNS de volta** + reabrir write na Cloud + re-sync delta (RTO <15min).
**Tempo:** janela 24–48h. **Riscos:** delta de writes na janela; propagação DNS/TTL.

### PR M54-13 — Monitoring + drift detection
**Deps:** M54-12. **Bloqueia:** M54-15.
**Entrega:** dashboards (latência, erros, RLS denials), alertas, watcher de drift de embedding model (reusa colunas M134 `embedding_model`).
**Aceite:** alertas disparam em teste sintético; métricas fluindo 7 dias.
**Rollback:** N/A (observability aditiva).
**Tempo:** 2–3h. **Riscos:** cobertura de alertas insuficiente.

### PR M54-14 — Rollback playbook validation
**Deps:** M54-12. **Bloqueia:** M54-15.
**Entrega:** **ensaiar** o rollback completo num ambiente espelho (switch DNS volta + `.env` rollback + re-sync delta) e cronometrar RTO.
**Aceite:** rollback ensaiado < 15min RTO, sem perda de dados.
**Rollback:** N/A (é a validação do rollback).
**Tempo:** 2–3h. **Riscos:** rollback não testado = rollback que não funciona na hora H.

### PR M54-15 — Decommission Supabase Cloud (ÚLTIMO)
**Deps:** M54-12,13,14 + **7 dias verdes** pós-cutover. **Bloqueia:** nada.
**Ação:** após semana verde → cancelar subscription Supabase Cloud (Rael).
**Aceite:** 7 dias sem incidente; backups self-hosted validados; export final da Cloud arquivado.
**Rollback:** ⚠️ **ponto sem retorno** — só executar com 100% de confiança. Manter export final.
**Tempo:** 30min (+ 7 dias de espera). **Riscos:** cancelar cedo demais sem rollback possível.

---

## Estimativa de tempo total

| Fase | Esforço focado | Calendário |
|---|---|---|
| 1 · Schema/conn | ~1–2 dias | Semana 1 |
| 2 · Data/RLS/storage | ~5 dias (RLS suite domina) | Semana 2 |
| 3 · App/auth/invite | ~3–4 dias | Semana 3 |
| 4 · Cutover/obs | ~2–3 dias + janela 24–48h + 7d observação | Semana 4 |
| **Total** | **~4 semanas focadas** (sem sprints sobrepostos) | + 7 dias decom |

## Top 5 riscos
1. **RLS (209 policies) sem coverage** — construir suite de autorização ANTES do cutover (PR M54-5). Maior risco.
2. **Cutover com delta de writes** na janela — logical replication + re-sync (PR M54-12/14).
3. **Rollback não-ensaiado** — PR M54-14 obrigatório antes do decom.
4. **Decommission prematuro** (M54-15) — gate de 7 dias verdes + export final.
5. **GoTrue `auth.uid()` parity** — validar schema `auth` idêntico (PR M54-9); fallback Keycloak fica p/ fase 2.

## Schedule sugerido com Rael
- **Semana 0:** M86 hardening + provisionar host + M134 merge/reindex (pré-reqs).
- **Semanas 1–3:** Fases 1–3 hands-on dev (Alex + Sentinela), PRs revisados por Rael.
- **Semana 4:** combinar **janela 24–48h** p/ cutover (M54-12) — Rael presente obrigatório.
- **Semana 5:** observação 7 dias → M54-15 decom com Rael.

> Todos os scripts `scripts/m54/*` são **dry-run default**; o apply real é sempre Rael-presente (D-042).
