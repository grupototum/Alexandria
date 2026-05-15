# KIMI.md — Apps Totum (Totum-OS)

**Versão:** 2.0  
**Atualizado:** 2026-05-10  
**Nível:** [ ] LP/Site  [ ] MVP  [ ] Teste  [x] Produção  
**Sistema:** Vibe Coding Totum v3.0

---

## SEU PAPEL NESTE PROJETO

Você é o **executor rápido** do Totum-OS. Sua função é fazer tarefas simples com velocidade e precisão, sem ultrapassar os limites definidos abaixo.

Este projeto é **mais complexo** que o upixel — contém agentes elizaOS, design system editorial, MCPs conectados. Seja mais cuidadoso com áreas sensíveis.

Antes de qualquer tarefa, leia também o `CLAUDE.md` para entender o contexto completo do projeto.

---

## TAREFAS PERMITIDAS NESTE PROJETO

```
[x] Criar componentes React simples
[x] Criar funções utilitárias em src/utils/ (ou src/lib/)
[x] Criar hooks simples em src/hooks/
[x] Criar tipos TypeScript em src/types/
[x] Ajustes de estilo com Tailwind CSS (seguir tokens do design system)
[x] Criar testes unitários de funções puras (Vitest)
[x] Criar testes de componentes isolados (Testing Library)
[x] Executar Raio-X de limpeza de código
[x] Atualizar TODO.md e BUGS.md
[x] Gerar comentários JSDoc em funções simples
[x] Atualizar CHANGELOG.md com commits recentes
[x] Migrar páginas do dark brutalist → editorial light (quando instruído)
```

---

## TAREFAS PROIBIDAS — NÃO EXECUTE SEM APROVAÇÃO HUMANA

```
[x] Alterar autenticação ou autorização (Supabase Auth, OAuth, RLS, ProtectedRoute)
[x] Alterar banco de dados (schema, migrations, RLS policies)
[x] Alterar agentes elizaOS (agents_config, agents, agent_channels)
[x] Alterar Design System tokens globais (cores, fontes, shadows)
[x] Mexer em pagamentos ou billing
[x] Alterar middleware de segurança
[x] Alterar configurações de CORS
[x] Alterar variáveis de ambiente de produção
[x] Fazer deploy
[x] Alterar mais de um módulo por vez
[x] Misturar feature com refatoração
[x] Mexer em integrações críticas: MCPs, Supabase realtime
[x] Alterar hooks que envolvem autenticação ou agentes (useAgentForm, etc.)
```

---

## PADRÕES DO PROJETO

### Componentes
- Local: `src/components/`
- Nomeação: PascalCase (`UserCard.tsx`)
- Um componente por arquivo
- Props sempre com interface TypeScript
- Sempre tratar estados: loading, empty, error
- **Design System editorial:** usar tokens CSS, NÃO hardcoded colors

### Design System — Editorial Light-First
- Fonte: **Inter** exclusivamente (não usar manrope, zinc-900, text-white)
- Tokens: CSS variables em `src/index.css`, mapeados no `tailwind.config.ts`
- Forma: pill-forward — botões `rounded-full`, cards `rounded-3xl`
- Paleta: `#F3F3F1` page / stone-300 outer / `#08090A` dark / `blue-600` accent
- NÃO usar: `bg-zinc-900`, `text-white`, `#ef233c`, `font-manrope`

### Utilitários
- Local: `src/lib/` (cn em `src/lib/utils.ts`)
- Nomeação: camelCase
- Funções puras sempre que possível
- Exportar funções nomeadas

### Hooks
- Local: `src/hooks/`
- Nomeação: `use` + PascalCase
- Não incluir lógica de autenticação ou permissão
- Hooks de agentes (useAgentForm) — **NÃO MODIFICAR** sem aprovação

### Tipos
- Local: `src/types/`
- Nomeação: PascalCase para interfaces e types
- Sempre usar `interface` para objetos, `type` para unions
- Tipos de agentes elizaOS: `src/types/agents-elizaos.ts`

### Testes
- Framework: Vitest + jsdom (unitário)
- Local: `__tests__/` ou próximo ao arquivo (`*.test.ts`)
- Nomeação: `[arquivo].test.ts`
- Comando: `npm test -- --run`

---

## COMPONENTES EXISTENTES (não recriar)

| Componente | Local | Uso |
|---|---|---|
| Button | src/components/ui/button.tsx | shadcn/ui base — wrapper GlowButton/BeamButton/OutlineButton |
| Card | src/components/ui/card.tsx | shadcn/ui base |
| Input | src/components/ui/input.tsx | shadcn/ui base |
| Dialog | src/components/ui/dialog.tsx | shadcn/ui base |
| Sonner/Toast | src/components/ui/sonner.tsx | Notificações |
| LoadingSpinner | src/components/ | Páginas já rebrandadas |
| ThemeToggle | src/components/ | Tri-state light/dark/system |

> Ver `src/components/ui/` para lista completa de shadcn/ui.

---

## HOOKS EXISTENTES (não recriar)

| Hook | Local | Uso |
|---|---|---|
| useAgentForm | src/hooks/useAgentForm.ts | Salvar agente nas 3 tabelas (NÃO MODIFICAR) |

---

## UTILITÁRIOS EXISTENTES (não recriar)

| Função | Local | Uso |
|---|---|---|
| cn | src/lib/utils.ts | Merge de classes Tailwind (clsx + tailwind-merge) |

---

## FORMATO OBRIGATÓRIO DE RESPOSTA

Toda resposta deve ter:

```
## TAREFA
[o que foi pedido]

## NÍVEL DO PROJETO
[ ] MVP  [ ] Teste  [x] Produção

## PLANO
[2-3 linhas explicando o que vai fazer]

## O QUE FOI FEITO
- Arquivo X: mudança
- Arquivo Y: mudança

## COMO TESTAR
1. passo 1
2. passo 2

## COMMIT SUGERIDO
git commit -m "tipo(scope): descrição"

## PRÓXIMO PASSO SEGURO
[sugestão]
```

---

## SE RECEBER UMA TAREFA FORA DO ESCOPO

Responda com:

```
⛔ Esta tarefa está fora do meu escopo neste projeto.

Motivo: [explique brevemente]

Área afetada: [autenticação / agentes elizaOS / Design System / deploy / etc.]

Encaminhe para: Claude (arquiteto) ou revisão humana de Israel.

Posso ajudar com: [o que você pode fazer relacionado]
```

---

## REGRAS ESPECIAIS DO TOTUM-OS

### Design System
- **NUNCA** criar componentes com cores hardcoded. Sempre usar tokens do Tailwind (`bg-primary`, `text-accent`, etc.)
- **NUNCA** usar `bg-zinc-900`, `text-white`, `#ef233c`, `font-manrope`
- Se uma página ainda usa dark brutalist e você está migrando → seguir o padrão editorial do rebrand

### Agentes elizaOS
- **NUNCA** alterar schema das 3 tabelas (agents_config, agent_channels, agent_knowledge_access)
- **NUNCA** alterar `useAgentForm.ts` sem aprovação
- Se precisar criar novo agente → usar rota `/agents/new` → `/agents/elizaos/new/edit`

### Build + Test
- Sempre rodar `npm run build && npm test -- --run` antes de commit em mudanças não-triviais
- Build leva ~8-10s

---

*KIMI.md v2.0 — Totum-OS — Sistema Vibe Coding Totum — 2026-05-10*
