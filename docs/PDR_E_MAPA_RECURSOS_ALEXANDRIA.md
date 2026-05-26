# PDR e mapa de recursos da Alexandria

Data: 2026-05-16  
Produto: Alexandria no Totum OS  
Repositorio: `/Users/israellemos/Documents/Pixel Systems/Alexandria`  
Ambiente publicado: `https://alexandria.grupototum.com`

## 1. PDR

### 1.1. Visao geral

Alexandria passa a ser uma instancia completa do Totum OS, com foco em conhecimento operacional, agentes, skills, POPs, clientes, tarefas, automacoes e ferramentas de IA. Em vez de manter uma aplicacao isolada e pequena, o produto agora parte da base completa do Totum OS para permitir que o time remova depois o que nao fizer sentido.

### 1.2. Objetivo do produto

Centralizar o trabalho operacional e cognitivo da Totum em uma unica interface:

- Consultar e organizar conhecimento da Alexandria.
- Operar agentes de IA, skills e automacoes.
- Gerenciar tarefas, clientes, conteudo, planos de acao e documentos.
- Conectar ferramentas externas como Supabase, n8n, Google Drive, OpenClaw, Suna, Claude Code e Telegram.
- Servir como base para decidir, pagina por pagina, o que permanece em Alexandria e o que volta a ser exclusivo de Apps Totum.

### 1.3. Publicos principais

- Operador Totum: usa tarefas, clientes, conteudo, POPs e documentacao para executar rotinas.
- Gestor: acompanha dashboard, agentes, aprovacoes, hosting, deploys e mapa do sistema.
- Especialista de IA: configura agentes, skills, fluxos, bridges e ferramentas de IA.
- Administrador: controla acesso, operadores, aprovacoes, ambiente e integracoes.

### 1.4. Problemas que resolve

- Conhecimento espalhado entre documentos, agentes, pastas, POPs e repositorios.
- Dificuldade de saber qual agente, skill ou fluxo usar para cada tarefa.
- Dependencia de ferramentas separadas para clientes, operacao, conteudo e IA.
- Falta de uma visao unica para debug, deploy, infraestrutura e operacao.

### 1.5. Principios de produto

- Alexandria deve ser a biblioteca operacional viva da Totum.
- Cada pagina deve ter um dono funcional claro.
- Toda integracao deve degradar com fallback seguro se credenciais ou servicos externos estiverem indisponiveis.
- A UI deve favorecer navegacao lateral, busca, contexto e continuidade de trabalho.
- A remocao futura de modulos deve ser conservadora: primeiro entender uso e dependencias, depois apagar.

### 1.6. Escopo atual

Incluido agora:

- Aplicacao Vite/React completa do Totum OS.
- Backend Express em `api/server.js`.
- Rotas protegidas por autenticacao.
- Dashboard, agentes, Alexandria, operacao, clientes, sistema e ferramentas IA.
- Supabase como backend principal.
- Docker Compose publicado no VPS no container `alexandria-api`.
- Healthchecks publicos em `/health` e `/api/health`.

Fora do escopo deste documento:

- Decidir quais modulos serao removidos.
- Reescrever design visual.
- Migrar banco ou criar novas tabelas.
- Auditar seguranca de cada endpoint em profundidade.

### 1.7. Metricas de sucesso

- O root publico entrega HTML da aplicacao, nao JSON.
- Login e rotas protegidas carregam sem erro de console.
- Dashboard e Alexandria funcionam como ponto de partida.
- Build, TypeScript e testes automatizados passam.
- Cada pagina tem uma descricao de uso e um exemplo pratico documentado.
- Cada pasta relevante tem uma funcao clara no inventario.

### 1.8. Riscos conhecidos

- A base foi copiada inteira; ha modulos que podem nao fazer sentido para Alexandria.
- Algumas areas dependem de Supabase, n8n, Google Drive, OpenClaw, Suna ou outras credenciais externas.
- Existem muitos documentos historicos e artefatos de execucao que podem confundir o escopo.
- `node_modules` e `dist` sao gerados localmente e nao devem ser tratados como fonte de produto.
- O produto pode herdar nomes e textos de Totum OS que ainda precisarao ser adaptados para Alexandria.

### 1.9. Requisitos funcionais resumidos

- Autenticacao: login, cadastro, recuperacao, reset, callback e aprovacao pendente.
- Navegacao: menu lateral com secoes Inicio, IA, Alexandria, Operacao e Sistema.
- Conhecimento: central Alexandria, POPs, contexto, skills, bridges e tutorial.
- Agentes: painel, detalhe, edicao ElizaOS e command center.
- Operacao: tarefas, pipeline de conteudo, plano de acao e recorrencia.
- Clientes: listagem, novo cliente e edicao.
- Sistema: configuracoes, operadores, aprovacoes, hosting, deploy e documentacao.
- IA tools: Claude Code, Cráudio Codete, Ada, Suna, OpenClaw e Hermione.
- Backend: healthcheck, setup, agentes, transcricao, ingestao, webhooks e outputs.

### 1.10. Requisitos nao funcionais

- Build reprodutivel via `npm run build`.
- Tipagem validavel via `npx tsc --noEmit`.
- Testes executaveis via `npm test` com variaveis `VITE_SUPABASE_*`.
- Container com healthcheck interno.
- Publicacao atras de Nginx/Cloudflare no dominio Alexandria.
- Fallbacks de loading, erro e rotas nao encontradas.

## 2. Mapa pagina por pagina

### 2.1. Rotas publicas

| Rota | Arquivo | Recurso | Exemplo de aplicacao |
| --- | --- | --- | --- |
| `/` | `src/App.tsx` | Redirect para login | Usuario acessa o dominio raiz e e enviado para `/login`. |
| `/login` | `src/pages/Login.tsx` | Entrada no sistema | Operador entra com email/senha para acessar Alexandria. |
| `/signup` | `src/pages/SignUp.tsx` | Cadastro | Novo membro solicita acesso ao ambiente. |
| `/forgot-password` | `src/pages/ForgotPassword.tsx` | Recuperacao de senha | Usuario pede link de recuperacao. |
| `/reset-password` | `src/pages/ResetPassword.tsx` | Redefinicao de senha | Usuario define nova senha apos fluxo de recuperacao. |
| `/auth/callback` | `src/pages/AuthCallback.tsx` | Callback de autenticacao | Supabase redireciona para finalizar login/reset. |
| `/pending-approval` | `src/pages/PendingApproval.tsx` | Espera de aprovacao | Usuario cadastrado aguarda liberacao por admin. |
| `/google-drive/callback` | `src/pages/workspace/GoogleDriveCallback.tsx` | Callback Google Drive | Finaliza autorizacao OAuth do Google Drive. |
| `*` | `src/pages/NotFound.tsx` | Pagina 404 | Qualquer rota inexistente cai em fallback amigavel. |

### 2.2. Inicio

| Rota | Arquivo | Recurso | Exemplo de aplicacao |
| --- | --- | --- | --- |
| `/dashboard` | `src/pages/Dashboard.tsx` | Visao geral operacional | Gestor acompanha indicadores, widgets e estado geral da operacao. |
| `/hub` | `src/App.tsx` | Redirect legado | Links antigos de hub continuam funcionando e apontam para dashboard. |
| `/office` | `src/pages/OfficeView.tsx` | Escritorio visual | Time usa uma visualizacao imersiva do ambiente/operacao. |

### 2.3. IA e agentes

| Rota | Arquivo | Recurso | Exemplo de aplicacao |
| --- | --- | --- | --- |
| `/ai-command-center` | `src/pages/AICommandCenter.tsx` | Chat e comando de agentes | Operador conversa com Radar, Gestor, Social, SDR ou outro agente. |
| `/ai-command-center?tab=generators` | `src/pages/AICommandCenter.tsx` | Geradores | Criar briefing, ideias, respostas, roteiros ou prompts. |
| `/ai-command-center?agent=radar` | `src/pages/AICommandCenter.tsx` | Agente Radar | Pedir analise de SEO, AEO ou oportunidade de crescimento. |
| `/ai-command-center?agent=gestor` | `src/pages/AICommandCenter.tsx` | Agente Gestor | Resumir prioridades da semana e riscos operacionais. |
| `/ai-command-center?agent=social` | `src/pages/AICommandCenter.tsx` | Agente Social | Gerar calendario de posts e ideias para canais sociais. |
| `/ai-command-center?agent=atendente` | `src/pages/AICommandCenter.tsx` | Agente Atendente | Rascunhar resposta para cliente com tom de suporte. |
| `/ai-command-center?agent=sdr` | `src/pages/AICommandCenter.tsx` | Agente SDR | Criar sequencia outbound e qualificacao de lead. |
| `/ai-command-center?agent=kimi` | `src/pages/AICommandCenter.tsx` | Agente Kimi | Usar agente tecnico/analitico para decompor uma tarefa. |
| `/agents` | `src/pages/agents/AgentsDashboard.tsx` | Painel de agentes | Ver catalogo, status, metricas, hierarquia e integracoes de agentes. |
| `/agents/new` | `src/App.tsx` | Redirect para criacao | Atalho leva para editor ElizaOS em modo novo agente. |
| `/agents/:agentId` | `src/pages/agents/AgentDetail.tsx` | Detalhe do agente | Abrir perfil do agente, instrucoes, capacidades e metricas. |
| `/agents/:agentId/chat` | `src/App.tsx` | Redirect para command center | Link antigo de chat abre o agente no command center. |
| `/agents/elizaos/:agentId/edit` | `src/pages/agents/AgentElizaOSEdit.tsx` | Edicao de agente ElizaOS | Ajustar character, comportamento, plugins e configuracao. |
| `/command-center` | `src/App.tsx` | Redirect legado | Links antigos continuam abrindo `/ai-command-center`. |
| `/totum-chat` | `src/App.tsx` | Redirect legado | Links antigos de chat continuam abrindo `/ai-command-center`. |
| `/hub-agentes` | `src/App.tsx` | Redirect legado | Mantem compatibilidade com links antigos. |
| `/painel-agentes` | `src/App.tsx` | Redirect legado | Mantem compatibilidade com links antigos. |
| `/agents-dashboard` | `src/App.tsx` | Redirect legado | Mantem compatibilidade com links antigos. |
| `/agentes/:agentId` | `src/App.tsx` | Redirect legado | Redireciona para `/agents/:agentId`. |
| `/agentes/:agentId/:subId` | `src/App.tsx` | Redirect legado | Ignora subrota antiga e abre detalhe do agente. |
| `/agente/:agenteId` | `src/App.tsx` | Redirect legado | Compatibilidade singular em portugues. |
| `/agent-profile/:agentId` | `src/App.tsx` | Redirect legado | Compatibilidade de perfil antigo. |
| `/agent/radar` | `src/App.tsx` | Redirect rapido | Abre command center com Radar. |
| `/agent/gestor` | `src/App.tsx` | Redirect rapido | Abre command center com Gestor. |
| `/agent/social` | `src/App.tsx` | Redirect rapido | Abre command center com Social. |
| `/agent/atendente` | `src/App.tsx` | Redirect rapido | Abre command center com Atendente. |
| `/agent/sdr` | `src/App.tsx` | Redirect rapido | Abre command center com SDR. |
| `/agent/kimi` | `src/App.tsx` | Redirect rapido | Abre command center com Kimi. |
| `/agent/ads-extractor` | `src/App.tsx` | Redirect rapido | Abre command center com agente de extracao de ads. |

### 2.4. Ferramentas IA

| Rota | Arquivo | Recurso | Exemplo de aplicacao |
| --- | --- | --- | --- |
| `/alexandria/openclaw` | `src/pages/alexandria/OpenClawDashboard.tsx` | OpenClaw | Monitorar ou acionar automacoes externas via OpenClaw. |
| `/suna` | `src/pages/suna/index.tsx` | Suna Agent | Executar ou acompanhar agente Suna conectado a tarefas. |
| `/claude-code` | `src/pages/ClaudeCode.tsx` | Claude Code | Registrar comandos, orientacoes ou fluxo de coding assistido. |
| `/craudio-codete` | `src/pages/iatools/CraudioCodete.tsx` | Ferramenta IA interna | Usar assistente especializado para codigo/operacao. |
| `/ada` | `src/pages/ada/index.tsx` | Ada | Gerar diagramas ou analises estruturadas. |

### 2.5. Alexandria

| Rota | Arquivo | Recurso | Exemplo de aplicacao |
| --- | --- | --- | --- |
| `/alexandria` | `src/pages/alexandria/index.tsx` | Central Alexandria | Buscar e navegar por conhecimento, artefatos e modulos da biblioteca. |
| `/alexandria?tab=exports` | `src/pages/alexandria/index.tsx` | Exportadores IA | Preparar conteudo para ChatGPT, Claude, Kimi ou skills-sync. |
| `/alexandria/pops` | `src/pages/alexandria/PopsPortal.tsx` | Portal POPs | Consultar procedimento operacional antes de executar uma tarefa. |
| `/alexandria/context` | `src/pages/alexandria/ContextHubPage.tsx` | Context Hub | Ver contexto consolidado para agentes e operadores. |
| `/alexandria/skills` | `src/pages/alexandria/SkillsCentral.tsx` | Central de skills | Descobrir qual skill usar para Gmail, Drive, Slack, n8n, PDF etc. |
| `/alexandria/bridges` | `src/pages/alexandria/KnowledgeBridges.tsx` | Conexoes de conhecimento | Validar sync entre Alexandria, Supabase, skills e agentes. |
| `/alexandria/tutorial` | `src/pages/alexandria/AlexandriaTutorial.tsx` | Tutorial | Onboarding para entender como usar Alexandria. |
| `/hermione` | `src/pages/HermioneChat.tsx` | Hermione | Conversar com assistente de conhecimento e assimilacao. |
| `/wiki` | `src/App.tsx` | Redirect legado | Links antigos de wiki abrem Alexandria. |

### 2.6. Operacao

| Rota | Arquivo | Recurso | Exemplo de aplicacao |
| --- | --- | --- | --- |
| `/tasks` | `src/pages/QuadroTarefas.tsx` | Quadro de tarefas | Gerenciar kanban de tarefas, comentarios, subtarefas e recorrencia. |
| `/quadro-tarefas` | `src/App.tsx` | Redirect legado | Mantem compatibilidade com URL antiga. |
| `/content` | `src/pages/ContentPipeline.tsx` | Pipeline de conteudo | Criar, mover e revisar pecas de conteudo por etapa. |
| `/action-plan` | `src/pages/ActionPlan.tsx` | Plano de acao | Transformar diagnostico em tarefas, owners e prazos. |
| `/task-recurrence` | `src/pages/workspace/TaskRecurrence.tsx` | Recorrencia de tarefas | Criar tarefas repetidas para rotinas semanais ou mensais. |

### 2.7. Clientes

| Rota | Arquivo | Recurso | Exemplo de aplicacao |
| --- | --- | --- | --- |
| `/clients` | `src/pages/ClientsCenter.tsx` | Central de clientes | Listar, filtrar, selecionar e abrir clientes ativos. |
| `/new-client` | `src/pages/NewClient.tsx` | Novo cliente | Cadastrar cliente com dados, briefing e configuracoes iniciais. |
| `/edit-client/:clientId` | `src/pages/EditClient.tsx` | Editar cliente | Atualizar dados, status, notas e informacoes de operacao. |

### 2.8. Sistema e administracao

| Rota | Arquivo | Recurso | Exemplo de aplicacao |
| --- | --- | --- | --- |
| `/settings` | `src/pages/Settings.tsx` | Configuracoes | Ajustar perfil, seguranca, aparencia, notificacoes e sistema. |
| `/operadores` | `src/pages/settings/Operadores.tsx` | Operadores | Gerenciar membros e papeis operacionais. |
| `/admin/approvals` | `src/pages/admin/UserApprovals.tsx` | Aprovacoes | Aprovar usuarios pendentes de acesso. |
| `/deployment` | `src/pages/workspace/DeploymentChecklist.tsx` | Checklist de deploy | Validar passos antes de subir mudancas. |
| `/hosting` | `src/pages/HostingPanel.tsx` | Painel de hosting | Acompanhar subdominios, containers, auditoria, clientes e billing. |
| `/diagrama-sistemas` | `src/pages/SystemDiagram.tsx` | Mapa do sistema | Visualizar arquitetura, relacoes e dependencias. |
| `/estrutura-time` | `src/App.tsx` | Redirect legado | Redireciona para mapa do sistema. |
| `/team` | `src/App.tsx` | Redirect legado | Redireciona para mapa do sistema. |
| `/docs` | `src/pages/docs/index.tsx` | Documentacao interna | Ler guias, API reference e troubleshooting. |
| `/google-drive` | `src/pages/workspace/GoogleDriveEmbed.tsx` | Google Drive embed | Acessar documentos/pastas de Drive dentro do workspace. |

### 2.9. Paginas auxiliares e conteudo

| Rota | Arquivo | Recurso | Exemplo de aplicacao |
| --- | --- | --- | --- |
| `/pop-sla` | `src/pages/PopSla.tsx` | POP/SLA | Consultar padroes de atendimento e prazo. |
| `/dicas` | `src/pages/DicasPage.tsx` | Dicas | Ver orientacoes rapidas de operacao ou uso do sistema. |
| `/recursos` | `src/pages/RecursosPage.tsx` | Recursos | Acessar materiais, links e recursos de apoio. |
| `/recursos/:resourceId` | `src/pages/RecursosPage.tsx` | Recurso especifico | Abrir um recurso diretamente por ID. |

## 3. Pastas de paginas e componentes por dominio

| Pasta | Funcao | Exemplos de aplicacao |
| --- | --- | --- |
| `src/pages/ClientsCenter` | Implementacao modular da central de clientes | `ClientFilters` filtra carteira; `ClientDetail` abre contexto; hooks isolam selecao e listagem. |
| `src/pages/ContentPipeline` | Implementacao modular do pipeline de conteudo | `ContentBoard` mostra etapas; `ContentForm` cria item; `useContentPipeline` concentra logica. |
| `src/pages/EditClient` | Fluxo modular de edicao de cliente | `EditClientForm` altera dados; `EditClientPreview` mostra resumo; hook centraliza persistencia. |
| `src/pages/HostingPanel` | Painel modular de infraestrutura/hosting | Tabs de containers, subdominios, auditoria, clientes e billing. |
| `src/pages/NewClient` | Fluxo modular de cadastro de cliente | Formulario, preview e etapas para criar onboarding de cliente. |
| `src/pages/ada` | Area Ada | Pagina de analise/diagrama vinculada aos endpoints `api/ada`. |
| `src/pages/admin` | Administracao sensivel | Aprovacao de usuarios pendentes. |
| `src/pages/agents` | Hub de agentes | Dashboard, detalhe, editor ElizaOS, grafo, lista, stats, tabs e workflow n8n. |
| `src/pages/alexandria` | Nucleo Alexandria | Central, contexto, POPs, skills, bridges, OpenClaw e tutorial. |
| `src/pages/docs` | Documentacao navegavel | Browser de docs, chat de docs, conteudo Markdown e cliente Ollama. |
| `src/pages/iatools` | Ferramentas IA auxiliares | Cráudio Codete como superficie especializada. |
| `src/pages/settings` | Configuracoes e operadores | Tabs de perfil, seguranca, notificacoes, aparencia e sistema. |
| `src/pages/suna` | Integracao Suna | Interface dedicada ao agente Suna. |
| `src/pages/workspace` | Ferramentas de workspace | Google Drive, recorrencia de tarefas, checklist de deploy. |

## 4. Inventario de pastas do repositorio

### 4.1. Raiz e configuracao

| Pasta/arquivo | Funcao | Exemplo de uso |
| --- | --- | --- |
| `.claire` | Worktrees/artefatos do fluxo Claire | Referencia temporaria de desenvolvimento assistido. |
| `.claude` | Configuracoes de Claude/launch | Padronizar execucao local ou debugging assistido. |
| `.lovable` | Plano/artefatos Lovable | Rastrear contexto vindo de Lovable. |
| `.mex` | Memoria e roteamento de projeto | Guardar overview, design system e roteamento operacional. |
| `.vscode` | Sugestoes de extensoes/editor | Facilitar onboarding tecnico local. |
| `Dockerfile` | Build da Alexandria/Totum OS | Criar imagem com frontend buildado e backend Express. |
| `docker-compose.yml` | Publicacao local/VPS | Rodar container `alexandria-api` em `127.0.0.1:5000`. |
| `package.json` | Scripts e dependencias frontend | `npm run build`, `npm test`, `npx tsc --noEmit`. |
| `vite.config.ts` | Configuracao Vite | Build PWA, alias e plugins. |
| `tailwind.config.ts` | Design tokens Tailwind | Componentes UI e tema. |
| `tsconfig*.json` | Tipagem TypeScript | Validacao com `npx tsc --noEmit`. |
| `components.json` | Configuracao shadcn/ui | Base para componentes em `src/components/ui`. |
| `vercel.json` | Configuracao alternativa de deploy | Referencia caso a app va para Vercel. |

### 4.2. Produto, docs e conhecimento

| Pasta | Funcao | Exemplo de uso |
| --- | --- | --- |
| `docs` | Documentacao do produto, arquitetura e operacao | Este PDR, docs de design, hardening, skills e ops. |
| `docs/ops` | Documentos operacionais | Auditorias de VPS, deploy, backup e saude. |
| `Prompts` | Prompts operacionais | Reaproveitar prompts de revisao, agentes ou fluxos. |
| `Execução` | Planos e relatorios de execucao | Consultar etapas de implementacao e validacao. |
| `DNAS_39_AGENTES` | DNAs dos agentes base | Fonte textual para agentes como WANDA, SCRIVO, ANALYST. |
| `DNAS_AGENCY_AGENTS` | DNAs de agentes de agencia | Fonte textual para SEO, paid media, social e sales. |
| `Design System Apps` | Captura/referencia de design | Inspecionar assets e HTML do design original do Apps. |
| `exports` | Exportacoes para modelos e plataformas | Preparar pacotes para ChatGPT, Claude, Kimi e skills-sync. |
| `outputs` | Saidas geradas por scripts/servicos | Armazenar relatorios, transcricoes e resultados. |
| `public` | Assets publicos da web app | Manifest, favicon, robots e placeholder. |

### 4.3. Backend e integracoes

| Pasta | Funcao | Exemplo de uso |
| --- | --- | --- |
| `api` | Backend Express da aplicacao | Healthcheck, setup, agentes, transcricao, ingestao e webhooks. |
| `api/ada` | Endpoints Ada | `analyze.js` para analise e `health.js` para saude. |
| `api/routes` | Rotas separadas de API | Transcribe, ingest, webhooks e teste de agentes. |
| `api/services` | Servicos Node do backend | Logica de agentes, ingestao, transcricao e webhooks. |
| `api/suna` | Proxy/health Suna | Validar e encaminhar chamadas ao Suna. |
| `api/outputs` | Arquivos servidos pelo backend | Baixar relatorios e JSONs processados. |
| `supabase` | Configuracao, functions e migrations | Edge functions, migrations e config de projeto. |
| `supabase/functions` | Functions de Supabase | `alexandria-proxy`, `alexandria-mcp`, `agent-chat`, `skills-sync`. |
| `supabase/migrations` | Migracoes SQL | Criar tabelas de tarefas, POPs, agentes, artifacts e sync runs. |
| `migrations` | Migracoes/artefatos legados | Referencia de evolucao de schema fora do pacote Supabase. |
| `scripts` | Scripts utilitarios | Gerar sync de skills, relatorios e automacoes. |
| `tools/alexandria-claude-mcp` | MCP local da Alexandria | Expor Alexandria como servidor/tool para Claude. |
| `ops/nginx` | Operacao de Nginx | Referencia de proxy/reverse proxy. |

### 4.4. Frontend principal

| Pasta | Funcao | Exemplo de uso |
| --- | --- | --- |
| `src/pages` | Paginas roteadas | Cada arquivo/pasta representa uma tela ou modulo do app. |
| `src/components` | Componentes reutilizaveis | Layout, UI, cards, agentes, kanban, loading, tarefas. |
| `src/components/ui` | Design system base | Button, card, dialog, table, tabs, tooltip, sheet, form. |
| `src/components/layout` | Layout global | Sidebar desktop/mobile, navegacao e conteudo. |
| `src/components/alexandria` | Componentes da Alexandria | Cards de contexto, painel e filtros de skills. |
| `src/components/agents` | Componentes de agentes | Chat, metricas, grafo, config, exec log e skills. |
| `src/components/kanban` | Quadro kanban | Cards e colunas do quadro de tarefas. |
| `src/components/tasks` | Modal e detalhes de tarefa | Comentarios, subtarefas e task modal. |
| `src/components/dashboard` | Widgets e graficos | Visao geral de metricas. |
| `src/components/navigation` | Busca/navegacao | Command palette e breadcrumbs. |
| `src/components/loading` | Estados de carregamento | Skeletons e spinners. |
| `src/components/loaders` | Skeletons por tipo de componente | Placeholder para card, tabela e painel. |
| `src/components/offline` | Fallback offline | Tela quando app esta sem conexao. |
| `src/components/onboarding` | Onboarding modal | Guiar primeiro uso. |
| `src/components/pixel-office` | Canvas do escritorio | Renderizar ambiente visual/office. |
| `src/components/stark` | Status tecnico | Backup, database, servidor e sync. |
| `src/components/workspace` | Widgets de workspace | Notificacao Telegram. |

### 4.5. Logica frontend

| Pasta | Funcao | Exemplo de uso |
| --- | --- | --- |
| `src/config` | Configuracoes do app | Navegacao, OpenClaw e Suna. |
| `src/contexts` | Contextos React | Auth e Theme para a app inteira. |
| `src/hooks` | Hooks customizados | Agents, tasks, Alexandria, N8N, RAG, onboarding, loading. |
| `src/integrations` | Clientes de integracao | Supabase e Lovable. |
| `src/lib` | Utilitarios e registries | Analytics, feature flags, validation, directory picker, skills registry. |
| `src/lib/prompts` | Prompts internos | Copywriting, social planning, trend analysis, validation. |
| `src/services` | Servicos de dominio | Alexandria bridge, knowledge sync, n8n, Gemini, Ollama, Telegram. |
| `src/stores` | Stores Zustand | Sidebar e estado de UI. |
| `src/types` | Tipos TypeScript | Agents, Alexandria, env, operador, status, transcription. |
| `src/utils` | Utilitarios especificos | Otimizacao mobile. |
| `src/test` | Setup e mocks de teste | Mock de Supabase e setup global. |
| `src/api` | Cliente/API frontend se aplicavel | Espaco para chamadas compartilhadas. |
| `src/data` | Dados estaticos | Hierarquia de agentes e seeds locais. |
| `src/agents` | Agentes em formato executavel/documentado | `AGENT.md` e `character.json` por agente. |
| `src/skills` | Skills em formato `SKILL.md` | Catalogo de capacidades conectaveis a agentes. |

### 4.6. Apps e artefatos auxiliares

| Pasta | Funcao | Exemplo de uso |
| --- | --- | --- |
| `apps` | Apps auxiliares/copias de produto | `apps/atendente` pode servir como modulo especializado. |
| `code.grupototum.com` | Artefato/site auxiliar | Referencia de codigo ou frontend separado. |
| `deploy.sh`, `deploy-compose.sh`, `setup-vps.sh` | Scripts de deploy | Automatizar publicacao quando forem revisados. |
| `PRODUCTION_START.sh` | Script de inicializacao | Referencia de start em ambiente de producao. |
| `validate-db.js`, `validate.txt` | Validacao de banco | Conferir schema/dados antes de operacoes sensiveis. |

### 4.7. Pastas geradas ou nao-produto

| Pasta | Tratamento | Observacao |
| --- | --- | --- |
| `node_modules` | Gerado localmente | Nao deve ser documentado como produto nem versionado. |
| `api/node_modules` | Gerado localmente | Dependencias do backend Express. |
| `dist` | Gerado pelo build | Publicavel, mas nao e fonte de verdade. |
| `.git` | Controle de versao | Nao faz parte do escopo de produto. |

## 5. Catalogo resumido de recursos e exemplos

| Recurso | Onde vive | Exemplo de aplicacao |
| --- | --- | --- |
| Autenticacao | `src/contexts/AuthContext.tsx`, paginas auth, Supabase | Criar fluxo onde novos usuarios entram em pending approval ate admin liberar. |
| Menu lateral | `src/config/navigation.ts`, `src/components/layout` | Adicionar nova pagina em uma secao e refletir automaticamente na sidebar. |
| Command palette | `src/components/navigation/CommandPalette.tsx` | Abrir rapidamente `/alexandria/skills` pelo teclado. |
| Dashboard | `src/pages/Dashboard.tsx`, `src/components/dashboard` | Mostrar total de tarefas, agentes ativos e alertas operacionais. |
| Agentes | `src/pages/agents`, `src/components/agents`, `src/agents` | Criar agente "Analista de Cliente" com DNA e character JSON. |
| Command center | `src/pages/AICommandCenter.tsx` | Conversar com agente filtrado por query string. |
| Alexandria central | `src/pages/alexandria`, `src/components/alexandria` | Buscar POP, skill ou contexto de cliente antes de responder demanda. |
| Knowledge bridges | `src/services/alexandriaKnowledgeSync.ts`, `KnowledgeBridges.tsx` | Sincronizar artifacts com Supabase e validar duplicidade. |
| Skills | `src/skills`, `src/lib/skills-registry.json` | Listar skills de Gmail, Drive, Slack, PDF, n8n e WhatsApp. |
| POPs | `src/pages/alexandria/PopsPortal.tsx`, migrations POPs | Consultar procedimento de onboarding ou atendimento. |
| Hermione | `src/pages/HermioneChat.tsx`, `src/services/hermione.ts` | Assimilar documento e gerar resumo acionavel. |
| Tarefas | `src/pages/QuadroTarefas.tsx`, `src/components/tasks`, `src/hooks/useTasks.ts` | Criar tarefa com comentario, subtarefa e status kanban. |
| Conteudo | `src/pages/ContentPipeline` | Planejar roteiro, mover para revisao e aprovar publicacao. |
| Clientes | `src/pages/ClientsCenter`, `NewClient`, `EditClient` | Criar cliente, revisar detalhes e manter contexto de atendimento. |
| Recorrencia | `src/pages/workspace/TaskRecurrence.tsx` | Criar rotina semanal de relatorio de performance. |
| Google Drive | `src/pages/workspace/GoogleDriveEmbed.tsx`, callback | Abrir pasta de documentos do cliente dentro da Alexandria. |
| Hosting | `src/pages/HostingPanel` | Ver container, subdominio e auditoria de servicos. |
| Deploy checklist | `src/pages/workspace/DeploymentChecklist.tsx` | Conferir build, testes, healthcheck e rollback antes de publicar. |
| Settings | `src/pages/Settings.tsx`, `src/pages/settings/tabs` | Ajustar tema, perfil, notificacoes e seguranca. |
| Aprovacoes | `src/pages/admin/UserApprovals.tsx`, `usePendingApprovalsCount` | Admin aprova usuario recem-cadastrado. |
| Operadores | `src/pages/settings/Operadores.tsx` | Gerenciar papeis de quem acessa a operacao. |
| Diagramas | `src/pages/SystemDiagram.tsx`, `src/components/ada/MermaidDiagram.tsx` | Visualizar arquitetura ou fluxo de agentes. |
| Ada | `src/pages/ada`, `api/ada` | Pedir analise e renderizar diagrama Mermaid. |
| Suna | `src/pages/suna`, `src/config/suna.ts`, `api/suna` | Consultar status/proxy do agente Suna. |
| OpenClaw | `src/pages/alexandria/OpenClawDashboard.tsx`, `src/config/openclaw.ts` | Monitorar uso e automacoes do OpenClaw. |
| n8n | `src/services/n8n.ts`, `api/outputs/n8n-*.json` | Acionar workflow de captura Alexandria ou agentes. |
| Telegram | `src/services/telegramService.ts`, `src/lib/telegram` | Enviar notificacao de tarefa/deploy para canal. |
| Transcricao | `api/routes/transcribe.js`, `api/services/transcribeService.js` | Processar transcricoes e enviar para WANDA/SCRIVO. |
| Ingestao | `api/routes/ingest.js`, `api/services/ingestService.js` | Ingerir dados processados no Supabase. |
| Webhooks | `api/routes/webhooks.js`, `api/services/webhookService.js` | Chamar agente externo com payload da operacao. |
| Outputs | `api/outputs`, `/api/outputs` | Baixar JSONs e relatorios gerados. |
| Error boundary | `src/components/ErrorBoundary.tsx` | Isolar erro de pagina sem derrubar app inteiro. |
| Loading states | `src/components/loading`, `src/components/loaders` | Mostrar skeleton enquanto rota lazy carrega. |
| Offline fallback | `src/components/offline/OfflineFallback.tsx` | Orientar usuario quando rede cai. |
| Feature flags | `src/lib/featureFlags.ts` | Liberar modulo novo para grupo pequeno antes de todos. |
| Analytics | `src/lib/analytics.ts` | Rastrear abertura de agente ou conclusao de cadastro. |
| PWA | `vite.config.ts`, `public/manifest.json` | Permitir instalacao e cache basico do app. |

## 6. Priorizacao sugerida para revisao do que fica e sai

1. Manter primeiro: autenticacao, layout, dashboard, Alexandria, skills, POPs, agents, settings, healthcheck e deploy.
2. Revisar com cuidado: clientes, tarefas, content pipeline, hosting, Google Drive, Suna, OpenClaw, n8n e Telegram.
3. Candidatos a poda posterior: documentos historicos duplicados, relatorios antigos, artefatos de execucao, Design System Apps bruto, apps auxiliares que nao forem usados.
4. Nao apagar sem substituir: migrations Supabase, services Alexandria, hooks compartilhados, componentes UI, AuthContext, navigation config e Docker/Compose.

## 7. Checklist de validacao apos mudancas

- Rodar `npm run build`.
- Rodar `npx tsc --noEmit`.
- Rodar `VITE_SUPABASE_URL=... VITE_SUPABASE_PUBLISHABLE_KEY=... npm test`.
- Testar `/`, `/login`, `/dashboard`, `/alexandria`, `/agents`, `/tasks`, `/settings`.
- Testar `/health` e `/api/health` no ambiente publicado.
- Verificar console do navegador nas paginas principais.
- Antes de remover pasta, buscar referencias com `rg "nome-da-pasta|nome-do-recurso"`.
