# Integração OpenClaw ↔ Alexandria

**Status:** [Planejada | Em desenvolvimento | Ativa]  
**Endpoint:** `http://localhost:8080/api/alexandria` (ou produção)

## Como funciona

1. OpenClaw chama API REST de Alexandria
2. Alexandria retorna dados canônicos (decisões, projetos, lições)
3. OpenClaw usa esses dados pra contextualizar agentes

## Endpoints planejados

- `GET /decisions` → Lista todas as decisões
- `GET /decisions/:trackingId` → Detalhes de uma decisão
- `POST /decisions` → Criar nova decisão
- `GET /projects` → Lista todos os projetos
- `GET /projects/:slug` → Detalhes de um projeto
- `POST /projects` → Criar novo projeto
- `GET /lessons` → Lista todas as lições
- `POST /lessons` → Criar nova lição
- `GET /people` → Lista todos os contatos
- `POST /people` → Criar novo contato

## Autenticação

- Token Bearer via header `Authorization: Bearer <token>`
- Secrets armazenados em vault (não em config)

## Logs

- Toda ação em Alexandria gera log em `logs/YYYY-MM-DD.md`
