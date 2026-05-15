# CHANGELOG — Totum OS

**Sistema:** Vibe Coding Totum v3.0
Formato: `[tipo] descrição — arquivo(s) afetado(s)`

---

## [Unreleased]

## [ops] 2026-05-13 — Totum Chat + Fase 5 capture validation

### Fixed
- Recuperado `totum-chat` na Hostinger: container recriado, healthcheck ativo e origem Nginx `chat.grupototum.com/chat` voltou a responder HTTP 200

### Added
- Versionados no repo `grupototum/Totum-Chat` os arquivos operacionais extraídos da VPS (`agents-index.json`, `public/agents-index.json`, `src/alexandria-integration.js`, `setup.sh`)

### Validated
- Workflow n8n `Alexandria Capture Intake` ativado e testado com payload manual
- Fluxo Fase 5 validado ponta a ponta: `n8n.grupototum.com/webhook/alexandria-capture` → `alexandria-proxy/capture` → artefato Hermione/Alexandria → busca via `alexandria-proxy/search`

### Notes
- O n8n bloqueia `$env` dentro de nodes; o workflow em produção foi ajustado sem expor o token. Follow-up recomendado: configurar `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` no Compose com usuário root/sudo ou migrar o token para credential nativa do n8n.

## [feat] 2026-05-12 — Alexandria capture intake foundation

### Added
- Added an internal token-protected `/capture` route to `alexandria-proxy` for n8n/server-side capture into existing Hermione source/artifact/version/link tables
- Added an inactive n8n workflow template for manual output capture via webhook → Alexandria proxy

### Notes
- The capture route is intentionally not exposed in the public LobeHub plugin manifest because it requires an internal bearer token
- `ALEXANDRIA_CAPTURE_TOKEN` is configured in Supabase and n8n; the workflow is active and the first real payload validation passed on 2026-05-13

## [feat] 2026-05-12 — Alexandria LobeHub plugin contract

### Added
- Versioned the `alexandria-proxy` Supabase Edge Function source with a LobeHub plugin manifest
- Added formal tool routes for `searchAlexandria`, `getPop` and `getClientBrief`
- Preserved the existing root POST search behavior for backward compatibility
- Deployed the proxy with public plugin access (`verify_jwt = false`) and validated all three routes live

## [fix] 2026-05-12 — Build chunk hardening

### Fixed
- Removed Rollup circular chunk warning by grouping Radix/styling utilities and Recharts/D3 dependencies into `vendor-visuals`

## [fix/chore] 2026-05-12 — Alexandria review cleanup

### Fixed
- Error handling on Hermione secondary inserts (`hermione_artifact_versions`, source links and `hermione_consultations`)
- File reading errors in `KnowledgeBridges` now show friendly messages
- `AgentChatLayout` step effect dependencies and timer cleanup
- `useAlexandria` hook dependencies via `useCallback`
- `openClawClient` direct debug logs now use the shared logger

### Refactored
- Extracted shared `downloadBlob` helper
- Replaced unnecessary `useMemo` on KnowledgeBridges score calculation
- Replaced local `any` output formatting with `unknown` and a stringify helper
- Removed effect-only callback ref sync from `useAgentExecution`

### Housekeeping
- `.vscode/settings.json` moved out of Git tracking; kept local-only
- `exports/` moved out of Git tracking and ignored as generated skill export output
- `Prompts/` added as project documentation for Totum 3.0 phases and Alexandria migration context

---

## [chore/docs] 2026-05-10 — Modo Madruga: Adequação Vibe Coding Totum v3.0

### Documentação
- `docs` CLAUDE.md atualizado v2.0 → v3.0 — adicionado LP/Site, pergunta-gatilho, Fase 0, Totum Torah
- `docs` KIMI.md atualizado v1.0 → v2.0 — adicionado LP/Site, saúde técnica
- `docs` BUGS.md criado — revisão pré-produção 6 categorias
- `docs` TODO.md criado — ações priorizadas por severidade

### Correções de código
- `chore` `AgentChatLayout.tsx` — `console.log` substituído por `logger.log` + import do logger
- `chore` `useAgentExecution.ts` — 2× `console.log` → `logger.log` + import do logger
- `chore` `openClawClient.ts` — 3× `console.log` → `logger.log` + import do logger, formatação de imports corrigida

---

## [fix] 2026-04-18 — Bugfix: Tela branca na tela de Agentes

- `fix` Ver `BUGFIX_AGENTES_TELA_BRANCA.md` para detalhes

---

*CHANGELOG.md — Totum OS — Vibe Coding Totum v3.0*
