# M54 — POC Migração Alexandria → Self-Hosted (DESIGN)

**Data:** 2026-06-05
**Autor:** Alex (sessão Alexandria)
**Status:** 🟦 DESIGN ONLY — nada migrado. Para revisão do Arquiteto.
**Épico estimado:** 4 semanas focadas (implementação V1, pós-aprovação)

> Design baseado em **inventário real** do projeto Supabase `cgpkfhrqprqptvehatad`
> ("Totum OS", us-east-2), coletado via MCP em 2026-06-05.

---

## 0. Correções ao briefing (dados reais vs premissas)

| Premissa do briefing | Realidade medida | Impacto |
|---|---|---|
| "PostgreSQL 16 + pgvector" | DB é **PostgreSQL 17.6.1** | Target deve ser **PG17** — `pg_dump`/`restore` exige paridade de major. Migrar p/ 16 = downgrade inviável. |
| Risco: "pgvector ≥0.8 pra HNSW" | **pgvector 0.8.0 já instalado** | ✅ Risco **eliminado**. HNSW disponível hoje. |
| "RLS policies tradução Supabase ACL → PostgREST" | **209 policies** públicas, RLS nativo Postgres | PostgREST usa RLS **nativo** — policies migram via `pg_dump`. O trabalho real é resolver `auth.uid()`/`auth.jwt()` (ver §3.2). |
| "Edge Functions → script alternativo" | **3 Edge Functions** Deno (`alexandria-mcp`, `alexandria-proxy`, `send-invite`) | `alexandria-mcp` é **substituível pelo MCP Node v0.2 que acabamos de shippar** (M75). Ver §3.3. |

---

## 1. Inventário Supabase Cloud atual

**Projeto:** `cgpkfhrqprqptvehatad` · PG **17.6.1** · região us-east-2 · `ACTIVE_HEALTHY` · criado 2026-04-03.

### 1.1 Tabelas (74 no schema `public`, **RLS habilitado em 74/74**)
Volume total é **pequeno** (migração baixo-risco em tamanho). Maiores:

| Tabela | Rows | Papel |
|---|---|---|
| **giles_knowledge** | **657** | Base semântica canônica (embedding **768d**, 100% coberto) — consumida pelo MCP `knowledge/search` |
| notifications | 372 | App |
| hermione_artifact_sources | 276 | Hermione (consultivo) |
| hermione_sources | 216 | Hermione |
| hermione_artifacts | 157 | Hermione |
| client_profile_changes | 106 | Portal |
| transcription_analysis | 84 | Transcrições |
| agents | 72 | Dashboard mirror |
| hermione_artifact_versions / sources / consultations | 22 / 276 / 18 | Hermione |
| **rag_documents** | 20 | **Legado 1536d, 0 embeddings — drop em M78** (não migrar) |
| agents_config | 18 | elizaOS config |
| transcription_imports | 12 | |
| decisoes | 12 | Decisões D-xxx |
| skills | 13 | |
| **alexandria_documents** | **4** | Docs operacionais — consumido pelo MCP `operations/docs` |
| giles_dominios / giles_sinonimos | 6 / 5 | Tesauro de busca |
| pops / prompts | 5 / 8 | |

~50 tabelas estão com **0 rows** (estrutura pronta, sem dado) → migração trivial.

### 1.2 Extensões relevantes
- **`vector` 0.8.0** ✅ (HNSW-ready)
- **Ausentes** (não instaladas): `pg_cron`, `pg_net`, `pgjwt`, `pgsodium`, `http` → nenhuma dependência de cron/net no banco a replicar.

### 1.3 RPCs de busca (usadas pelo MCP)
`match_documents`, `search_docs`, `search_pops`, `search_skills` — funções SQL, migram via `pg_dump` (definição + corpo).

### 1.4 Índices `giles_knowledge`
`giles_knowledge_embedding_idx` (vetorial), `giles_knowledge_fts_idx` (full-text), + pkey/hash/doc. Recriar índice vetorial como **HNSW** no destino (cosine).

### 1.5 Edge Functions (3, Deno)
| Função | verify_jwt | Papel | Destino self-hosted |
|---|---|---|---|
| `alexandria-mcp` | false | MCP HTTP legado | **Substituir pelo MCP Node v0.2 (M75)** rodando como serviço (SSE :3789) |
| `alexandria-proxy` | false | Proxy | Reescrever como rota no `alexandria-api` (Node) ou Worker |
| `send-invite` | true | Convites portal (e-mail) | Reescrever como job Node + SMTP, ou manter Deno via `edge-runtime` self-hosted |

### 1.6 Storage buckets (4) → MinIO
| Bucket | Público | Conteúdo |
|---|---|---|
| `content-thumbnails` | sim | Thumbnails |
| `avatars` | sim | Avatares |
| `client_files` | não | Arquivos de cliente |
| `files` | não | Genérico |

### 1.7 Volume de queries/dia
Não instrumentado no banco (sem `pg_stat_statements` exposto via MCP). **Estimar via logs Supabase Dashboard** antes do cutover (Analytics → API requests). Dado o volume de rows e nº de usuários internos (~8 operadores + portal), estimativa grosseira: **baixo tráfego** (<10k req/dia), dominado por reads do dashboard + buscas semânticas MCP.

---

## 2. Stack self-hosted target

| Camada | Cloud (hoje) | Self-hosted (target) |
|---|---|---|
| DB | Supabase Postgres 17 | **PostgreSQL 17** + **pgvector 0.8** (paridade exata) |
| Backup | Supabase PITR | **pgBackRest** (compressão ~87% — meta do briefing) |
| REST/RPC | Supabase auto-API | **PostgREST** (consome RLS nativo) |
| Auth | Supabase Auth (GoTrue gerenciado) | **GoTrue self-hosted** OU **Keycloak realm `totum`** (M62) — ver §3.2 (decisão) |
| Storage | Supabase Storage | **MinIO** (S3-compat) |
| Edge Functions | Supabase Deno | Node (`alexandria-api`) + MCP v0.2; `edge-runtime` Deno opcional p/ `send-invite` |
| MCP | `alexandria-mcp` edge fn | **MCP Node v0.2 (M75)** — stdio (local/CI) + SSE :3789 (prod) |

---

## 3. Plano de migração de schema

### 3.1 Dump → restore staging
```
pg_dump --no-owner --no-privileges --schema=public \
  --exclude-table=rag_documents \      # legado, drop M78
  "postgresql://...supabase.co:5432/postgres" > alexandria_schema_data.sql
# restore em staging PG17 local
psql "postgresql://alexandria@127.0.0.1:5432/alexandria" < alexandria_schema_data.sql
```
- Migrar `auth`, `storage` schemas só se GoTrue/Storage self-hosted forem usados (GoTrue espera schema `auth` próprio).
- Recriar índice vetorial como HNSW pós-restore (mais rápido buildar depois do COPY).

### 3.2 RLS — o ponto sensível (209 policies)
RLS é **nativo Postgres** → as 209 policies vêm no `pg_dump`. O risco **não é a sintaxe**, é a
**fonte das claims**:
- As policies referenciam `auth.uid()` / `auth.jwt()` (helpers do schema `auth` do Supabase).
- **Opção GoTrue:** roda o schema `auth` + funções → `auth.uid()` funciona idêntico. **Menor atrito.** ✅ recomendado p/ V1.
- **Opção Keycloak (M62):** PostgREST injeta claims em `request.jwt.claims`; precisa de **shim** `auth.uid()` que lê `current_setting('request.jwt.claims')::json->>'sub'`. Mais trabalho, mas unifica SSO Totum.
- **Decisão pendente Arquiteto:** GoTrue (rápido, isola Alexandria) vs Keycloak (SSO unificado, alinhado M62). Recomendo **GoTrue no V1 + migração p/ Keycloak em fase 2** pra não acoplar 2 riscos.

### 3.3 Edge Functions
- `alexandria-mcp` → **aposenta**: o MCP Node v0.2 (M75) cobre os mesmos resources/tools com SSE.
- `alexandria-proxy` → porta p/ rota Node no `alexandria-api`.
- `send-invite` → **rewrite como API route no `alexandria-api`** (Node Express ou similar), email via
  **SMTP standard** (Mailgun/SendGrid free tier). Edge function some no self-hosted; lógica fica no app.

> **Redução de footprint Supabase (D-027 — "MCP antes da migração"):** aposentar `alexandria-mcp` é
> ganho imediato e independente do cutover — o MCP Node v0.2 já shippou (M75) e **supera** o edge
> function. Confirma D-027: cada edge fn removida (`alexandria-mcp`, depois `alexandria-proxy`,
> `send-invite`) reduz a superfície dependente do Supabase Cloud **antes** mesmo da migração de DB,
> diminuindo o risco do cutover.

---

## 4. Connection string change

| Onde | Antes | Depois |
|---|---|---|
| `alexandria-api/.env` | `postgresql://postgres:***@db.cgpkfhrqprqptvehatad.supabase.co:5432` | `postgresql://alexandria:***@127.0.0.1:5432/alexandria` |
| MCP server `.env` (`SUPABASE_URL`/`SERVICE_ROLE_KEY`) | endpoint Supabase | endpoint PostgREST self-hosted + service key local |
| Frontend Vercel (`VITE_SUPABASE_URL`/`*_ANON_KEY`) | Supabase | PostgREST/GoTrue self-hosted (via CF Tunnel + TLS) |

**Coordenar com M27** (rotação `GOOGLE_API_KEY` + chaves Supabase): trocar credenciais **uma vez só**,
não 2x. Janela única de rotação+cutover.

> ⚠️ **Nunca IP direto** (lição do item-5 do PR #2: rewrite p/ `187.127.4.140:3002` foi descartado).
> Usar `https://<host>.grupototum.com` via CF Tunnel + TLS.

---

## 5. Cutover plan (zero-downtime ideal)
1. **Read-replica/sync inicial:** logical replication ou dump+delta-sync, rodando 24h em paralelo.
2. **Validação staging:** smoke stdio + SSE + p95 embed < 200ms (ver §7) contra o destino.
3. **Switch DNS** (CF Tunnel) → self-hosted, Supabase Cloud vira **read-only 1 semana** (rollback quente).
4. **Observabilidade** 7 dias: erros, latência, RLS denials.
5. **Cancelar subscription** Supabase Cloud só após semana verde.

## 6. Rollback plan
- **Switch DNS de volta** p/ Supabase Cloud (mantido read-only → reabrir write).
- **Rollback `.env`** (alexandria-api + MCP + Vercel) — versionar os `.env` de cutover.
- **Re-sync delta** (writes ocorridos no self-hosted durante a janela) de volta p/ Cloud, se houver.
- RTO alvo: < 15min (troca DNS + redeploy Vercel).

## 7. Critério de aceite GREEN
- [ ] Smoke stdio **e** SSE passando ambos (inclui `metadata/workflows` corrigido — ver M118).
- [ ] Latência embed query **< 200ms p95** (medida real, não a medição ruidosa do M118).
- [ ] Backup pgBackRest com **~87% compressão** mantido + restore testado.
- [ ] **0 downtime** medido durante cutover (synthetic check contínuo).
- [ ] 209 RLS policies validadas (suite de testes de autorização por role).

## 8. Riscos identificados (atualizados c/ dados reais)
| # | Risco | Status / mitigação |
|---|---|---|
| R1 | `text-embedding-004` sai do free-tier Google se volume sobe | **Coordenar M27** (mesma key). Cache de embeddings + rate-limit. |
| R2 | ~~pgvector < 0.8 sem HNSW~~ | ✅ **RESOLVIDO** — já é 0.8.0. |
| R3 | Cold start sem CDN das Edge Functions | MCP vira serviço **long-running** (pm2) → sem cold start. |
| R4 | Migração RLS quebra app sem coverage | **209 policies** → maior risco. Exige suite de testes de autorização **antes** do cutover. |
| R5 | `auth.uid()` source (GoTrue vs Keycloak) | §3.2 — recomendado GoTrue no V1. |
| R6 | Storage: 4 buckets + ACL público/privado | Mapear ACL Supabase → policy MinIO; testar URLs públicas (avatars/thumbnails). |

## 9. Pré-requisitos antes do V1
- [ ] **M27** fechado (Key A rotacionada) — **bloqueador de cutover** (coord. de credenciais).
- [ ] **M86** hardening Sentinela rodada.
- [ ] Backup off-site (Google Drive) cobrindo o staging.
- [ ] **Correção M118** do `metadata/workflows` (resource quebrado não pode ir pro critério GREEN).
- [ ] Janela de manutenção combinada (24–48h de preparação).

## 10. Cronograma (4 semanas focadas, sem sprints sobrepostos)
| Semana | Entrega |
|---|---|
| 1 | Schema + connection + smoke staging (PG17 + pgvector 0.8 + PostgREST + GoTrue) |
| 2 | Data migration (dump+delta) + RLS translation + suite de testes de autorização (209 policies) |
| 3 | App integration (frontend/MCP/api apontando staging) + cutover plan ensaiado + MinIO buckets |
| 4 | Cutover + observabilidade 7d + validação de rollback |

---

### Decisões pendentes do Arquiteto
1. **Auth no V1:** GoTrue (recomendo) vs Keycloak direto (§3.2).
2. **Target PG:** confirmar **PG17** (não 16 do briefing) — obrigatório por paridade de dump.
3. **`send-invite`:** rewrite Node vs `edge-runtime` Deno self-hosted.
4. Ordenar **M118-fix** antes do M54-V1 (resource quebrado no critério GREEN).
