# Alexandria MCP Server

Hub de Contexto Semântico central do ecossistema **Totum OS** sobre o protocolo MCP (Model Context Protocol).

Construído com `@modelcontextprotocol/sdk` oficial. Não é plugin — é servidor MCP nativo.

- **Transports:** Stdio (agentes CLI locais — Cursor, Claude Code, Continue.dev) **+** SSE (rede / `totum-system`).
- **Auth (SSE):** Bearer token validado via Keycloak Introspection (clients `alexandria-mcp-read` e `alexandria-admin`). Modo `KEYCLOAK_BYPASS=true` para dev local.
- **Persistência:** Supabase (`cgpkfhrqprqptvehatad`). Embeddings pgvector via RPC `match_documents`.
- **Tipagem:** TypeScript estrito (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).

> **⚙️ Build target: Node 22 LTS.** Incompatibilidade conhecida com **Node 26** — o `esbuild` atual
> falha (`Host version "0.27.7" does not match binary version "0.25.12"`), quebrando `npm run build`.
> Workaround dev: rodar via `tsx` (`npm run dev` / testes não precisam de build). Se virar problema
> operacional: fazer upgrade do `esbuild` ou pinar Node 22.

---

## RESOURCES

| URI | Backend | Conteúdo |
|---|---|---|
| `alexandria://metadata/agents` | `AGENT_DIVISION_MAPPING.json` | Feed dinâmico (57 agentes / 7 divisões). |
| `alexandria://metadata/workflows` | `AGENT_EXECUTION_MATRIX.json` | 20 workflows × 57 agentes. Discovery antes de `execute_agentic_task`. |
| `alexandria://metadata/health` | `AGENT_HEALTH_METRICS.json` | SLA targets + resource budgets por agente. |
| `alexandria://knowledge/search?q=<query>&limit=<n>` | `giles_knowledge` via RPC `match_documents` | Busca semântica na base canônica (657 chunks). Embedding 768d gerado client-side. |
| `alexandria://operations/docs?type={doc\|pop\|skill}&q=<query>&limit=<n>` | `alexandria_documents` via `search_docs`/`search_pops`/`search_skills` | Busca semântica em docs operacionais. RPC selecionada pelo `type`. |

> **Não confundir as 2 famílias** — `knowledge/search` ataca `giles_knowledge` (dataset semântico canônico, 657 linhas, 100% embedded). `operations/docs` ataca `alexandria_documents` (4 linhas, docs operacionais). `rag_documents` (legado 1536d, 0 embeddings) **NÃO é referenciada** — será dropada em M78.

## TOOLS

| Tool | Scope | Descrição |
|---|---|---|
| `execute_agentic_task` | `alexandria:read` | Valida `division`/`task_name` contra a matriz de execução e devolve o **payload pronto para execução** (carrega prompt em `Prompts/` ou `DNAS_39_AGENTES/`). **Não executa.** |
| `log_agent_metrics` | `alexandria:metrics` | Append-only em `agent_metrics_log` no Supabase. Compara `latency_ms` / tokens com os targets de `AGENT_HEALTH_METRICS.json`. |
| `alexandria_search` (legacy) | `alexandria:read` | Proxy HTTP para Edge Function antiga. Mantém compat com `server.mjs` v0.1. |
| `alexandria_get_artifact` (legacy) | `alexandria:read` | idem. |
| `alexandria_context_pack` (legacy) | `alexandria:read` | idem. |

---

## Setup

```bash
cd tools/alexandria-claude-mcp
cp .env.example .env       # preencher Supabase + (opcional) Keycloak
npm install
npm run build
```

### Rodar local (Stdio)

```bash
npm run dev               # tsx, hot reload
# ou
npm start                 # dist/index.js
```

### Rodar local (SSE)

```bash
npm run dev:sse           # MCP_TRANSPORT=sse, porta 4317
curl http://127.0.0.1:4317/healthz
```

### Tests

```bash
npm test
npm run typecheck
```

---

## Config Cursor

`~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "alexandria": {
      "command": "node",
      "args": ["/absolute/path/Alexandria/tools/alexandria-claude-mcp/dist/index.js"],
      "env": {
        "MCP_TRANSPORT": "stdio",
        "SUPABASE_URL": "https://cgpkfhrqprqptvehatad.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "<sk>",
        "KEYCLOAK_BYPASS": "true"
      }
    }
  }
}
```

## Config Claude Code

`~/.claude.json` (ou via `claude mcp add`):

```json
{
  "mcpServers": {
    "alexandria": {
      "command": "node",
      "args": ["/absolute/path/Alexandria/tools/alexandria-claude-mcp/dist/index.js"],
      "env": { "MCP_TRANSPORT": "stdio", "SUPABASE_URL": "...", "SUPABASE_SERVICE_ROLE_KEY": "..." }
    }
  }
}
```

## Config remoto SSE (totum-system)

```yaml
alexandria:
  url: https://auth.grupototum.com/alexandria-mcp/sse
  token: <bearer obtido via client_credentials no Keycloak>
```

---

## Decisões aplicadas

- **D-017** — Sempre `127.0.0.1` em loopback (`MCP_SSE_HOST`).
- **D-021** — Secrets só via `.env` lido do disco; nunca via prompt.
- **D-022 / D-023** — Auth Keycloak realm `totum`, clients `alexandria-mcp-read` (RESOURCES + read tools) e `alexandria-admin` (`log_agent_metrics`).
- **D-024** — Modo M2M-first: SSE é o caminho de rede, Stdio assume confiança local.
- **D-027** — Implementado antes da migração Supabase (M54). Migrar = trocar `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.

## TODOs reportados pra outras divisões

- **[CLAUDE→APP-ALEXANDRIA] M79:** confirmar o encoder 768d que popula `giles_knowledge` HOJE. Default atual no MCP é `text-embedding-004` (Google Gemini). Se for outro, ajustar `EMBEDDING_MODEL` no `.env` — sem isso, os embeddings de query e os armazenados não vão ser do mesmo espaço e a similaridade vira aleatória.
- **[CLAUDE→DEPLOY] M75:** confirmar os nomes exatos das envs dos secrets dos clients Keycloak em `/home/totum/.pepper/.env` (`KC_CLIENT_MCP_READ_SECRET` / `KC_CLIENT_ADMIN_SECRET`?).
- **[CLAUDE→DEPLOY] M75:** subir tunnel `auth.grupototum.com → 127.0.0.1:8180` (Opção 1). Quando pronto, atualizar `KEYCLOAK_INTROSPECT_URL`.
- **[CLAUDE→BANCO] M75:** confirmar se a tabela `agent_metrics_log` existe (consumida por `log_agent_metrics`). Se não, criar — sem ela o tool cai em modo `log-only`.

---

## Migração desde v0.1 (`server.mjs`)

A versão 0.1 era um único arquivo `.mjs` com 3 tools que faziam proxy HTTP para a Edge Function. Ela foi **substituída** mas as 3 tools antigas continuam existindo no nome (`alexandria_search`, `alexandria_get_artifact`, `alexandria_context_pack`) com proxy idêntico — basta manter `ALEXANDRIA_MCP_URL` + `ALEXANDRIA_MCP_TOKEN` no env. Após validação em produção, o `server.mjs` será removido.
