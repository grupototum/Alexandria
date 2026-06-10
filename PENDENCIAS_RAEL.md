# PENDENCIAS_RAEL.md — Implementação madrugada 2026-06-10

**Branch:** `feat/m54-implementacao-madrugada-20260610` (base: `docs/M54-contract-v2`)
**O que foi feito nesta madrugada:** ver CHANGELOG e o corpo do commit. Resumo: sequência M54 PR-2→PR-5 implementada em código (grid de agentes com tipo D-052, tab Console na página de detalhe, Console adaptativo por tipo, visão Hierarquia) + migration de backfill versionada (não aplicada).

Tudo abaixo precisa de **decisão sua ou credencial** — nada disso foi executado (No-Fly Zones / D-042).

---

## 1. Migration de backfill `metadata.type` — APROVAR E APLICAR

- Arquivo: `supabase/migrations/20260610050000_backfill_agents_config_metadata_type.sql`
- Faz backfill idempotente de `agents_config.metadata.type` com as 5 categorias D-052 por heurística de keywords (nome/role/system_prompt).
- **Não aplicada** (No-Fly Zone: dados em produção + sem MCP Supabase nesta sessão).
- ⚠️ A heurística precisa de **conferência humana agente a agente** (são só 18 rows em `agents_config`). Rodar o SELECT de auditoria no fim do arquivo e corrigir manualmente os tipos errados.
- Enquanto não aplicar: o frontend usa a **mesma heurística client-side** (`src/types/agent-type.ts → inferAgentType`) como fallback, então o grid já mostra tipo hoje. Aplicar a migration torna o DB a fonte de verdade.

## 2. Merges pendentes (sequência combinada no chat ARQUITETO)

- **PR #13** (`docs/M54-contract-v2` — contract v3): estava "ready to merge". Mergear primeiro.
- **PR #24 (Totum OS):** fora deste repo. Nota: com D-051 (Alexandria standalone), o código desta madrugada **não depende** do Totum OS — a espera por PR #24 é só de coordenação, não técnica.
- Depois: abrir PR desta branch (`feat/m54-implementacao-madrugada-20260610`). Ela já contém o commit do contract v3 (foi criada em cima da PR #13), então o GitHub mostra a PR limpa após o merge da #13.

## 3. Types gerados do Supabase — REGENERAR

- `src/integrations/supabase/types.ts` está **desatualizado** (não tem `agents_config`, `agent_executions`, nem colunas `description/slug/agent_group/is_orchestrator` de `agents`).
- O plano do PR-1 previa regenerar via `supabase gen types` no project `cgpkfhrqprqptvehatad`. Precisa de credencial/CLI Supabase.
- Por isso os hooks novos usam `(supabase as any)` — mesmo padrão do `useAlexandria` existente. Após regenerar, tipar de verdade.

## 4. M54 self-hosted (épico de 4 semanas) — DECISÕES DE DESIGN

O design (`docs/M54_alexandria_self_hosted_POC_design.md`) e o playbook de 15 PRs (branch `docs/M54-v1-execution-playbook`) estão prontos, mas as 4 decisões do Arquiteto seguem abertas:

1. **Auth no V1:** GoTrue (recomendado no doc) vs Keycloak direto.
2. **Target PG:** confirmar **PG17** (briefing dizia 16 — inviável por paridade de dump).
3. **`send-invite`:** rewrite Node vs `edge-runtime` Deno self-hosted.
4. **Ordenação:** M118-fix antes do M54-V1 (resource quebrado não pode ir pro critério GREEN).

Pré-requisitos de cutover que só você destrava: rotação M27 (Key A), janela de manutenção, backup off-site.

## 5. Saúde do ambiente/suíte (descobertas da madrugada)

- **`node_modules` estava corrompido** (binário esbuild 0.25.12 dentro do pacote 0.21.5 do Vite → `npm run build` e `vitest` travavam para sempre em "transforming..."). Corrigido com `npm ci` limpo (com `PUPPETEER_SKIP_DOWNLOAD=true` — o postinstall do puppeteer falhava ao baixar browser). Build agora passa em ~5s.
- **10 testes pré-existentes falhando** (não relacionados a esta entrega; falham na base limpa também): `src/config/navigation.test.ts` (8) e `src/components/layout/AppSidebar.test.tsx` (2) — a config de navegação divergiu dos testes em algum momento. Decidir: atualizar testes ou navegação.
- Testes novos desta entrega: `src/types/agent-type.test.ts` — 10/10 passando.

## 6. Verificações rápidas recomendadas na revisão de amanhã

- Conferir no grid (`/agents`) se os tipos inferidos fazem sentido — é a mesma heurística da migration; erros aqui = erros lá.
- Tab **Console** na página de detalhe: hoje lê `agent_executions` por `agent_id` (uuid do mirror + slug). Se as execuções usarem outro id lógico, ajustar a lista de ids em `ConsoleAdaptativo.tsx`.
- `dist/sw.js` e `dist/workbox-*.js` aparecem como untracked no git — `dist/` parece que deveria estar no `.gitignore`; decidir se ignora.

---

*Gerado pela sessão de madrugada 2026-06-10. Amanhã revisamos tudo.*
