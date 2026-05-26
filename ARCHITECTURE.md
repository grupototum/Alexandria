# Alexandria — Arquitetura Real

Status: documento canônico atualizado em 2026-05-23.
Objetivo: substituir a documentação divergente/aspiracional por uma visão fiel ao código atual.

## 1. O que a Alexandria é hoje

A Alexandria é uma infraestrutura de conhecimento em construção dentro do ecossistema Totum OS.

Na prática, o repositório atual contém:

1. Um app React/Vite/TypeScript com várias telas do Totum OS.
2. Uma seção Alexandria dentro do app.
3. Um backend Express mínimo em `api/`.
4. Supabase como banco, autenticação, edge functions e storage.
5. Um MCP local em `tools/alexandria-claude-mcp` para conectar agentes/Claude à Alexandria via edge function.
6. Pipelines de ingestão ainda fragmentados.

A Alexandria não está pronta como fonte única confiável ainda. Ela tem peças importantes funcionando, mas precisa de consolidação.

## 2. Stack atual

### Frontend

- React 18.
- Vite 5.
- TypeScript.
- Tailwind.
- shadcn/Radix UI.
- React Router.
- TanStack Query.
- Supabase JS.
- Gemini API para chat/embedding/classificação em alguns fluxos.

### Backend local

- Node.js.
- Express.
- Porta padrão: `3002`.
- Arquivo principal: `api/server.js`.

### Banco e serviços

- Supabase.
- PostgreSQL.
- Supabase Auth.
- Supabase Edge Functions.
- pgvector previsto/usado para busca vetorial.

### MCP

- Node puro, stdio.
- Caminho: `tools/alexandria-claude-mcp/server.mjs`.
- Não acessa o banco diretamente.
- Encaminha chamadas para a edge function `alexandria-mcp`.

## 3. Estrutura real do repositório

```txt
.
├── src/                         # App React/Vite
├── api/                         # Backend Express mínimo
├── supabase/                    # Config e edge functions
├── tools/alexandria-claude-mcp/ # MCP local para agentes/Claude
├── code.grupototum.com/         # Segundo app React sobreposto
├── Dockerfile                   # Build Docker do app principal
├── docker-compose.yml           # Compose para VPS/local
├── ecosystem.config.cjs         # PM2
├── nginx.conf                   # Exemplo Nginx
├── vercel.json                  # Deploy SPA em Vercel
└── docs/arquivos diversos
```

## 4. Frontend

O app principal é um SPA com rotas protegidas por autenticação.

Rotas relevantes:

- `/alexandria` — página principal da Alexandria.
- `/hermione` — chat da Hermione.
- `/alexandria/pops` — portal POPs.
- `/alexandria/context` — Context Hub.
- `/alexandria/skills` — Skills Central.
- `/alexandria/bridges` — conexões/importação sanitizada.
- `/alexandria/tutorial` — tutorial.

A página `/alexandria` funciona como hub visual. Parte das áreas ainda são atalhos/portais e não necessariamente pipelines completos.

## 5. Backend Express

Arquivo principal: `api/server.js`.

Endpoints existentes:

- `GET /health`
- `GET /api/health`
- CRUD básico de agentes em `/api/agents`
- `POST /api/transcribe`
- `POST /api/ingest`
- `POST /api/webhook/:agent`
- `GET /api/test-agents`
- `GET /api/outputs`
- `GET /api/outputs/:file`
- Endpoints admin:
  - `POST /api/admin/confirm-user`
  - `POST /api/admin/confirm-email`
  - `POST /api/admin/reset-password`

## 6. Alerta de segurança do backend

Os endpoints admin precisam ser protegidos ou removidos antes de exposição pública.

Eles executam ações sensíveis de autenticação, confirmação de e-mail e reset de senha. Se o backend estiver exposto, isso é risco crítico.

Regra canônica:

> Endpoint admin sem autenticação forte não pode ficar exposto em produção.

## 7. Supabase e conhecimento

Hoje existem múltiplas bases/caminhos de conhecimento no código:

### `giles_knowledge`

Usada por:

- `src/services/hermione.ts`
- `src/services/alexandriaIngestion.ts`

Pontos fortes:

- Tem caminho de ingestão com chunking.
- Tem geração de embeddings Gemini `text-embedding-004` quando configurado.
- Tem RPC semântico previsto via `match_knowledge`.

Ponto fraco:

- Não é a base consultada pelo MCP local dos agentes.

### `hermione_artifacts` e tabelas relacionadas

Usadas por:

- `src/services/hermioneArtifacts.ts`
- `supabase/functions/alexandria-proxy`
- `supabase/functions/alexandria-mcp`
- MCP local.

Pontos fortes:

- Modelo mais adequado para governança: fontes, artefatos, versões, status, relações e consultas.
- Bom para Hermione controlar revisão, publicação e versionamento.

Ponto fraco:

- A busca atual nas edge functions usa `ilike`, não busca vetorial semântica.

### `rag_documents`

Usada por:

- `ingest-supabase.mjs`
- dashboard Alexandria via `useAlexandria`.

Ponto fraco:

- Script antigo usa embedding mock 1536D.
- Não deve ser o schema canônico da Alexandria.

## 8. MCP Alexandria

O MCP local expõe três ferramentas:

- `alexandria_search`
- `alexandria_get_artifact`
- `alexandria_context_pack`

Fluxo atual:

```txt
Agente/Claude
  -> MCP local `alexandria-claude-mcp`
  -> Edge Function `alexandria-mcp`
  -> Tabela `hermione_artifacts`
  -> Busca textual por `ilike`
```

Esse caminho é arquiteturalmente correto, mas precisa consultar a base canônica com busca semântica real.

## 9. Deploy atual

Há estratégias sobrepostas:

1. Dockerfile.
2. docker-compose.yml.
3. PM2 via `ecosystem.config.cjs`.
4. Nginx.
5. Vercel.

Isso gera divergência.

Arquitetura recomendada para produção VPS:

```txt
Nginx
  -> container Alexandria App/API
  -> Supabase Edge Functions
  -> Supabase Postgres + pgvector
```

Vercel pode ser usado apenas para preview/frontend, não como fonte principal de produção enquanto o backend Express existir junto.

## 10. Arquitetura canônica recomendada

A Alexandria deve ser organizada assim:

```txt
Pepper
  -> decide o que é estado operacional vs conhecimento institucional
  -> consulta Alexandria via MCP/context pack quando precisa de conhecimento durável

Hermione
  -> governa Alexandria
  -> classifica, revisa, versiona e publica conhecimento

Alexandria MCP
  -> porta oficial de consulta para agentes
  -> entrega context packs por tarefa/agente/domínio

Supabase
  -> armazena conhecimento canônico
  -> busca vetorial com pgvector
  -> logs de consulta e escrita
```

## 11. Schema canônico recomendado

O modelo canônico deve ser `hermione_*`, porque ele já representa melhor governança de conhecimento:

- `hermione_sources`
- `hermione_artifacts`
- `hermione_artifact_versions`
- `hermione_artifact_sources`
- `hermione_consultations`

Mas ele precisa receber:

- embeddings 768D em artefatos/fontes;
- busca vetorial real;
- status de governança;
- logs de escrita;
- migração do conteúdo útil hoje em `giles_knowledge`.

## 12. Regra de separação Pepper vs Alexandria

Pepper guarda estado operacional.
Alexandria guarda conhecimento institucional.

Vai para Pepper:

- tarefa em andamento;
- decisão pendente;
- preferência imediata do Rael;
- status do dia;
- fila de execução.

Vai para Alexandria:

- POP;
- SLA;
- skill;
- DNA/Soul de agente;
- contexto institucional;
- brief de cliente;
- decisão durável;
- framework;
- playbook;
- documentação técnica;
- aprendizado validado.

## 13. Maturidade real

Funcional hoje:

- App React/Vite.
- Login Supabase.
- Páginas principais da Alexandria.
- HermioneChat com consulta a `giles_knowledge`.
- Ingestão de markdown para `giles_knowledge`.
- MCP local funcional como ponte.
- Edge functions `alexandria-mcp` e `alexandria-proxy`.
- Captura server-side via `alexandria-proxy/capture`.

Incompleto ou divergente:

- Busca semântica não é o caminho padrão do MCP.
- Múltiplas bases de conhecimento coexistem.
- Deploy documentado diverge do código.
- Documentos antigos citam elizaOS/57 agentes sem evidência no runtime atual.
- Endpoints admin precisam hardening.
- Chaves públicas estão hardcoded no Dockerfile/Compose.

## 14. Próxima arquitetura alvo

Objetivo:

> Alexandria vira a memória institucional durável da Totum e a camada de expansão cognitiva da Pepper.

Critério de pronto:

1. Uma base canônica de conhecimento.
2. Todo conhecimento publicado tem embedding.
3. MCP consulta por busca semântica.
4. Hermione governa revisão/publicação.
5. Pepper usa context packs da Alexandria antes de tarefas estratégicas.
6. Agentes recebem contexto escopado por função.
7. Segurança mínima aplicada: RLS, secrets fora do repo, endpoints admin protegidos.

## 15. Alexandria como plugin universal

A Alexandria também deve operar como plugin universal de contexto, acessível por qualquer IA ou terminal.

Interfaces oficiais:

- MCP local para Claude Desktop/agentes compatíveis.
- HTTP API via Supabase Edge Function `alexandria-mcp`.
- CLI em `tools/alexandria-cli`.
- Futuramente SDK JS/TS e Python.

Fluxo:

```txt
IA / terminal / app / central de agentes
  -> Alexandria Plugin API
  -> context pack
  -> fontes governadas pela Hermione
  -> execução por Pepper/agente
```

Documento canônico: `ALEXANDRIA_UNIVERSAL_PLUGIN.md`.

## 16. Assimilação bidirecional de memórias

A Alexandria não deve apenas entregar memórias/contexto para IAs conectadas.

Ela também deve receber memórias dessas IAs, organizar, deduplicar, detectar obsolescência, marcar conflitos e submeter à curadoria da Hermione.

Fluxo alvo:

```txt
IA conectada
  -> consome context pack da Alexandria
  -> executa tarefa
  -> exporta memórias/aprendizados/lacunas
  -> Alexandria sanitiza e classifica
  -> dedupe + obsolescência + conflito
  -> Hermione revisa
  -> approved/rejected/superseded/deprecated/conflict
```

Regra central:

> Memória importada é matéria-prima. Conhecimento aprovado é produto final.

Documento canônico: `ALEXANDRIA_MEMORY_ASSIMILATION_PROTOCOL.md`.
