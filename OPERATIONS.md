# Alexandria — Operação Real

Status: documento canônico atualizado em 2026-05-23.
Objetivo: alinhar operação, deploy e governança com o código real.

## 1. Princípio operacional

A Alexandria é a infraestrutura central de conhecimento da agência Totum.

Ela deve guardar:

- conhecimento institucional;
- skills;
- contexto;
- POPs;
- SLAs;
- playbooks;
- briefs;
- decisões duráveis;
- DNA/Soul de agentes;
- documentação técnica;
- aprendizados validados.

Ela não deve substituir a memória operacional da Pepper. Ela expande a Pepper.

## 2. Papéis

### Rael

N0, decisor soberano.

Aprova:

- mudanças estruturais;
- fontes oficiais;
- políticas de segurança;
- deploys sensíveis;
- integração final com agentes.

### Pepper

CEO operacional.

Responsável por:

- definir prioridade operacional;
- decidir se algo vai para memória operacional ou Alexandria;
- orquestrar agentes;
- consumir context packs da Alexandria;
- validar entregas antes de devolver ao Rael.

### Hermione

Rainha de Alexandria.

Responsável por:

- taxonomia;
- curadoria;
- status de fonte;
- revisão e publicação;
- versionamento;
- confiabilidade;
- separação entre rascunho e fonte oficial.

### Jarvis/Paulo

Responsáveis por:

- arquitetura técnica;
- segurança;
- deploy;
- banco;
- edge functions;
- MCP;
- busca vetorial.

### Roboto

Responsável por:

- rotinas;
- checklists;
- logs;
- backfills controlados;
- relatórios operacionais.

## 3. Fonte de verdade

A fonte de verdade operacional deste repo passa a ser:

- `ARCHITECTURE.md` — arquitetura real.
- `OPERATIONS.md` — operação real.
- `README.md` — visão e quick start.
- `TODO.md` — backlog vivo.
- `BUGS.md` — riscos e bugs reais.
- `CHANGELOG.md` — histórico de mudanças verificáveis.

Documentos antigos que falam de elizaOS, 57 agentes e produção completa devem ser tratados como material legado/aspiracional se não tiverem evidência no código.

## 4. Deploy recomendado

Enquanto o app tiver frontend + Express no mesmo repo, o deploy principal recomendado é VPS com Docker Compose.

Fluxo alvo:

```txt
Nginx HTTPS
  -> 127.0.0.1:5000
  -> container alexandria-api:3002
  -> Supabase Edge Functions
  -> Supabase Postgres
```

## 5. Portas reais

- App dentro do container: `3002`.
- Porta local publicada pelo Compose: `127.0.0.1:5000`.
- Nginx deve apontar para a porta publicada efetiva.

Atenção: há arquivos antigos apontando para `3002` direto. Padronizar antes de deploy.

## 6. Comandos seguros de leitura

```bash
cd /root/.openclaw/workspace/Alexandria

# Ver branch e último commit
git status --short
git log --oneline -5

# Instalar dependências localmente, se necessário
npm ci
cd api && npm ci

# Build de validação
npm run build
```

## 7. Comandos de deploy, somente com aprovação

Não executar deploy automático sem validação.

Deploy Docker alvo:

```bash
cd /root/.openclaw/workspace/Alexandria
docker compose build
docker compose up -d
```

Após subir:

```bash
curl -f http://127.0.0.1:5000/api/health
```

## 8. Variáveis e segredos

Segredos não devem ficar em Dockerfile, docker-compose público ou frontend.

### Pode ficar no frontend

- Supabase publishable/anon key, com RLS correto.

### Não pode ficar no frontend/repo

- service role key;
- access token Supabase;
- senha Postgres;
- token MCP;
- token capture;
- API keys privadas.

## 9. Hardening obrigatório antes de produção confiável

1. Proteger ou remover endpoints admin do Express.
2. Tirar secrets de arquivos versionados.
3. Validar RLS das tabelas sensíveis.
4. Revisar policies `public ALL`.
5. Garantir que MCP/edge functions usem token e logs.
6. Rotacionar credenciais que foram expostas em chat.

## 10. Operação de conhecimento

### Entrada de conhecimento

A Alexandria deve operar de forma bidirecional:

1. entrega contexto para IAs/agentes via context pack;
2. recebe memórias, aprendizados e lacunas dessas IAs;
3. assimila esse material com dedupe, obsolescência, conflito e revisão da Hermione.

Documento operacional específico: `ALEXANDRIA_MEMORY_ASSIMILATION_PROTOCOL.md`.

Todo conhecimento entra como fonte com status inicial:

- `draft`, se for rascunho interno;
- `review`, se veio de captura externa/n8n/agente;
- `approved`, somente após validação;
- `deprecated` ou `superseded`, quando perder validade.

### Publicação

Somente Hermione promove fonte para oficial.

Critérios:

- origem conhecida;
- conteúdo sanitizado;
- sem segredo;
- classificado na taxonomia;
- com resumo fiel;
- com embedding;
- sem conflito com fonte mais nova.

## 11. Consulta por agentes

O caminho oficial deve ser MCP/context pack.

Fluxo alvo:

```txt
Agente
  -> pergunta/tarefa
  -> Alexandria MCP
  -> busca semântica na base canônica
  -> context pack em Markdown
  -> agente executa com contexto rastreável
```

## 12. Regra de uso pela Pepper

Antes de tarefas estratégicas, Pepper deve perguntar:

1. Existe conhecimento institucional na Alexandria sobre isso?
2. Existe POP/SLA/skill aplicável?
3. Existe contexto de cliente/agente/oferta?
4. O que é fonte oficial e o que é rascunho?

Se existir, Pepper usa context pack.
Se não existir, Pepper registra lacuna para Hermione.

## 13. Rotina diária mínima

Roboto verifica:

- documentos novos para curadoria;
- falhas de ingestão;
- documentos sem embedding;
- fontes em `review` paradas;
- consultas sem resultado;
- duplicatas;
- logs de erro das edge functions.

Hermione decide:

- classificar;
- publicar;
- deprecar;
- pedir validação ao Rael/Pepper.

## 14. Critério para declarar Alexandria fonte confiável

A Alexandria só deve ser declarada fonte confiável quando:

1. Houver schema canônico único.
2. 100% dos artefatos publicados tiverem embedding.
3. MCP usar busca semântica.
4. `review -> approved` estiver funcionando.
5. RLS/policies críticas estiverem revisadas.
6. Endpoints admin estiverem protegidos/removidos.
7. Um agente conseguir responder com fonte rastreável via context pack.

## 15. Plano V1 recomendado

### V1.1 — Documentação e fonte de verdade

- Atualizar `ARCHITECTURE.md` e `OPERATIONS.md` para refletir código real.
- Marcar documentação aspiracional como legado.

### V1.2 — Segurança mínima

- [feito localmente em 2026-05-23] Proteger endpoints admin com `ADMIN_API_TOKEN` em `api/server.js`.
- [feito localmente em 2026-05-23] Remover hardcodes sensíveis do Compose/Dockerfile e substituir por variáveis de ambiente.
- [feito localmente em 2026-05-23] Expandir `.env.example` com variáveis necessárias sem segredos reais.
- [pendente] Rodar validação de sintaxe/build.
- [pendente] Rotacionar credenciais expostas.

### V1.3 — Base canônica

- Definir `hermione_*` como modelo canônico.
- [feito localmente em 2026-05-23] Criar script seguro de espelhamento `giles_knowledge -> hermione_*` em `scripts/migrate-giles-to-hermione.mjs`.
- Migrar conteúdo útil de `giles_knowledge`.
- Backfill de embeddings.

### V1.4 — Busca semântica

- Alterar `alexandria-mcp` para usar RPC vetorial.
- Alterar `alexandria-proxy/search` para usar RPC vetorial.
- Manter fallback textual.

### V1.5 — Integração Pepper

- Criar rotina de context pack para Pepper.
- Cada agente recebe contexto escopado por domínio.
- Registrar lacunas quando não houver fonte.
