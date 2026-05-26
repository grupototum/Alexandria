# Migrações Alexandria

## Migração segura: `giles_knowledge -> hermione_*`

Script:

```bash
scripts/migrate-giles-to-hermione.mjs
```

Objetivo:

- espelhar conhecimento útil de `giles_knowledge` para o fluxo canônico `hermione_*`;
- criar artefatos com `status=review`;
- preservar a origem;
- não apagar nem alterar `giles_knowledge`.

## Segurança

O script é seguro por padrão:

- roda em `dry-run` se `--apply` não for passado;
- não faz `delete`;
- não faz `update`;
- detecta duplicidade por `content_hash` em `hermione_sources`;
- cria artefatos como `review`, nunca como `approved`.

## Variáveis necessárias

```bash
export SUPABASE_URL="https://cgpkfhrqprqptvehatad.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="..."
```

Também aceita:

```bash
export SUPABASE_SERVICE_KEY="..."
```

## Dry-run

```bash
npm run migrate:giles:dry-run
```

Ou:

```bash
node scripts/migrate-giles-to-hermione.mjs --limit 20
```

## Aplicar

```bash
npm run migrate:giles:apply -- --limit 200
```

Ou:

```bash
node scripts/migrate-giles-to-hermione.mjs --apply --limit 200
```

## Paginação

```bash
node scripts/migrate-giles-to-hermione.mjs --apply --limit 200 --offset 200
```

## Resultado esperado

Para cada registro novo de `giles_knowledge` com conteúdo válido:

1. cria uma linha em `hermione_sources`;
2. cria um artefato em `hermione_artifacts` com `status=review`;
3. cria vínculo em `hermione_artifact_sources`.

## Próximo passo depois da migração

Hermione deve revisar/promover artefatos importantes de `review` para `approved`.

Depois disso, o MCP/context pack deve priorizar somente `approved` por padrão.
