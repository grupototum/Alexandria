# Alexandria CLI

CLI universal para consultar a Alexandria, camada de contexto da Totum, a partir de qualquer terminal.

## Configuração

```bash
export ALEXANDRIA_MCP_URL="https://cgpkfhrqprqptvehatad.supabase.co/functions/v1/alexandria-mcp"
export ALEXANDRIA_MCP_TOKEN="seu-token"
```

## Uso local

```bash
node cli.mjs manifest
node cli.mjs search "POP de SDR"
node cli.mjs context "criar campanha para cliente odontológico" --agent pepper
node cli.mjs get <artifact-id>
```

## Instalação local opcional

```bash
cd tools/alexandria-cli
npm link
alexandria context "ativar um agente SDR" --agent pepper
```

## Saídas

- `search` retorna JSON.
- `get` retorna JSON.
- `context` retorna Markdown quando disponível.

## Segurança

Não coloque tokens no comando. Use variáveis de ambiente.
