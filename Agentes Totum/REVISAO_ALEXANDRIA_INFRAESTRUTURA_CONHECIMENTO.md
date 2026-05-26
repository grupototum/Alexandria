# REVISÃO DA ALEXANDRIA — INFRAESTRUTURA CENTRAL DE CONHECIMENTO

**Revisão técnica do repositório `grupototum/Alexandria` + Supabase `cgpkfhrqprqptvehatad`**
**Data:** 2026-05-23 · **Revisor:** Claude (papel: "RH dos agentes digitais" + arquiteto de governança)
**Modo:** somente leitura — nenhum arquivo de código ou registro de banco foi modificado
**Base:** repositório local clonado + inspeção read-only do Supabase via conector MCP

---

## 0. CORREÇÃO DA FASE 2 (importante)

A Fase 2 concluiu que "a Alexandria não existe como infraestrutura". **Isso estava errado** — foi baseado só nos documentos de agentes do `Totum OS`, sem acesso ao repositório real. Confirmado agora:

**A Alexandria existe e está parcialmente funcional.** Há um repositório de código real, um banco Supabase ativo com **657 registros de conhecimento já vetorizados**, 2 edge functions no ar e um MCP próprio. O problema não é ausência — é **fragmentação**: a infraestrutura existe em pedaços que não se conectam.

---

## 1. RESUMO EXECUTIVO

A Alexandria, hoje, é uma boa fundação **mal cabeada**. As peças certas existem: pgvector instalado, conhecimento ingerido e vetorizado, pipeline de captura validado, um MCP para os agentes consultarem. Mas elas foram construídas em momentos diferentes, por ferramentas diferentes (Lovable, scripts soltos, edge functions), e **nunca foram unificadas**.

O achado central — e o mais importante de toda esta revisão:

> **A melhor base de conhecimento que vocês têm (`giles_knowledge`: 657 registros, 100% vetorizados, com índice) é exatamente a que o MCP dos agentes NÃO consulta. E a base que o MCP consulta (`hermione_artifacts`: 28 registros) tem ZERO embeddings.** A ingestão de conhecimento e a consulta de conhecimento escrevem e leem tabelas diferentes. Hoje, na prática, um agente que "pergunta para a Alexandria" faz busca por palavra literal num conjunto de 28 itens — enquanto 657 itens vetorizados ficam invisíveis.

Resolver isso é 80% do trabalho de transformar a Alexandria em fonte confiável. Não é reconstruir — é **consolidar e religar**.

---

## 2. REVISÃO DO CÓDIGO E DA ARQUITETURA (GitHub `grupototum/Alexandria`)

O repositório está clonado em `/Pixel Systems/Alexandria` e é, de fato, o repo `grupototum/Alexandria` (`git remote` confirma).

### 2.1 Natureza do repositório
Não é "o projeto Alexandria" — é um **mono-repo acumulado** com 4 `package.json` e projetos sobrepostos:

| Subprojeto | O que é |
|---|---|
| Raiz (`alexandria-totum-os`) | App React 18 + Vite 5 + TypeScript + Tailwind + shadcn. É o frontend do **Totum OS inteiro** (~30 telas). |
| `api/` (`totum-api`) | Backend Express mínimo (pipeline de transcrição de vídeo legado). |
| `code.grupototum.com/` | **Um segundo app React quase duplicado** — outro produto que foi parar dentro deste repo. |
| `tools/alexandria-claude-mcp/` | Servidor MCP em Node puro — a ponte de consulta para agentes/Claude. |

### 2.2 Frontend
React/Vite SPA com PWA, auth Supabase, ~30 telas do Totum OS. A **Alexandria é uma sub-seção** (`src/pages/alexandria/`) com 6 abas (Biblioteca, POPs & SLAs, Context Hub, Skills Central, Conexões, Exportar) — várias ainda são **placeholders** que só redirecionam. A interface de consulta de conhecimento é o "HermioneChat".

### 2.3 Backend / API
Dois backends sobrepostos e inconsistentes: `api/server.js` (Express porta 3002) com CRUD de agentes e — risco grave — endpoints `/api/admin/confirm-user`, `/confirm-email`, `/reset-password` **sem nenhuma autenticação**. O `API_REFERENCE.md` documenta uma API de agentes que **não existe** no código. O caminho real de backend são as **edge functions do Supabase**.

### 2.4 Deploy / containers
Três estratégias coexistindo sem fonte única de verdade: **Docker Compose** (`docker-compose.yml`, VPS Hostinger), **PM2 + Nginx** (`ecosystem.config.cjs`, `nginx.conf`) e **Vercel** (`vercel.json`). Documentos divergem em URL, IP e porta. A `anon key` do Supabase está **hardcoded em texto puro** no `Dockerfile` e no `docker-compose.yml`.

### 2.5 Dependências
Supabase (banco/auth/edge/vector), Google Gemini API (embeddings `text-embedding-004` e classificação), plataforma Lovable, VPS Hostinger. Ollama/AnythingLLM citados como auto-hospedados.

### 2.6 Fluxo de ingestão e consulta — **o problema central**
Existem **três pipelines de ingestão desconectados**:

| Pipeline | Como funciona | Escreve em | Embedding |
|---|---|---|---|
| `ingest-supabase.mjs` (script) | Lê transcrições de vídeo | `rag_documents` | ❌ MOCK (`Math.sin`) — não-semântico |
| `alexandriaIngestion.ts` (no app) | Chunking por header `##` + classificação Gemini + embedding real 768-dim | `giles_knowledge` | ✅ real |
| `alexandria-proxy/capture` (edge, via n8n) | Recebe markdown, dedup por hash, versiona | `hermione_*` | ❌ não gera embedding |

E a **consulta** (MCP `alexandria-mcp` / `alexandria-proxy`) lê **só `hermione_artifacts`, por busca textual `ilike`** — não usa embeddings nem as funções vetoriais. Resultado: os 3 pipelines escrevem em 3 tabelas que não se falam, e a consulta lê a tabela errada do jeito errado.

### 2.7 MCP próprio
`tools/alexandria-claude-mcp/server.mjs` é um MCP local (stdio, Node puro) que expõe `alexandria_search`, `alexandria_get_artifact`, `alexandria_context_pack`. Ele não acessa o banco — encaminha por HTTP para a edge function `alexandria-mcp`, autenticando com um token compartilhado. **É funcional e é o mecanismo correto** para Pepper/agentes consultarem a Alexandria — mas hoje serve busca textual sobre 28 itens.

### 2.8 Documentação
Divide-se em dois grupos: **fabricada** (`ARCHITECTURE.md`, `OPERATIONS.md`, `API_REFERENCE.md` descrevem um sistema "elizaOS" de 57 agentes que **não existe** no código — "Production Ready ✅" sem lastro) e **real** (`CHANGELOG.md`, `BUGS.md`, `TODO.md` mostram trabalho concreto e datado, e são confiáveis). Quem ler só os primeiros forma uma visão irreal do projeto.

---

## 3. SUPABASE — projeto `cgpkfhrqprqptvehatad` ("Totum OS")

Inspeção read-only. Postgres 17, região us-east-2, **pgvector 0.8.0 instalado**. 69 tabelas no schema `public`.

### 3.1 As quatro bases de conhecimento (o problema, em números)

| Tabela | Registros | Dimensão | Com embedding | Índice vetorial | Quem escreve | Quem lê |
|---|---|---|---|---|---|---|
| `giles_knowledge` | **657** | 768 | **657 (100%)** | ✅ sim | `alexandriaIngestion.ts` | `hermione.ts` (ilike) |
| `hermione_sources` | 92 | 768 | **0** | — | `alexandria-proxy/capture` | — |
| `hermione_artifacts` | 28 | 768 | **0** | — | `alexandria-proxy/capture` | **MCP dos agentes** (ilike) |
| `rag_documents` | 20 | 1536 | **0** | ✅ sim (vazio) | `ingest-supabase.mjs` | `embeddingService` |
| `alexandria_documents` | 3 | 768 | 3 (100%) | ✅ sim | ? | ? |

**Leitura:** só `giles_knowledge` tem conhecimento vetorizado de verdade (657/657). A base que o MCP dos agentes consulta (`hermione_artifacts`) tem 0 embeddings. Há mistura de dimensões (768 vs 1536). São, na prática, **4 "Alexandrias" paralelas**.

### 3.2 Funções de busca
Existem `match_documents`, `match_knowledge`, `giles_search_by_domain`, `giles_get_tree`, `search_docs/pops/skills` — ou seja, a maquinaria de busca vetorial **existe**. Mas `generate_embedding()` no Postgres é um stub que retorna `NULL`, e as edge functions de consulta não chamam essas funções — caem em `ilike`.

### 3.3 Edge functions (ativas)
- `alexandria-mcp` (v4, **`verify_jwt=false`** — pública) — backend do MCP dos agentes.
- `alexandria-proxy` (v10, **`verify_jwt=false`** — pública) — captura via n8n + busca para o plugin LobeHub. Versão 10 = é a peça mais ativamente iterada.
- `send-invite` (v11, `verify_jwt=true`).

### 3.4 Storage
Buckets: `avatars` (público), `client_files` (privado), `content-thumbnails` (público), `files` (privado). **Nenhum bucket dedicado a conhecimento** — o conhecimento da Alexandria vive como texto em tabelas, não como arquivos em storage. (Correto para RAG; só registrando.)

### 3.5 Segurança e RLS — riscos verificados
Inspecionei RLS e policies diretamente. Achados:

- **`user_roles` está com RLS DESLIGADO.** É a tabela que define quem é admin/master. Tem policies escritas, mas com RLS off elas ficam dormentes — a tabela fica exposta conforme os grants padrão. **Risco crítico.**
- `alexandria_documents` e `alexandria_sync_log` também com RLS off.
- Muitas policies abertas: `projetos` e `tarefas` têm policy "Allow all" `ALL` para `public`; `google_drive_tokens` tem policy `ALL` para `public` (**tokens de OAuth acessíveis amplamente**); `operadores`, `telegram_notifications` idem; `rag_documents` tem leitura pública.
- `anon key` hardcoded no `Dockerfile`/`docker-compose.yml` do repo.
- Endpoints `/api/admin/*` do Express sem autenticação.
- O Security Advisor do Supabase retornou uma lista extensa de avisos (volume alto) — os itens acima são os que confirmei diretamente e que devem ser tratados primeiro.

---

## 4. FUSÃO PEPPER + ALEXANDRIA

Respondendo às 5 perguntas, com base no que a infraestrutura **já permite** (não no que seria ideal do zero).

### 4.1 Como você (via Pepper) consultaria a Alexandria
O caminho já existe: **MCP `alexandria-claude-mcp` → edge function `alexandria-mcp` → banco**. Pepper (rodando no OpenClaw) e você (Claude Desktop) consultam pelas 3 ferramentas: `alexandria_search` (busca), `alexandria_get_artifact` (puxa um documento), `alexandria_context_pack` (monta um pacote de contexto em markdown para injetar num prompt).

O que falta para isso ser confiável: a consulta precisa (a) ler a base unificada, não só `hermione_artifacts`; (b) usar busca **semântica** (vetor), não `ilike`. Hoje você pergunta "como fazer briefing de cliente de odontologia" e só acha se essas palavras literais estiverem no texto.

### 4.2 Como a Hermione governaria a Alexandria
Hermione (N2, CDO) é a **dona** — não quem digita, quem **decide o que entra e como**. Governança concreta:
- **Fila de revisão:** toda captura (via n8n) entra com status `review`; Hermione (ou regra automática que ela define) promove para `published`. A estrutura `hermione_artifacts` + `hermione_artifact_versions` já suporta isso.
- **Fronteira verde/amarelo/vermelho** (da `PERMISSION_POLICY`): verde (POP, decisão, skill institucional) entra; amarelo (preferência/pessoal sanitizado) só com revisão; vermelho (segredo, finança, dado pessoal) **nunca**.
- **Taxonomia e versionamento:** Hermione mantém domínios/categorias; Zelador (N6) faz housekeeping (dedup, reindex, limpeza) — papéis que já estão nos SOULs.
- **Auditoria:** toda escrita registrada (`hermione_consultations` já loga consultas; falta um log de escrita).

### 4.3 Como os agentes consumiriam conhecimento
Cada agente, ao iniciar uma tarefa, pede um **context pack escopado ao seu domínio** (`corpus:<agente>` — o Princípio 3 já prevê corpus dedicado por chefe N2). Fluxo: agente → MCP `alexandria_context_pack(query, dominio)` → recebe os N trechos mais relevantes (por similaridade vetorial) → injeta no próprio prompt. **Leitura** é livre (dentro do domínio + permissão); **escrita** só pela fila de revisão da Hermione. Agentes N5/N6 só leem.

### 4.4 O que fica na sua memória operacional vs. o que vai para a Alexandria
Regra de corte clara:

| Vai para a **memória operacional** (Pepper/CLAUDE.md, efêmera) | Vai para a **Alexandria** (institucional, durável, compartilhada) |
|---|---|
| O que estou fazendo agora, tarefas em curso | POPs, SLAs, frameworks, checklists |
| Estado do dia, contexto de sessão | Decisões com consequência duradoura (tabela `decisoes` + Project Thread) |
| Preferência imediata do Rael numa conversa | Briefs de cliente, perfis, histórico de conta |
| Rascunho, hipótese não validada | Skills, corpus de treino dos agentes, aprendizados validados |

Três perguntas para decidir: **(1)** isso é verdade depois que a sessão acabar? **(2)** isso é útil para mais de um agente? **(3)** alguém vai precisar reencontrar isso daqui a 3 meses? Se sim para qualquer uma → Alexandria. Senão → memória operacional. E o princípio-guia já existe no catálogo: *"se não está na Alexandria, não aconteceu"* — vale para conhecimento institucional, não para estado operacional.

### 4.5 Como transformar a Alexandria na fonte confiável da agência
Não é reconstruir. É **consolidar, religar e blindar** — detalhado na seção 6.

---

## 5. DIAGNÓSTICO — o que funciona, o que não funciona

**Funciona hoje (fato):**
- App React/Vite do Totum OS com a Alexandria como seção; auth Supabase.
- Pipeline de captura `n8n → alexandria-proxy/capture → hermione_*` (dedup, versionamento) — validado ponta a ponta.
- 657 registros de conhecimento vetorizados de verdade em `giles_knowledge`, com índice.
- MCP `alexandria-claude-mcp` — código correto, é a porta de entrada dos agentes.
- pgvector e funções de busca vetorial instaladas.

**Não funciona / é ilusório (fato):**
- Busca semântica ponta a ponta — na prática é `ilike`.
- 4 bases de conhecimento desconectadas; ingestão e consulta em tabelas diferentes.
- `hermione_*` (o que os agentes leem) com 0 embeddings.
- `rag_documents` com embeddings mock/vazios.
- `ARCHITECTURE.md`/`OPERATIONS.md`/`API_REFERENCE.md` descrevem um sistema inexistente.
- Segurança: `user_roles` sem RLS, policies `public ALL`, chaves hardcoded, endpoints admin sem auth.

**Os 5 maiores gaps para a Alexandria virar fonte confiável:**
1. Quatro schemas de conhecimento desconectados (e duas dimensões de vetor).
2. Sem busca semântica real em produção — só `ilike`.
3. Embeddings inconsistentes — a base que os agentes leem não tem nenhum.
4. Segurança: RLS, policies abertas, segredos expostos.
5. Documentação fabricada — não há fonte única e honesta do que o sistema é.

---

## 6. PLANO DE AÇÃO RECOMENDADO

Sequência por dependência. Premissa: custo de API ≈ R$0 (usar Gemini free tier para embeddings, como o código já faz).

**Etapa 1 — Decidir o schema canônico único.**
Recomendo manter o **modelo `hermione_*`** como canônico (tem a estrutura certa: sources → artifacts → versions → relationships → consultations, com estado de revisão), e **migrar para ele os 657 registros de `giles_knowledge`** — ambos são 768-dim, então os embeddings são reutilizáveis. `rag_documents` (1536-dim, 20 linhas) e `alexandria_documents` (3 linhas) são pequenos: re-embeddar a 768 e fundir, ou descartar. Resultado: **uma base, uma dimensão (768), um modelo de dados**.

**Etapa 2 — Backfill de embeddings.**
Gerar embedding para os 120 registros `hermione_*` que estão sem (mesmo pipeline Gemini do `alexandriaIngestion.ts`). Ao fim: 100% da base canônica vetorizada.

**Etapa 3 — Ligar a busca semântica de verdade.**
Trocar o `ilike` das edge functions `alexandria-mcp` e `alexandria-proxy` por chamada a uma função `match_*` com pgvector. Gerar embedding também no momento da **captura** (`alexandria-proxy/capture`), para nada entrar sem vetor.

**Etapa 4 — Blindar a segurança.**
Ligar RLS em `user_roles`, `alexandria_documents`, `alexandria_sync_log`; revisar as policies `public ALL` (especialmente `google_drive_tokens`); mover `anon key` e tokens para secrets; proteger ou remover os endpoints `/api/admin/*`.

**Etapa 5 — Governança operacional.**
Formalizar a fila de revisão da Hermione (status `review` → `published`), a fronteira verde/amarelo/vermelho e um log de escrita. Definir o corte memória operacional × Alexandria (seção 4.4) num documento curto.

**Etapa 6 — Higiene do repositório.**
Arquivar os docs fabricados (`ARCHITECTURE`, `OPERATIONS`, `API_REFERENCE`); remover o app duplicado `code.grupototum.com/`; escrever um `ARCHITECTURE.md` real de uma página; mover o repo para fora da pasta com cloud-sync (está corrompendo operações git).

---

## 7. PRÓXIMOS PASSOS PRÁTICOS

1. **Decisão do Rael:** aprovar o schema canônico único (recomendação: modelo `hermione_*`).
2. Atribuir a execução: **Hermione + Roboto** (dev), com Jarvis na infra — é o trabalho da Onda 1 da Fase 2 (a Alexandria é pré-requisito de quase tudo).
3. Executar Etapas 1-3 (consolidação + embeddings + busca semântica) — é o que faz a Alexandria "funcionar" de fato.
4. Executar Etapa 4 (segurança) em paralelo — não depende das outras.
5. Validar com um teste real: um agente faz uma pergunta de negócio e a Alexandria devolve o trecho certo por similaridade, não por palavra literal.
6. Só então declarar a Alexandria "fonte confiável" e ligar os demais agentes a ela.

---

*Revisão somente-leitura. Não substitui os relatórios das Fases 1 e 2. Próxima revisão recomendada: após a Etapa 3 (busca semântica ligada).*
