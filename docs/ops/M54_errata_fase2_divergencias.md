# ERRATA FASE 2 — verificação contra schema real (cgpkf)

**Data:** 2026-06-09 · **Fonte de verdade:** `supabase gen types` no project `cgpkfhrqprqptvehatad` ("Totum OS", us-east-2) + check constraints ao vivo.

> Conclusão curta: dos 4 ajustes da errata, **1 já estava satisfeito**, **2 estão factualmente incorretos** contra o schema ao vivo, e **1 (gen types) foi executado** — com divergências adicionais encontradas.

## Tabela canônica: `public.agent_executions`

Colunas reais (gen types):

| coluna | tipo | observação |
|---|---|---|
| id | uuid | |
| execution_id | text | |
| agent_id | text | |
| user_id | uuid | |
| input_data | text | |
| output_data | jsonb | |
| skills_executed | jsonb | |
| total_tokens | integer | **coluna dedicada (não virtual)** |
| total_cost | numeric | **coluna dedicada** |
| duration_ms | integer | **coluna dedicada** |
| status | text | check `pending\|running\|success\|error` |
| error_message | text | |
| **context** | **jsonb** | **o JSONB se chama `context`, NÃO `metadata`** |
| created_at | timestamptz | |

## Ponto a ponto da errata

### 1. STATUS ENUM — ✅ JÁ CORRETO (nada a refazer)
- DB check constraint ao vivo: `CHECK (status = ANY ('pending','running','success','error'))`.
- `src/types/status.ts` → `ExecutionStatus = 'pending' | 'running' | 'success' | 'error'` — já idêntico.
- **Nunca existiu `queued`/`done` neste repo.** Não há tipos a refazer. PR-3 Console: estado inicial = `pending` já é o correto.

### 2. NAMING metadata vs context — ❌ ERRATA INVERTIDA
- A errata pede renomear `context` → `metadata`. **O schema ao vivo usa `context` (jsonb).** Não existe coluna `metadata` em `agent_executions`.
- `src/types/alexandria.ts` também usa `context`. Renomear para `metadata` **quebraria** o alinhamento com o DB.
- **Ação:** manter `context`. Não aplicar o rename.

### 3. GEN TYPES — ✅ EXECUTADO
- Rodado em cgpkf. Output completo: tool-result salvo na sessão (109KB). Slice de `agent_executions` acima.
- `API_REFERENCE.md` do repo descreve a API REST elizaOS (`:3000/api`), não o schema Supabase — não é a fonte de verdade do schema.

### 4. ESCAPE HATCH metadata JSONB — ❌ DESNECESSÁRIO (premissa falsa)
- A errata afirma "schema NÃO tem duration_ms, model_used, retry_count como colunas". **Falso para duration_ms/total_tokens/total_cost — já são colunas dedicadas.**
- Campos genuinamente sem coluna (`model`/`model_used`, `retry_count`, `context_tokens`) → usar o jsonb **`context`** existente (não `metadata`). Sem necessidade de DDL nem de aguardar M54-3.

## Divergências adicionais (vs briefing original)
1. JSONB chama-se `context`, não `metadata`. (errata #2 invertida)
2. `duration_ms`, `total_tokens`, `total_cost` já são colunas dedicadas — escape hatch não bloqueia nada. (errata #4 com premissa falsa)
3. `docs/API_ALEXANDRIA_CONTRACT.md` **não existe** no repo (grupototum/Alexandria). Não há contract v1 nem v2 versionado para reler.
4. **Não existe PR-1 nem PR-3** abertos/merged. PRs do repo: MCP-hub (M75), embeddings (M134), docs M54/M133. "Status PR-1" = inexistente.
