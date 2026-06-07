# M133 — Design: aposentar a Edge Function `alexandria-mcp`

**Status:** 🟦 DESIGN ONLY — nada deletado. Para review do Arquiteto/Rael.
**Decisão-base:** D-027 ("MCP antes da migração") — o MCP Node v0.2 (M75) **supera** a
Edge Function. Aposentá-la **reduz footprint Supabase** antes mesmo do M54.
**Pré-condição de execução:** M134 fechado + M75 estável **7 dias em produção**.

> Escopo: **somente** a Edge Function `alexandria-mcp`. As outras duas
> (`alexandria-proxy`, `send-invite`) são tratadas no M54 §3.3 — **fora deste design**.

---

## 1. Inventário — o que `alexandria-mcp` fazia (v0.1)

A Edge Function era o **MCP v0.1** (`server.mjs`): um endpoint HTTP Deno que expunha
3 ferramentas via proxy, todas batendo em Supabase/RPCs:

| Feature (v0.1 edge fn) | Backend | Equivalente v0.2 (MCP Node) |
|---|---|---|
| `alexandria_search` | `match_documents` / busca semântica | **Resource** `alexandria://knowledge/search{?q,limit}` (nativo) |
| `alexandria_get_artifact` | leitura de artefato | **Tool** nativa / resource `operations/docs` |
| `alexandria_context_pack` | pacote de contexto | composição nativa no v0.2 |
| (implícito) metadata | JSONs de agentes | **Resources** `metadata/agents·workflows·health` |

Características da edge fn: `verify_jwt=false` (sem auth real — risco), Deno runtime,
cold start, sem observabilidade estruturada.

---

## 2. Mapping edge fn → MCP Node v0.2

O v0.2 **já reimplementa nativamente** tudo que a edge fn fazia, com vantagens:
- Auth real (Keycloak introspection / scopes) vs `verify_jwt=false`.
- Long-running (pm2/SSE) → **sem cold start**.
- Tipagem estrita + testes (42 testes pós-M140·D).
- 5 resources + 5 tools nativos (vs 3 tools proxy).

**Único acoplamento remanescente:** as 3 tools **legacy** do v0.2
(`alexandria_search/_get_artifact/_context_pack`, ver `src/tools/legacy.ts`) ainda
fazem **proxy HTTP** para a edge fn via `ALEXANDRIA_MCP_URL` + `ALEXANDRIA_MCP_TOKEN`
— mantidas só por compat com clientes do v0.1.

```
cliente v0.1 ─→ [legacy tool] ─proxy→ ALEXANDRIA_MCP_URL ─→ edge fn alexandria-mcp ─→ Supabase
cliente v0.2 ─→ [resource/tool nativo] ──────────────────────────────────────────→ Supabase
```

Retirar a edge fn = **eliminar o ramo de cima**.

---

## 3. Plano de migração de consumers

| Consumer | Hoje | Ação |
|---|---|---|
| MCP legacy tools (`legacy.ts`) | proxy p/ edge fn | **Remover** as 3 tools OU re-apontar internamente p/ os resources nativos |
| Frontend / outros clientes v0.1 | (verificar) chamam edge fn direto? | Auditar `functions/v1/alexandria-mcp` no front; migrar p/ MCP SSE/stdio |
| `.env` (`ALEXANDRIA_MCP_URL/TOKEN`) | aponta p/ edge fn | Remover após corte |

**Passo a passo:**
1. **Auditoria de tráfego:** Supabase Edge Function logs de `alexandria-mcp` por 7 dias — confirmar **zero** (ou só o proxy do MCP) chamadas externas.
2. **Cortar o proxy:** remover as 3 legacy tools do v0.2 (ou marká-las deprecated e devolver erro orientando o resource nativo). PR próprio.
3. **Remover env:** tirar `ALEXANDRIA_MCP_URL`/`ALEXANDRIA_MCP_TOKEN` de `.env.example` e dos hosts.
4. **Deletar a Edge Function** (comando §5).

---

## 4. Gate de retirement (todos verdes antes de deletar)

- [ ] **M134 fechado** (busca semântica restaurada — não aposentar com search quebrado).
- [ ] **M75 v0.2 estável 7 dias em produção** (SSE :3789 up, sem regressão).
- [ ] **Logs da edge fn = 0 chamadas externas** por 7 dias (só o proxy interno, se houver).
- [ ] Legacy tools removidas/re-apontadas e deployadas (PR mergeado).
- [ ] `ALEXANDRIA_MCP_URL`/`TOKEN` removidos dos `.env` ativos.
- [ ] Backup do código da edge fn arquivado (rollback).

---

## 5. Comando de delete (para o Rael rodar — NÃO executar sozinho)

A Edge Function é gerenciada pelo Supabase; o delete é via CLI/MCP, não SQL:

```bash
# Via Supabase CLI (preferido — versionável):
supabase functions delete alexandria-mcp --project-ref cgpkfhrqprqptvehatad

# OU via MCP/Management API (Rael presente).
```

**Pré-delete (rollback safety):** baixar o código atual antes —
`supabase functions download alexandria-mcp` — e arquivar em `vps-totum` (D-038).

**Rollback:** redeploy do código arquivado —
`supabase functions deploy alexandria-mcp` — e re-set das envs `ALEXANDRIA_MCP_URL/TOKEN`.

---

## 6. Riscos

| # | Risco | Mitigação |
|---|---|---|
| R1 | Cliente externo desconhecido ainda chama a edge fn | Auditoria de logs 7 dias (gate) antes do delete |
| R2 | Remover legacy tools quebra cliente v0.1 | Fase de deprecation (erro orientando o resource nativo) antes da remoção |
| R3 | Delete sem backup → sem rollback | `functions download` + arquivo obrigatório no gate |
| R4 | `verify_jwt=false` já é exposição enquanto viva | Argumento PRÓ-retirement — quanto antes melhor |

---

## 7. Recomendação

Executar **após M134 + 7 dias de M75 estável**, em 2 PRs:
1. **PR código:** deprecar→remover as 3 legacy tools + limpar `.env.example` (reversível, testável).
2. **PR ops (Rael):** auditoria de logs → `functions download` (backup) → `functions delete`.

Ganho: −1 superfície Supabase sem auth (`verify_jwt=false`), −cold start, −acoplamento
proxy. Alinha D-027 e prepara terreno pro M54 (cada edge fn removida reduz o risco do cutover).
