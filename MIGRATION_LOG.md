# TOTUM 3.0 MIGRATION LOG

## Timeline

- **2026-05-02** — Fase 0 completa
  - [x] Credenciais coletadas (Groq, Google, Supabase)
  - [x] Alexandria repo criado + pushed → https://github.com/grupototum/Alexandria
  - [x] Totum-Chat repo criado + pushed → https://github.com/grupototum/Totum-Chat
  - [x] Backup Supabase (ver Passo 4 abaixo)
  - [x] Tag v1.0-pre-migration criada + pushed

- **2026-05-02** — Fase 1 completa (LobeHub na VPS)
  - [x] Docker + Docker Compose instalados na VPS 187.127.4.140
  - [x] LobeHub (totum-chat) rodando em /home/totum/totum-chat (porta 3210)
  - [x] SSL via Let's Encrypt para chat.grupototum.com
  - [x] Nginx configurado em /etc/nginx/conf.d/domains/chat.grupototum.com.conf
  - [x] ACCESS_CODE=totum2026
  - [x] DEFAULT_AGENT_CONFIG=model=mistral:latest;provider=ollama
  - [x] SYSTEM_AGENT com Alexandria Skill Discovery obrigatório

- **2026-05-03** — Fases 2+3 completas (Alexandria Knowledge Base + RAG)
  - [x] Supabase migration 001: tabela `alexandria_documents` + ivfflat index (vector 768)
  - [x] Supabase migration 002: RLS desabilitado + unique constraint (title, doc_type)
  - [x] Alexandria API deployada em /home/totum/alexandria-api (porta 5000, Docker)
  - [x] Endpoints: POST /alexandria/discover, /alexandria/rag/search, /alexandria/ingest, /alexandria/ingest/batch
  - [x] Embedding: gemini-embedding-001 com outputDimensionality=768
  - [x] 3 documentos fundação ingeridos: Alexandria Skill Discovery, POP-001, Tom de Voz Totum
  - [x] Teste RAG validado: query "criar novo agente" retornou POP-001 (relevance: 0.74)
  - [x] totum-chat env corrigido: ALEXANDRIA_API_URL=http://host.docker.internal:5000
  - [ ] Nginx público para alexandria.grupototum.com — pendente (precisa root via HestiaCP)

## Credenciais Geradas

- Groq API key: ✓ `gsk_gC6iNM...` (key "Totum OS Geral", salvo em .env.local)
- Google Gemini API key: ✓ `AIzaSyDS...` (salvo em .env.local)
- Supabase URL/Key: ✓ (projeto cgpkfhrqprqptvehatad, salvo em .env.local)

## Repos Criados

- Alexandria: https://github.com/grupototum/Alexandria
- Totum-Chat: https://github.com/grupototum/Totum-Chat

## Backups Feitos

- Supabase pre-migration: ✓ (já existia)
- Totum-OS tag v1.0-pre-migration: ✓ (commit cdcc7632)

## Serviços Ativos na VPS (187.127.4.140)

| Container | Porta | URL |
|-----------|-------|-----|
| totum-chat | 3210 | https://chat.grupototum.com |
| alexandria-api | 5000 | interno (http://localhost:5000) |

## Alexandria API — Endpoints

```
GET  /health                     → status check
POST /alexandria/discover        → Skill Discovery (query semântica)
POST /alexandria/rag/search      → busca RAG direta
POST /alexandria/ingest          → inserir 1 documento
POST /alexandria/ingest/batch    → inserir N documentos
```

## Pendente — Nginx Alexandria (1 passo manual)

Adicionar via HestiaCP UI ou como root:
- Criar subdomínio `alexandria.grupototum.com`
- Proxy pass para `localhost:5000`
- Let's Encrypt SSL

Config de referência salva em: `/home/totum/alexandria-api/nginx-sample.conf`

## Próximas Fases

- **Fase 4**: Plugin / extensão do dashboard para gerenciar Alexandria
- **Fase 5**: Data flow — ingestão automática de skills/POPs do Logseq/Drive
- **Fase 6**: Go-live — todos os agentes com Skill Discovery ativo
