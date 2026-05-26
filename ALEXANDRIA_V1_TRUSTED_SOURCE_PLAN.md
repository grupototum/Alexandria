# Alexandria V1 — Plano para virar Fonte Confiável

Status: plano técnico-operacional V1.
Criado em: 2026-05-23.
Dono técnico: Jarvis/Paulo.
Dona de conhecimento: Hermione.
Operadora: Pepper.
Aprovação: Rael.

## Objetivo

Transformar a Alexandria de um conjunto fragmentado de telas, tabelas e pipelines em uma fonte confiável de conhecimento para Pepper e agentes.

## Diagnóstico resumido

Hoje existem três caminhos principais:

1. `giles_knowledge`: melhor base para busca semântica e ingestão com embeddings.
2. `hermione_*`: melhor modelo de governança, versão, status e curadoria.
3. `rag_documents`: legado/apoio, com risco de embedding mock/inconsistente.

O MCP oficial dos agentes consulta `hermione_artifacts`, mas a melhor busca semântica está em `giles_knowledge`.

## Decisão recomendada

Usar `hermione_*` como schema canônico de governança e incorporar nele a capacidade semântica.

Motivo:

- Alexandria precisa de governança, não só busca.
- Hermione precisa controlar fonte, status e versão.
- Agentes precisam consumir artefatos aprovados, não chunks soltos.

## Etapa 1 — Segurança mínima

Prioridade crítica antes de exposição pública.

### 1.1 Proteger endpoints admin

Arquivos afetados:

- `api/server.js`
- `api/confirm-user.mjs`
- `api/confirm-email.mjs`
- `api/reset-password-direct.mjs`

Ação:

- [feito localmente em 2026-05-23] Exigir token admin server-side via env `ADMIN_API_TOKEN`.
- [feito localmente em 2026-05-23] Proteger também `/api/setup`.
- Ou remover endpoints se não forem necessários.

Critério de pronto:

- Nenhum endpoint `/api/admin/*` responde sem autenticação.
- Se `ADMIN_API_TOKEN` não estiver configurado, endpoints admin retornam `503` e ficam desativados.

### 1.2 Remover hardcodes sensíveis

Arquivos afetados:

- `Dockerfile`
- `docker-compose.yml`
- `.env.example`

Ação:

- [feito localmente em 2026-05-23] Trocar chaves hardcoded por variáveis.
- [feito localmente em 2026-05-23] Usar `.env` não versionado ou secret manager.
- [feito localmente em 2026-05-23] `.env.example` documenta nomes sem segredos reais.

Critério de pronto:

- Nenhuma key real no repo.

### 1.3 Rotacionar credenciais expostas

Ação:

- Rotacionar Supabase access token.
- Trocar senha Postgres se aplicável.
- Revisar service role.

Critério de pronto:

- Credenciais coladas em chat não funcionam mais.

## Etapa 2 — Schema canônico

### 2.1 Declarar `hermione_*` como canônico

Tabelas base:

- `hermione_sources`
- `hermione_artifacts`
- `hermione_artifact_versions`
- `hermione_artifact_sources`
- `hermione_consultations`

### 2.2 Adicionar semântica ao canônico

Necessário confirmar no banco:

- campos `embedding vector(768)` em sources/artifacts ou tabela separada;
- índice HNSW/IVFFLAT;
- função RPC de busca vetorial.

Recomendação:

- embeddings por artefato para context pack;
- opcionalmente embeddings por chunk para precisão.

## Etapa 3 — Migração/espelhamento do conhecimento

### Fonte principal atual

`giles_knowledge` contém chunks com domínio, categoria, tags, fonte e embedding.

### Alvo

Criar artefatos `hermione_artifacts` ou chunks vinculados a artefatos.

Estratégia segura:

1. Não apagar `giles_knowledge`.
2. [feito localmente em 2026-05-23] Criar script de migração idempotente/dry-run.
3. Migrar por `source_file`/domínio.
4. Gerar artefatos com status `review`.
5. Hermione promove para `approved`.

Implementação local:

- `scripts/migrate-giles-to-hermione.mjs`
- `tools/migrations/README.md`
- scripts npm `migrate:giles:dry-run` e `migrate:giles:apply`

Critério de pronto:

- Todo conhecimento útil de `giles_knowledge` aparece no fluxo `hermione_*`.

## Etapa 4 — Backfill de embeddings

Ação:

- Gerar embeddings 768D com Gemini `text-embedding-004`.
- Aplicar a artefatos/fontes sem embedding.
- Registrar falhas.

Critério de pronto:

- 100% dos artefatos `approved` têm embedding.

## Etapa 5 — MCP com busca semântica

Arquivos afetados:

- `supabase/functions/alexandria-mcp/index.ts`
- `supabase/functions/alexandria-proxy/index.ts`

Hoje:

- [feito em 2026-05-25] busca textual híbrida em `hermione_artifacts`, com normalização, tokens úteis, frase inteira, ranking local por título/tags/resumo/conteúdo, status e recência.
- Embeddings continuam fora da V1 e ficam como V1.5.

Alvo V1.5:

1. gerar embedding da query;
2. chamar RPC vetorial;
3. filtrar status `approved` por padrão;
4. permitir incluir `review` com flag;
5. fallback textual se embedding falhar.

Critério de pronto:

- `alexandria_context_pack` retorna resultados semanticamente relevantes, não só por palavra literal.

## Etapa 6 — Governança Hermione

Implementar processo:

```txt
capture/import
  -> draft/review
  -> embedding
  -> classificação
  -> Hermione revisa
  -> approved/superseded/deprecated/blocked
```

Critério de pronto:

- Nenhum agente consome fonte `review` sem ela estar marcada como não oficial.

## Etapa 7 — Integração Pepper

Criar ritual operacional:

1. Pepper recebe tarefa.
2. Pepper define domínio.
3. Pepper pede context pack Alexandria.
4. Pepper executa/delega com base nele.
5. Lacunas viram tarefa para Hermione.

Critério de pronto:

- Pepper consegue usar Alexandria como memória institucional expandida.

## Etapa 8 — Assimilação de memórias de IAs conectadas

Objetivo:

A Alexandria deve receber memórias de IAs conectadas, não apenas fornecer contexto para elas.

Fluxo:

```txt
IA externa/agente
  -> exporta memórias
  -> Alexandria normaliza
  -> sanitiza
  -> deduplica
  -> detecta obsolescência
  -> marca conflitos
  -> gera candidatos em review
  -> Hermione aprova/rejeita/consolida
```

Implementação V1:

- Criar formato `alexandria_memory_bundle_v1`.
- Criar action futura `assimilate_memory` na API/MCP.
- Toda memória importada entra como `review`.
- Dedupe exato por `content_hash`.
- Conflitos altos bloqueiam publicação.

Documento canônico:

- `ALEXANDRIA_MEMORY_ASSIMILATION_PROTOCOL.md`

Critério de pronto:

- Uma IA externa consegue enviar um bundle de memórias.
- Alexandria cria fontes candidatas sem duplicar conteúdo idêntico.
- Hermione consegue revisar e promover para `approved`.

## Ordem recomendada de execução

1. Documentação canônica.
2. Hardening admin/secrets.
3. Schema canônico `hermione_*`.
4. Backfill embeddings.
5. MCP semântico.
6. Context pack da Pepper.
7. Rotina diária Roboto/Hermione.

## O que NÃO fazer agora

- Não apagar `giles_knowledge`.
- Não migrar tudo sem backup.
- Não declarar Alexandria pronta antes do MCP semântico.
- Não deixar agentes escreverem direto como oficial.
- Não misturar segredo com conhecimento.

## Primeiro teste de aceite

Pergunta:

> Como a Totum deve estruturar um POP/SLA para um agente SDR?

Resultado esperado:

- Alexandria retorna context pack com POPs, agentes, processo comercial e regras de governança.
- Cada trecho tem fonte/artefato.
- Resposta diferencia oficial, review e lacuna.

## Segundo teste de aceite

Pergunta:

> Qual é o DNA/Soul da Hermione e como ela governa Alexandria?

Resultado esperado:

- Alexandria retorna a ficha da Hermione.
- Retorna a taxonomia.
- Retorna regras de fonte confiável.
- Não mistura com memória operacional da Pepper.

## Definição final

Alexandria V1 estará pronta quando Pepper puder dizer:

> Antes de responder, consultei a Alexandria, usei fontes aprovadas e encontrei estas lacunas.
