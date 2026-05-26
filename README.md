# Alexandria / Totum OS Knowledge Layer

Sistema operacional de agência com AI Command Center e Alexandria como camada central de conhecimento.

> Nota canônica, 2026-05-23: este repositório contém hoje o app Totum OS com a Alexandria como seção central de conhecimento, backend Express mínimo, Supabase Edge Functions e MCP próprio. A documentação antiga que descreve elizaOS/57 agentes deve ser tratada como legado/aspiracional quando não houver evidência no código.

Documentos canônicos atuais:

- `ARCHITECTURE.md` — arquitetura real do repo.
- `OPERATIONS.md` — operação real, deploy e governança.
- `ALEXANDRIA_KNOWLEDGE_CANON.md` — modelo de fusão Pepper + Alexandria + Hermione.
- `ALEXANDRIA_UNIVERSAL_PLUGIN.md` — contrato da Alexandria como plugin universal para IAs, apps e terminais.
- `ALEXANDRIA_MEMORY_ASSIMILATION_PROTOCOL.md` — super protocolo para importar, deduplicar, revisar e assimilar memórias de IAs conectadas.
- `ALEXANDRIA_GITHUB_BENCHMARK_MEMORY_SYSTEMS.md` — benchmark de projetos open source similares e recomendações para Alexandria.
- `ALEXANDRIA_V1_TRUSTED_SOURCE_PLAN.md` — plano para virar fonte confiável.
- `VALIDATION_PENDING.md` — comandos de validação pendentes antes de deploy.


## Direção do Produto

- **AI Command Center:** chat único para chamar agentes, trocar motor/IA, enviar contexto ou skill em Markdown e acompanhar um log resumido do que o agente está fazendo.
- **Alexandria:** central Knowledge First para fontes, artefatos, skills, POPs, decisões e pacotes de contexto exportáveis para Claude, Kimi, ChatGPT, Gemini e apps locais via MCP/exportadores futuros.
- **Agentes Input -> Output:** formulários guiados para gerar planejamento social, copy de ads, posts, SEO/growth, atendimento e carrosséis em Markdown revisável.
- **Fluxos:** área inspirada em Flowise/OpenClaw/Suna para automações e infraestrutura de agentes.

## 📁 Estrutura

```
.
├── api/                    # Backend Node.js
│   ├── routes/            # Scripts de processamento
│   ├── services/          # Serviços API
│   ├── outputs/           # Dados processados
│   ├── server.js          # Express server
│   └── package.json
├── src/                   # Frontend React
├── dist/                  # Build do frontend
├── ecosystem.config.js    # PM2 config
├── nginx.conf            # Configuração Nginx
└── deploy.sh             # Script de deploy
```

## Quick Start

### Desenvolvimento Local

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd api && npm install && npm run dev
```

### Produção (VPS)

```bash
# Clone
git clone https://github.com/grupototum/Totum-OS.git
cd Totum-OS

# Deploy
./deploy.sh
```

## AnythingLLM como serviço interno

O AnythingLLM deve ficar fora deste repositório, em diretório irmão:

```bash
cd "/Users/israellemos/Documents/Pixel Systems"
git clone https://github.com/mintplex-labs/anything-llm anything-llm
```

O Totum OS conversa com ele pela Supabase Edge Function `agent-chat`, sem expor token no frontend.

Variáveis da função:

```env
ANYTHINGLLM_API_BASE=http://127.0.0.1:3001/api
ANYTHINGLLM_API_KEY=sua-chave-developer-api
ANYTHINGLLM_DEFAULT_WORKSPACE=totum-agents
ANYTHINGLLM_DEFAULT_MODE=chat
DISABLE_TELEMETRY=true
```

## URLs

- **Local:** http://localhost:5173 (frontend), http://localhost:3003 (api)
- **Produção:** http://apps.grupototum.com

## API Endpoints

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/health` | GET | Health check |
| `/api/transcribe` | POST | Processar transcrições |
| `/api/ingest` | POST | Ingerir no Supabase |
| `/api/webhook/:agent` | POST | Chamar agente |
| `/api/outputs` | GET | Listar outputs |

## Variáveis de Ambiente

Crie `.env` na pasta `api/`:

```env
SUPABASE_URL=https://cgpkfhrqprqptvehatad.supabase.co
SUPABASE_KEY=sua-chave-aqui
OLLAMA_URL=http://localhost:11434
MOCK_MODE=false
```

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind
- **Backend:** Node.js + Express
- **Processamento:** Ollama (IA local)
- **Database:** Supabase (PostgreSQL)
- **Deploy:** PM2 + Nginx
