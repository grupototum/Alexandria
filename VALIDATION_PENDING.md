# Validações pendentes — Alexandria

Status: pendente por falta de aprovação de `exec` no canal atual.
Criado em: 2026-05-23.

## Comandos de validação local

```bash
cd /root/.openclaw/workspace/Alexandria
node --check api/server.js
node --check tools/alexandria-cli/cli.mjs
node --check tools/alexandria-claude-mcp/server.mjs
node --check scripts/migrate-giles-to-hermione.mjs
npm run build
```

## Dry-run da migração

Exige `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`/`SUPABASE_SERVICE_KEY`.

```bash
cd /root/.openclaw/workspace/Alexandria
npm run migrate:giles:dry-run
```

## Teste do CLI depois do deploy da edge function

Exige `ALEXANDRIA_MCP_TOKEN`.

```bash
cd /root/.openclaw/workspace/Alexandria/tools/alexandria-cli
node cli.mjs manifest
node cli.mjs context "qual contexto preciso para ativar um SDR?" --agent pepper
```

## Observação

Nada disso foi executado automaticamente ainda. Os arquivos foram preparados localmente e precisam passar por validação antes de deploy.

## Validação da busca híbrida alexandria-mcp

Atualizado em: 2026-05-25.

Checklist pós-deploy:

```bash
node --check supabase/functions/alexandria-mcp/index.ts
supabase functions deploy alexandria-mcp
# GET manifest
# context_pack: POP-003
# context_pack: POP-003 SDR proposta comercial
# context_pack: proposta comercial SDR
# search POP-003 includeReview=false
# search POP-003 includeReview=true
```

Resultado esperado: queries compostas devem retornar os artefatos approved do POP-003 sem exigir `includeReview`.
