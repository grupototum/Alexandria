# BUGS.md — Totum OS

**Atualizado:** 2026-05-12
**Sistema:** Vibe Coding Totum v3.0
**Revisão:** skill-revisao-pre-producao.md (6 categorias)

---

## LEGENDA

| Símbolo | Prioridade |
|---|---|
| 🔴 | Crítico — resolver antes de qualquer deploy |
| 🟡 | Alto — resolver nesta sprint |
| 🟢 | Médio — backlog |
| ⚪ | Baixo — quando tiver tempo |

---

## BUGS ATIVOS

| Prioridade | Área | Problema | Status |
|---|---|---|---|
| 🟡 | Hostinger/DNS | `legacy.grupototum.com` está servindo a página da Upixel, não o Totum-OS legado | Pendente correção de rota/cutover |
| 🟡 | n8n | Instância `2.17.6` está 4 releases atrás; `n8n audit` recomendou atualização | Pendente janela de upgrade |
| 🟡 | n8n | Workflow de captura Alexandria está importado, mas ainda inativo; Fase 5 ainda não está publicada operacionalmente | Token configurado e autenticação testada; falta teste payload real + publish |
| 🟢 | Hostinger/backups | Backups cobrem Postgres via dump e volumes principais, mas `compose_ollama_data` e configs de apps não estão claramente cobertos | Pendente política de backup/rebuild |

---

## REVISÃO PRÉ-PRODUÇÃO — 6 CATEGORIAS (2026-05-10)

### CATEGORIA 1 — CÓDIGO MORTO / RAIO-X

| Severidade | Arquivo | Problema |
|---|---|---|
| 🟡 | `src/lib/telegram/bot.ts` | Módulo de bot Telegram com `console.log` diretos (não usa logger). Verificar se está em uso real ou é experimento |
| 🟢 | `src/utils/mobileOptimization.ts` | Funções de diagnóstico com `console.log` — parecem ser utilitários de dev, não produção |
| ✅ | `src/lib/logger.ts` | Logger utilitário presente e correto — silencioso em produção, verboso em dev |

---

### CATEGORIA 2 — DUPLICAÇÃO (DRY)

| Severidade | Local | Problema | Solução |
|---|---|---|---|
| 🟡 | `src/services/hermioneArtifacts.ts` (987 linhas) | Serviço muito grande — verificar se há lógica duplicada internamente | Auditoria interna do arquivo |
| 🟢 | `src/components/dashboard/DashboardWidgets.tsx` (745 linhas) | Vários widgets similares provavelmente com código repetido | Extrair `<BaseWidget />` genérico |
| ✅ | `downloadBlob` duplicado | Helper local repetido em Alexandria/Hermione | Extraído para `src/lib/downloadBlob.ts` em 2026-05-12 |

---

### CATEGORIA 3 — PERFORMANCE

| Severidade | Arquivo | Problema | Solução |
|---|---|---|---|
| 🟡 | 168 `useEffect` no projeto | Alto para o tamanho — risco de stale closures e renders desnecessários | Auditar por módulo, priorizar Alexandria e Agents |
| 🟢 | `HermioneChat.tsx` (940 linhas) | Componente de chat com lógica + UI + estado — pode causar re-renders excessivos | Extrair hooks de estado |
| ✅ | `AgentChatLayout.tsx` | Efeito de steps com deps suprimidas e cleanup frágil | Corrigido em 2026-05-12 |
| ✅ | Zustand stores | `uiStore`, `sidebarStore` — boa arquitetura para estado global de UI | — |
| ✅ | `AuthContext` + `ThemeContext` | Contextos separados por responsabilidade — correto | — |

---

### CATEGORIA 4 — TRATAMENTO DE ERROS

| Severidade | Situação | Observação |
|---|---|---|
| ✅ | `ErrorBoundary` presente | `src/components/ErrorBoundary.tsx` existe e está no `App.tsx` — excelente |
| ✅ | `logger.ts` em uso | Logger módulo correto implementado |
| 🟡 | `console.log` diretos | Alguns arquivos ainda usam `console.log` em vez do logger — corrigidos parcialmente |
| 🟢 | `src/lib/telegram/bot.ts` | 4 `console.log` diretos no bot — usar logger |
| 🟢 | `src/utils/mobileOptimization.ts` | 2 `console.log` de diagnóstico — usar logger ou remover |
| 🟢 | `src/services/embeddingService.ts` | 1 `console.log` de fallback — usar `logger.warn` |
| ✅ | `hermioneArtifacts.ts` | Inserts secundários sem checar erro podiam gerar sucesso parcial silencioso | Corrigido em 2026-05-12 |
| ✅ | `KnowledgeBridges.tsx` | Falha de leitura de arquivo local não tinha mensagem amigável | Corrigido em 2026-05-12 |

---

### CATEGORIA 5 — SEPARAÇÃO DE RESPONSABILIDADES

| Severidade | Arquivo | Linhas | Problema |
|---|---|---|---|
| 🔴 | `src/pages/HermioneChat.tsx` | 940 | Chat UI + estado + API + artifacts tudo junto |
| 🟡 | `src/services/hermioneArtifacts.ts` | 987 | Serviço gigante — avaliar se tem mais de uma responsabilidade |
| 🟡 | `src/components/dashboard/DashboardWidgets.tsx` | 745 | Múltiplos widgets num único arquivo |
| 🟡 | `src/pages/ada/index.tsx` | 738 | Verificar separação de lógica e UI |
| 🟡 | `src/pages/alexandria/KnowledgeBridges.tsx` | 733 | Lógica de knowledge graph + UI |
| 🟢 | `src/pages/AICommandCenter.tsx` | 602 | Ponto de entrada do OS — pode crescer |
| ✅ | `AuthContext` + `ThemeContext` | — | Responsabilidades bem separadas |
| ✅ | Zustand stores | — | Estado UI separado do contexto |

---

### CATEGORIA 6 — TYPESCRIPT

| Severidade | Problema | Qtd | Local |
|---|---|---|---|
| 🟡 | `any` explícito | ~199 | Espalhado pelo projeto |
| ✅ | `AgentChatLayout.tsx` | `any` local no formatter de output | Substituído por `unknown` + helper em 2026-05-12 |
| ✅ | `strict mode` | — | Verificar tsconfig — projeto Vite |
| 🟢 | Tipos de integração Supabase | — | `src/integrations/supabase/types.ts` (972 linhas) — gerado automaticamente, não editar |

---

## CORREÇÕES EXECUTADAS NESTA SESSÃO (2026-05-10)

| Arquivo | Correção | Tipo |
|---|---|---|
| `src/components/chat/AgentChatLayout.tsx` | `console.log` → `logger.log` + import logger | `chore` |
| `src/hooks/useAgentExecution.ts` | 2× `console.log` → `logger.log` + import logger | `chore` |
| `src/services/openClawClient.ts` | 3× `console.log` → `logger.log` + import logger | `chore` |
| `src/services/openClawClient.ts` | Formatação de imports corrigida | `chore` |

---

## CORREÇÕES EXECUTADAS NESTA SESSÃO (2026-05-12)

| Arquivo | Correção | Tipo |
|---|---|---|
| `src/services/hermioneArtifacts.ts` | Erros de inserts secundários agora são checados e propagados | `fix` |
| `src/pages/alexandria/KnowledgeBridges.tsx` | Leitura de arquivos locais com `try/catch` e feedback amigável | `fix` |
| `src/components/chat/AgentChatLayout.tsx` | Efeito de steps sem `eslint-disable`, cleanup de timers e dead code removido | `fix` |
| `src/hooks/useAlexandria.ts` | `loadAlexandriaData` estabilizado com `useCallback` | `fix` |
| `src/hooks/useAgentExecution.ts` | Removido `useEffect` usado só para atualizar refs | `refactor` |
| `src/lib/downloadBlob.ts` | Helper compartilhado para downloads | `refactor` |
| `.gitignore` | `exports/` documentado como output gerado | `chore` |

---

## HISTÓRICO DE BUGS RESOLVIDOS

| Data | Bug | Solução |
|---|---|---|
| 2026-04-18 | Tela branca na tela de Agentes | Ver `BUGFIX_AGENTES_TELA_BRANCA.md` |
| 2026-05-10 | console.log diretos em AgentChatLayout, useAgentExecution, openClawClient | Migrado para logger |
| 2026-05-12 | inserts secundários da Hermione sem validação | Checagem explícita de erros |
| 2026-05-12 | falhas de leitura em KnowledgeBridges sem feedback | Mensagens amigáveis via toast |
| 2026-05-12 | deps suprimidas no efeito de steps do chat | Cleanup e refs estáveis |
| 2026-05-12 | `Circular chunk: vendor-charts -> vendor-ui -> vendor-charts` | `vite.config.ts` agrupa Radix/styling utils + Recharts/D3 em `vendor-visuals` |

---

*BUGS.md — Totum OS — Sistema Vibe Coding Totum v3.0*
