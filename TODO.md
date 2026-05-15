# TODO.md — Totum OS

**Atualizado:** 2026-05-14
**Sistema:** Vibe Coding Totum v3.0
**Base:** Revisão Pré-Produção 6 categorias (ver BUGS.md)

---

## 🔴 CRÍTICO — Antes do próximo deploy

- [ ] **[CAT-5 SRP]** Refatorar `HermioneChat.tsx` (940 linhas)
  - Extrair: `useHermioneChat` hook com todo o estado e lógica de mensagens
  - Extrair: `useHermioneArtifacts` hook para gestão de artifacts
  - A página deve ser declarativa — só renderização
  - Arquivo: `src/pages/HermioneChat.tsx`

---

## 🟡 ALTO — Esta sprint

- [ ] **[CAT-5 SRP]** Auditar `hermioneArtifacts.ts` (987 linhas)
  - Verificar se tem mais de uma responsabilidade
  - Dividir se necessário em `hermioneArtifacts.ts` + `hermioneRenderers.ts`

- [ ] **[VALIDAÇÃO MANUAL]** Testar fluxos afetados pelos fixes
  - Criar artefato Hermione e simular falha de rede
  - Upload inválido/vazio/grande em KnowledgeBridges
  - Chat com agente abrindo/fechando rápido para confirmar cleanup de timers
  - Verificar console sem warnings novos de React

- [ ] **[CAT-5 SRP]** Dividir `DashboardWidgets.tsx` (745 linhas)
  - Extrair cada widget em arquivo próprio: `<PostsWidget />`, `<MetricsWidget />`, etc.
  - Criar `<BaseWidget />` com layout e loading state compartilhados

- [ ] **[CAT-4 ERROS]** Migrar console.log restantes para logger
  - `src/lib/telegram/bot.ts` — 4 ocorrências
  - `src/utils/mobileOptimization.ts` — 2 ocorrências
  - `src/services/embeddingService.ts` — 1 ocorrência → usar `logger.warn`

- [ ] **[CAT-3 PERF]** Auditar 168 `useEffect` — priorizar Alexandria e Agents
  - Identificar effects com deps ausentes
  - Rodar: `npm run lint` e verificar `react-hooks/exhaustive-deps`

- [ ] **[AGENTES]** Executar destinos da matriz dos 17 agentes legados do `totum-system`
  - Matriz criada em `docs/AGENTS_LEGACY_RECONCILIATION_2026-05-13.md`
  - Decidir se `sabia`, `data`, `chaplin` Remotion e `pablo-marcal` noturno viram agentes runtime

- [ ] **[ALEXANDRIA]** Limpar duplicatas de `Legacy Agent DNA: analista`
  - Duplicatas documentadas em `docs/AGENTS_LEGACY_RECONCILIATION_2026-05-13.md`
  - Registros duplicados deprecados em 2026-05-14; artefato canônico preservado

- [ ] **[AGENTES]** Limpar `adjectives` contaminados em agentes gerados antes desta rodada
  - Exemplos observados: `radar_seo`, `content_strategist`
  - Manter correção em rodada separada para evitar churn nos 57 agentes antigos

- [ ] **[DEPLOY]** Confirmar ambiente atual de produção do Totum-OS
  - Verificar se `origin/main` aciona deploy automático
  - Confirmar URL vigente e commit servido
  - Checar status de CI/CD após push

- [ ] **[OPS]** Hardening Hostinger pós-migração Alibaba
  - `legacy.grupototum.com` não é mais requisito: legado fica em `apps.grupototum.com`
  - Healthchecks HTTP auditados para `chat`, `alexandria`, `n8n`, `evolution`, `upixel`, `meta-mcp`, `ollama` e `openclaw`
  - Adicionar backup offsite para `/root/totum-ops/backups`
  - Expandir backups para configs críticas: `/docker/compose`, `/docker/upixel`, `/home/totum/meta-mcp`, `/etc/nginx/conf.d/domains` e `/root/totum-ops`
  - Decidir se `compose_ollama_data` entra no backup ou se os modelos serão reconstruídos via documentação de pull
  - Reconciliar `/docker/compose/docker-compose.yml` com os serviços realmente ativos antes de usar como fonte de disaster recovery
  - Testar alerta Evolution com simulação controlada
  - Inventariar volumes Docker órfãos antes de qualquer prune
  - Remover/migrar nota root de senha operacional para cofre seguro
  - Planejar upgrade do n8n de `2.17.6` para a linha atual sem breaking changes
  - Workflow `Alexandria Capture Intake` validado com env access funcional; migrar token para credential nativa n8n quando houver janela segura
  - Snapshot de evidências: `docs/HARDENING_STATUS_2026-05-13.md`
  - Auditoria root de healthcheck/backup: `docs/ops/VPS_HEALTH_BACKUP_AUDIT_2026-05-14.md`

- [ ] **[CAT-1 MORTO]** Verificar status real de `src/lib/telegram/bot.ts`
  - Está em uso? É feature ativa ou experimento?
  - Se experimento: mover para branch separada ou remover

---

## 🟢 MÉDIO — Backlog

- [ ] **[CAT-5 SRP]** Refatorar `ada/index.tsx` (738 linhas)
  - Separar lógica de UI

- [ ] **[CAT-5 SRP]** Refatorar `KnowledgeBridges.tsx` (733 linhas)
  - Extrair lógica do knowledge graph em hook dedicado

- [ ] **[CAT-6 TS]** Tipar gradualmente os ~199 `any`
  - Priorizar: hooks de agents, contextos de auth

---

## ⚪ BAIXO — Quando tiver tempo

- [ ] **[CAT-2 DRY]** Revisar `DashboardWidgets.tsx` para padrões repetidos entre widgets

---

## ✅ CONCLUÍDO NESTA SESSÃO (2026-05-10)

- [x] CLAUDE.md atualizado v2.0 → v3.0
- [x] KIMI.md atualizado v1.0 → v2.0
- [x] BUGS.md criado com revisão pré-produção 6 categorias
- [x] `console.log` → `logger.log` em 3 arquivos (AgentChatLayout, useAgentExecution, openClawClient)
- [x] `CHANGELOG.md` atualizado com fixes de Alexandria/Hermione
- [x] `BUGS.md` atualizado com bug de circular chunk e fixes resolvidos
- [x] `exports/` decidido como output gerado e removido do tracking
- [x] `.vscode/settings.json` decidido como local-only e removido do tracking
- [x] `Prompts/` decidido como documentação canônica do projeto
- [x] Circular chunk `vendor-charts -> vendor-ui -> vendor-charts` resolvido via chunk neutro `vendor-visuals`
- [x] Fonte do `alexandria-proxy` versionada com contrato LobeHub v1.1
- [x] `alexandria-proxy` v1.1 deployado no Supabase com GET manifest e POST `/search`, `/pop`, `/client-brief` validados
- [x] Base server-side da Fase 5 criada: rota interna `/capture` no `alexandria-proxy` + workflow n8n inativo versionado
- [x] `ALEXANDRIA_CAPTURE_TOKEN` configurado no Supabase/n8n, n8n reiniciado saudável e workflow `Alexandria Capture Intake` importado como inativo
- [x] `totum-chat` recuperado na Hostinger, container saudável e origem Nginx validada com HTTP 200
- [x] `Totum-Chat` sincronizado com arquivos operacionais extraídos da VPS e pushado no commit `5937142`
- [x] Fase 5 manual validada ponta a ponta: POST no webhook n8n criou artefato Alexandria e busca por marcador retornou o registro
- [x] Inventário inicial de agentes criado em `docs/AGENTS_INVENTORY_2026-05-13.md`
- [x] 10 DNAs `aa-*` pendentes convertidos para `src/agents/` com `AGENT.md`, `character.json` e registry
- [x] Matriz de conciliação dos 17 agentes legados do `totum-system` criada
- [x] Snapshot de hardening Hostinger/DNS criado com evidências de saúde e pendências
- [x] 12 markdowns legados de agentes assimilados na Alexandria via workflow n8n da Fase 5
- [x] Scripts root de healthcheck/backup da VPS auditados em modo read-only e relatório salvo em `docs/ops/VPS_HEALTH_BACKUP_AUDIT_2026-05-14.md`
- [x] Duplicatas `Legacy Agent DNA: analista` deprecadas na Alexandria e `alexandria-proxy` ajustado para ocultar artefatos `deprecated`/`superseded`
- [x] Workflow n8n `Alexandria Capture Intake` validado ponta a ponta com env access; artefato de teste foi deprecado após validação
- [x] `clientes-totum` preparado para migração Supabase `sb_secret_*` no commit `aeb596b`

---

## COMANDOS RÁPIDOS

```bash
# Lint
npm run lint

# Build
npm run build

# Contar useEffects
grep -r "useEffect" src --include="*.tsx" --include="*.ts" | wc -l

# Ver arquivos maiores
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -n | tail -15
```

---

*TODO.md — Totum OS — Vibe Coding Totum v3.0 — 2026-05-10*
