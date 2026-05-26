# Alexandria GitHub Benchmark — Memory Systems, MCP, RAG e Knowledge Graph

Status: benchmark inicial V1.
Criado em: 2026-05-23.
Pedido por: Rael.
Pesquisa/benchmark: Juliana + Pepper.

## Objetivo

Mapear sistemas open source semelhantes à visão da Alexandria e comparar com nossa arquitetura:

- plugin universal de contexto;
- MCP/HTTP/CLI;
- RAG;
- knowledge graph;
- memória persistente para agentes;
- deduplicação;
- obsolescência;
- conflitos;
- assimilação de memórias;
- governança/trust layer.

## 1. Repositórios priorizados

### 1. mem0ai/mem0

URL: https://github.com/mem0ai/mem0

Camada universal de memória para agentes. Tem SDKs, CLI, self-hosted/cloud, multi-level memory, hybrid search, entity linking e temporal reasoning.

Relevância para Alexandria:

- referência direta para memory layer universal;
- bom benchmark de produto/SDK;
- menos forte em governança institucional explícita.

### 2. getzep/graphiti

URL: https://github.com/getzep/graphiti

Engine open source de temporal context graph. Forte em provenance, episódios, fatos temporais, invalidação/supersession e retrieval híbrido.

Relevância para Alexandria:

- melhor referência para V2 com knowledge graph temporal;
- útil para obsolescência, supersession e consulta “as of”.

### 3. doobidoo/mcp-memory-service

URL: https://github.com/doobidoo/mcp-memory-service

Serviço self-hosted com REST API, MCP, OAuth, CLI, dashboard, knowledge graph, SSE, consolidação autônoma e embeddings locais.

Relevância para Alexandria:

- muito próximo de uma “Alexandria server”;
- referência para MCP remoto, OAuth e dashboard.

### 4. ipiton/agent-memory-mcp

URL: https://github.com/ipiton/agent-memory-mcp

Memória para agentes de engenharia com RAG de repo/docs, HTTP/stdio, deduplicação, conflito, stale detection, drift scan, review inbox, trust-aware retrieval e temporal model.

Relevância para Alexandria:

- benchmark mais próximo da nossa visão de governança;
- copiar padrões de review inbox, drift scan e trust-aware retrieval.

### 5. vectorize-io/hindsight

URL: https://github.com/vectorize-io/hindsight

Sistema de memória com API/SDK/UI, retain/recall/reflect, world facts, experiences e mental models.

Relevância para Alexandria:

- forte em aprendizado/reflexão;
- menos alinhado com fonte institucional governada.

### 6. j33pguy/magi

URL: https://github.com/j33pguy/magi

Servidor universal multiagente com MCP/gRPC/REST/Web, memória git-backed, search híbrido, KG, métricas, health probes e visão distribuída.

Relevância para Alexandria:

- referência operacional e multi-protocolo;
- atenção à licença/estabilidade.

### 7. agentic-box/memora

URL: https://github.com/agentic-box/memora

MCP leve com SQLite/cloud sync, semantic search, knowledge graph, LLM dedup, documents como fragment trees, insights, stale detection, graph UI e action history.

Relevância para Alexandria:

- boa referência de UX e action history;
- útil para dedupe e stale detection.

### 8. skynetcmd/m3-memory

URL: https://github.com/skynetcmd/m3-memory

Local-first, MCP amplo, FTS5 + vector + MMR, chat logs, ingestão de diretórios, GDPR, embedder local soberano e lazy tool loading.

Relevância para Alexandria:

- excelente referência de privacidade/local-first;
- bom padrão para ferramentas carregadas sob demanda.

### 9. MemMachine/MemMachine

URL: https://github.com/MemMachine/MemMachine

Memória long-term para agentes com working/episodic/profile memory, REST, SDKs, MCP, Neo4j + SQL, integrações LangChain/LangGraph/CrewAI.

Relevância para Alexandria:

- bom modelo de tipos de memória;
- útil para separar working, episodic e profile memory.

### 10. gannonh/memento-mcp

URL: https://github.com/gannonh/memento-mcp

MCP de knowledge graph em Neo4j com version history, semantic search, temporal awareness, confidence decay e metadata rica.

Relevância para Alexandria:

- referência para version history e confidence decay.

### 11. 0xK3vin/MegaMemory

URL: https://github.com/0xK3vin/MegaMemory

Memória de projeto para coding agents, SQLite local, graph explorer, soft-delete history, conflitos/merge entre bancos e workflow understand → work → update.

Relevância para Alexandria:

- referência forte para conflitos como objetos resolvíveis;
- bom padrão de graph explorer.

### 12. ttommyth/rag-memory-mcp

URL: https://github.com/ttommyth/rag-memory-mcp

MCP RAG com SQLite/sqlite-vec, documents/chunks/embeddings, KG, hybrid search e term extraction.

Relevância para Alexandria:

- referência simples para V1 MCP local;
- menos governança.

### 13. knowall-ai/mcp-neo4j-agent-memory

URL: https://github.com/knowall-ai/mcp-neo4j-agent-memory

MCP sobre Neo4j para memória de agentes com entidades e relações.

Relevância para Alexandria:

- bom baseline de KG explícito;
- fraco em governança automática.

### 14. fastmcp-me/memory-plus

URL: https://github.com/fastmcp-me/memory-plus

MCP leve com RAG local, memória versionada, visualização e importação de arquivos.

Relevância para Alexandria:

- referência de UX mínima;
- menor robustez institucional.

### 15. memvid/memvid

URL: https://github.com/memvid/memvid

Memória portátil em arquivo único, com dados, embeddings, estrutura de busca e metadata empacotados.

Relevância para Alexandria:

- excelente inspiração para cápsulas/exportações portáveis;
- não substitui governança central.

## 2. Matriz comparativa resumida

Legenda:

- forte: recurso maduro ou central;
- parcial: presente, mas limitado;
- fraco: ausente ou secundário.

| Sistema | MCP | HTTP/API | CLI/UI | RAG | KG | Dedup | Temporal/obsoleto | Conflitos | Assimilação | Governança |
|---|---|---|---|---|---|---|---|---|---|---|
| Alexandria visão | forte | forte | forte | forte | forte | forte | forte | forte | forte | forte |
| mem0 | parcial | forte | forte | forte | parcial | parcial | forte | parcial | forte | parcial |
| Graphiti | forte | parcial | parcial | forte | forte | parcial | forte | forte | forte | forte |
| mcp-memory-service | forte | forte | forte | forte | forte | forte | forte | parcial | forte | forte |
| agent-memory-mcp | forte | forte | forte | forte | parcial | forte | forte | forte | forte | forte |
| Hindsight | parcial | forte | forte | forte | parcial | parcial | forte | parcial | forte | parcial |
| MAGI | forte | forte | forte | forte | forte | parcial | parcial | parcial | forte | forte |
| Memora | forte | forte | forte | forte | forte | forte | forte | parcial | forte | forte |
| M3 Memory | forte | parcial | forte | forte | forte | forte | forte | parcial | forte | forte |
| MemMachine | forte | forte | parcial | forte | forte | parcial | parcial | fraco | parcial | parcial |
| Memento MCP | forte | parcial | parcial | parcial | forte | parcial | forte | parcial | parcial | forte |
| MegaMemory | forte | parcial | forte | forte | forte | parcial | parcial | forte | parcial | parcial |
| rag-memory-mcp | forte | fraco | parcial | forte | forte | parcial | fraco | fraco | parcial | fraco |
| Neo4j Agent Memory | forte | fraco | parcial | parcial | forte | fraco | parcial | fraco | parcial | fraco |
| Memory-Plus | forte | fraco | parcial | forte | parcial | parcial | parcial | fraco | parcial | fraco |
| Memvid | parcial | parcial | forte | forte | fraco | parcial | forte | parcial | fraco | parcial |

## 3. Padrões que Alexandria deve copiar

### 3.1 Episódios/proveniência como fonte primária

Inspirado em Graphiti.

Tudo que for derivado precisa apontar para o input bruto/origem.

Modelo:

```txt
raw_episode -> extracted_fact -> canonical_artifact
```

### 3.2 Validade temporal

Adicionar desde cedo:

- `valid_from`;
- `valid_until`;
- `superseded_by`;
- consulta “as of”.

### 3.3 Assimilação em duas fases

Nunca transformar memória externa direto em verdade.

Fluxo:

```txt
raw memory -> review candidate -> canonical approved artifact
```

### 3.4 Review inbox

Inspirado em agent-memory-mcp.

Ações arriscadas viram fila de revisão da Hermione:

- conflito;
- merge;
- supersession;
- promoção para approved;
- remoção lógica.

### 3.5 Trust-aware retrieval

Ranking não pode ser só similaridade vetorial.

Critérios:

- confiança da fonte;
- frescor;
- autoridade;
- número de confirmações;
- penalidade por conflito;
- status do artefato;
- escopo/agente.

### 3.6 Hybrid retrieval real

Combinar:

- FTS/BM25;
- vector search;
- entidades/relações;
- recência;
- status/trust score.

### 3.7 Audit log/action history

Toda mudança importante precisa de trilha:

- quem criou;
- quem aprovou;
- por quê;
- fonte;
- versão anterior;
- versão nova.

### 3.8 Soft delete e version history

Nada crítico deve sumir.

Usar:

- `deprecated`;
- `superseded`;
- `blocked`;
- `rejected`;
- histórico de versões.

### 3.9 Tool surface lazy/gated

Não carregar 100 ferramentas no contexto MCP.

Começar com poucas tools:

- search;
- context_pack;
- get_artifact;
- assimilate_memory;
- review_queue.

### 3.10 Remote MCP + OAuth

Para funcionar em desktop, mobile, web e central de agentes, a Alexandria precisa suportar MCP remoto com autenticação forte.

V1 pode ser token.
V2 deve ser OAuth/scopes.

### 3.11 Local-first embeddings como opção

Para custo e privacidade:

- Gemini/OpenAI para produção rápida;
- embedding local como fallback/tenant privado.

### 3.12 Graph visual/debug console

Necessário para explicar memória:

- ver entidades;
- relações;
- fontes;
- conflitos;
- versões;
- decisões de Hermione.

### 3.13 Conflict groups

Conflitos devem ser objetos, não texto solto.

Exemplo:

```txt
conflict_group
  -> claims concorrentes
  -> fontes
  -> severidade
  -> status
  -> decisão final
```

### 3.14 Git-backed/exportável

Ter exports versionáveis:

- bundles JSON;
- markdown canônico;
- snapshots;
- cápsulas portáveis.

## 4. Lacunas identificadas no plano Alexandria

1. Definir modelo canônico completo:
   - raw episode;
   - extracted fact;
   - entity;
   - relation;
   - document fragment;
   - canonical assertion;
   - artifact.

2. Formalizar política de promoção:
   - quando uma memória vira `approved`;
   - quem pode aprovar;
   - o que exige Rael/Pepper/Hermione.

3. Separar pipelines:
   - ingestão;
   - assimilação;
   - recuperação;
   - revisão;
   - reindexação.

4. Criar modelo de conflito:
   - status;
   - severidade;
   - candidatos;
   - evidências;
   - decisão;
   - histórico.

5. Criar trust scoring explicável.

6. Adicionar consulta temporal “as of”.

7. Evitar knowledge graph obrigatório no V1.

8. Definir governança multiagente:
   - permissões por agente;
   - workspace;
   - cliente;
   - domínio;
   - tipo de escrita.

9. Incluir observabilidade:
   - filas;
   - lag de assimilação;
   - falhas de embedding;
   - queries sem resultado;
   - explain retrieval.

10. Planejar migrações de embedding/modelo.

## 5. Riscos técnicos

### 5.1 Autodedupe agressivo

Risco: mesclar memórias parecidas, mas diferentes.

Mitigação:

- dedupe exato automático apenas por hash;
- dedupe semântico entra como sugestão/review.

### 5.2 Knowledge graph cedo demais

Risco: atrasar V1 por modelagem excessiva.

Mitigação:

- V1 com artifacts/sources/chunks;
- V1.5 com entities/relations mínimas;
- V2 com temporal graph robusto.

### 5.3 Memória externa virar verdade

Risco: agente externo contaminar conhecimento oficial.

Mitigação:

- tudo entra como `review`;
- aprovação explícita da Hermione;
- fontes não oficiais marcadas no context pack.

### 5.4 Segredos assimilados

Risco: tokens, senhas e dados sensíveis entrarem no knowledge base.

Mitigação:

- sanitizer obrigatório;
- privacy zone green/yellow/red;
- conteúdo red bloqueado;
- audit log.

### 5.5 Retrieval sem explicação

Risco: agente usar contexto errado sem saber por quê.

Mitigação:

- context pack com fontes;
- trust score;
- status;
- updated_at;
- explain retrieval.

### 5.6 Obsolescência silenciosa

Risco: regra antiga continuar sendo usada.

Mitigação:

- `valid_until`;
- `superseded_by`;
- drift scans;
- revisão periódica Hermione.

### 5.7 Explosão de tools MCP

Risco: tool surface grande demais e confusa.

Mitigação:

- poucas tools universais;
- tools avançadas por domínio/scope;
- lazy loading.

### 5.8 Custo de embeddings

Risco: reindexação cara e lenta.

Mitigação:

- batch controlado;
- cache por content_hash;
- registrar embedding_model;
- reembed incremental.

## 6. Recomendação de arquitetura V1/V2

### V1, foco em entregar valor rápido

Prioridade:

1. `hermione_*` como governança canônica.
2. `alexandria-mcp` com context pack em Markdown/JSON.
3. HTTP API + CLI.
4. Busca híbrida simples: textual + vetorial.
5. `assimilate_memory` com:
   - raw source;
   - sanitizer;
   - hash dedupe;
   - status `review`;
   - fila Hermione.
6. Migration segura `giles_knowledge -> hermione_*`.
7. Audit log básico.

Não colocar KG complexo no V1.

### V1.5, inteligência operacional

Adicionar:

- dedupe semântico;
- conflict groups;
- stale detection;
- trust score;
- explain retrieval;
- review inbox;
- `valid_from` e `valid_until`;
- batch embedding/backfill.

### V2, Alexandria como cérebro institucional temporal

Adicionar:

- temporal knowledge graph;
- OAuth/scopes;
- MCP remoto oficial;
- SDK JS/TS;
- SDK Python;
- plugins/exportadores para Claude/Cursor/Codex/OpenClaw;
- dashboard de memória/conflitos;
- snapshots/export capsules;
- recall “as of date”.

## 7. Próximos PRs/tasks sugeridos

### PR 1 — Memory model V1

Criar migration/documentação para:

- `alexandria_raw_episodes`;
- `alexandria_extracted_facts`;
- `alexandria_conflict_groups`;
- `alexandria_audit_log`;
- colunas temporais em artifacts, se viável.

### PR 2 — `assimilate_memory`

Implementar action na edge/API:

- input `alexandria_memory_bundle_v1`;
- sanitizer;
- content_hash;
- create source;
- create artifact candidate `review`;
- resposta com dedupe/conflicts/privacyZone.

### PR 3 — Context pack trust-aware

Melhorar `context_pack`:

- status;
- trust score;
- source tier;
- freshness;
- conflicts;
- lacunas;
- explain retrieval.

### PR 4 — Busca híbrida

Adicionar:

- RPC vetorial;
- fallback textual;
- ranking combinado;
- filtro por domínio/agente/status.

### PR 5 — Review inbox Hermione

Criar tela/API para:

- revisar candidatos;
- aprovar;
- rejeitar;
- mesclar;
- marcar conflito;
- marcar obsoleto.

### PR 6 — Audit log e versionamento

Garantir rastreabilidade:

- toda promoção/rejeição/merge/supersession logada;
- histórico de decisões;
- versão anterior preservada.

### PR 7 — Benchmark profundo por clone local

Clonar os 5 principais:

1. mem0;
2. graphiti;
3. mcp-memory-service;
4. agent-memory-mcp;
5. memora.

Comparar schema, APIs e fluxos reais, não só README.

## 8. Decisão estratégica

Alexandria deve copiar a maturidade técnica dos melhores projetos, mas manter uma diferença central:

> Alexandria não é só memória pessoal de agente. É governança institucional de conhecimento para a Totum.

O foco não é apenas lembrar.

O foco é transformar memórias dispersas em conhecimento confiável, rastreável e utilizável por qualquer IA conectada.
