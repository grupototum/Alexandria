# API_ALEXANDRIA_CONTRACT.md

**Versão:** v3
**Atualizado:** 2026-06-09
**Substitui:** v2 (codificada erroneamente a partir do briefing do Arquiteto — naming `metadata` e escape hatch incorretos). Esta v3 está **ancorada no DB ao vivo**.
**Fonte de verdade:** schema ao vivo do project Supabase `cgpkfhrqprqptvehatad` ("Totum OS", us-east-2), capturado via `supabase gen types` + check constraints. Este documento **descreve o que existe no DB**, não um design aspiracional. Divergências históricas registradas em [ops/M54_errata_fase2_divergencias.md](ops/M54_errata_fase2_divergencias.md).

> Regra: quando este contract divergir de qualquer briefing, **o DB ao vivo vence**. Atualize este arquivo rodando `gen types` novamente, não de memória.

---

## 1. Execução de agentes — `public.agent_executions`

Tabela canônica consumida pelo Console (PR-3) e por qualquer cliente que leia/escreva execuções.

### Schema verificado (gen types, 2026-06-09)

| coluna | tipo SQL | TS (Row) | nullable | nota |
|---|---|---|---|---|
| `id` | uuid | string | não | PK |
| `execution_id` | text | string | não | id lógico da execução |
| `agent_id` | text | string | não | |
| `user_id` | uuid | string \| null | sim | |
| `input_data` | text | string \| null | sim | |
| `output_data` | jsonb | Json \| null | sim | |
| `skills_executed` | jsonb | Json \| null | sim | |
| `total_tokens` | integer | number \| null | sim | **coluna dedicada** |
| `total_cost` | numeric | number \| null | sim | **coluna dedicada** |
| `duration_ms` | integer | number \| null | sim | **coluna dedicada** |
| `status` | text | string \| null | sim | enum via CHECK — ver §1.1 |
| `error_message` | text | string \| null | sim | |
| `context` | jsonb | Json \| null | sim | **escape hatch — ver §1.2** |
| `created_at` | timestamptz | string \| null | sim | |

> ⚠️ O JSONB se chama **`context`**, **não** `metadata`. Não existe coluna `metadata` nesta tabela. Não renomear.

### 1.1 Status enum (CHECK constraint ao vivo)

```
agent_executions_status_check:
  CHECK (status = ANY (ARRAY['pending','running','success','error']))
```

| valor | significado | UI (Console) |
|---|---|---|
| `pending` | **estado inicial** — execução criada, ainda não iniciou | spinner/queued visual |
| `running` | em execução | progress ativo |
| `success` | concluída com sucesso | verde |
| `error` | falhou (ver `error_message`) | vermelho |

Tipo TS canônico já existe: [`src/types/status.ts`](../src/types/status.ts) → `ExecutionStatus = 'pending' | 'running' | 'success' | 'error'`.

❌ **Não usar** `queued` / `done` — nunca existiram neste schema.

### 1.2 Convenção do `context` jsonb (campos virtuais)

Campos que **não têm coluna dedicada** mas precisam ser persistidos vão em `context` jsonb. Hoje já têm coluna própria (logo **não** vão no jsonb): `duration_ms`, `total_tokens`, `total_cost`.

Campos virtuais atualmente aceitos em `context`:

```jsonc
context = {
  "model": "claude-opus-4-8",   // modelo usado na execução
  "retry_count": 0,             // nº de retentativas
  "context_tokens": 1856        // tokens de contexto (distinto de total_tokens)
}
```

Quando/se uma DDL futura promover algum desses a coluna dedicada, a migração é trivial (`UPDATE ... SET col = (context->>'campo')::tipo`). Documente no body do PR quais chaves virtuais foram introduzidas.

---

## 2. Tipos TypeScript

- Tipos do DB são **gerados**, não escritos à mão: `supabase gen types` no project `cgpkfhrqprqptvehatad`.
- Arquivo canônico no repo: [`src/integrations/supabase/types.ts`](../src/integrations/supabase/types.ts). Regenerar quando o schema mudar; não editar manualmente o bloco gerado.

---

## 3. Critérios de aceite herdados da Errata Fase 2

- [x] `gen types` rodado em cgpkf e divergências documentadas (§ ops/M54_errata_fase2_divergencias.md).
- [x] Status enum confirmado `pending|running|success|error`.
- [x] Naming `context` (não `metadata`) confirmado contra DB.
- [x] Decisão escape hatch: usar `context` jsonb **apenas** para campos sem coluna dedicada.

---

## 4. Escopo ainda não coberto por este contract

Este v2 cobre o contrato de **execução de agentes** (verificado). Outras superfícies (knowledge layer, RAG, channels) ainda não foram reconciliadas contra o DB neste documento — adicionar seções aqui **somente** após verificação via `gen types`/`list_tables`, nunca de memória.
