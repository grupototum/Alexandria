# Alexandria Universal Plugin

Status: V1 inicial.
Criado em: 2026-05-23.
Objetivo: transformar a Alexandria na camada universal de contexto da Totum.

## 1. Visão

A Alexandria não deve ser apenas uma tela dentro do Totum OS.

Ela deve ser um plugin universal que qualquer IA, terminal, app ou central de agentes consiga chamar para obter o contexto certo antes de executar uma tarefa.

Frase canônica:

> Alexandria é a camada universal de contexto da Totum.

## 2. Interfaces-alvo

A Alexandria deve poder ser consumida por:

- Pepper/OpenClaw.
- Claude Desktop.
- Claude Code.
- Cursor.
- Codex.
- Gemini.
- ChatGPT.
- Kimi.
- Apps web.
- Apps mobile.
- Central de chat dos agentes.
- Qualquer terminal/CLI.

## 3. Arquitetura alvo

```txt
Qualquer IA / App / Terminal
        ↓
Alexandria Plugin API
        ↓
Auth + permissão + escopo
        ↓
Context Pack Builder
        ↓
Busca semântica + filtros por agente/tarefa/domínio
        ↓
Fontes aprovadas pela Hermione
        ↓
Resposta em Markdown/JSON/MCP
```

## 4. Princípio operacional

Nenhum agente precisa carregar todo o conhecimento no prompt base.

O agente deve pedir à Alexandria:

> Me dê o contexto certo para esta tarefa.

A Alexandria responde com:

- fontes relevantes;
- skills aplicáveis;
- POP/SLA;
- DNA/Soul do agente;
- decisões anteriores;
- contexto de cliente;
- restrições;
- exemplos;
- lacunas.

## 5. Interfaces oficiais V1

### 5.1 MCP

Para Claude Desktop, agentes compatíveis com MCP e integrações locais.

Ferramentas:

- `alexandria_search`
- `alexandria_get_artifact`
- `alexandria_context_pack`

Implementação atual:

- `tools/alexandria-claude-mcp/server.mjs`
- `supabase/functions/alexandria-mcp/index.ts`

### 5.2 HTTP API

Para web, mobile, OpenClaw, bots, CLIs e integrações genéricas.

Endpoint:

```txt
POST https://cgpkfhrqprqptvehatad.supabase.co/functions/v1/alexandria-mcp
```

Headers:

```http
Content-Type: application/json
x-alexandria-token: <token>
```

Ações:

```json
{ "action": "search", "query": "...", "limit": 8 }
```

```json
{ "action": "context_pack", "query": "...", "agent": "pepper", "domain": "agentes_ia", "limit": 6 }
```

```json
{ "action": "get_artifact", "artifactId": "..." }
```

### 5.3 CLI

Para qualquer terminal:

```bash
alexandria search "POP de SDR"
alexandria context "criar campanha para cliente odontológico" --agent pepper
alexandria get <artifact-id>
```

Implementação V1:

- `tools/alexandria-cli/cli.mjs`

## 6. Formato do Context Pack

O context pack deve ser retornado em Markdown e JSON.

Markdown padrão:

```markdown
# Alexandria Context Pack

Tarefa:
Agente:
Domínio:
Data:

## Fontes consultadas

## Contexto relevante

## Skills aplicáveis

## POP/SLA aplicável

## Restrições

## Lacunas
```

## 7. Regras de confiança

Por padrão, context packs devem priorizar fontes:

1. `approved`
2. `review`, apenas quando marcado como não oficial
3. nunca `deprecated`, `superseded` ou `blocked`, salvo consulta explícita de auditoria

## 8. Papel da Hermione

Hermione governa:

- taxonomia;
- status;
- versão;
- classificação;
- fonte confiável;
- lacunas;
- bloqueios de segurança.

## 9. Papel da Pepper

Pepper consome Alexandria para:

- recuperar contexto institucional;
- coordenar agentes;
- montar planos;
- validar entregas;
- identificar lacunas;
- converter decisões do Rael em conhecimento durável.

## 10. Permissões V1

Leitura:

- permitida via token por integração;
- escopo por agente/domínio deve ser adicionado na V2.

Escrita:

- não deve ser liberada para agentes diretamente como `approved`;
- toda captura entra como `review`;
- Hermione promove ou rejeita.

## 11. Roadmap técnico

### V1

- Manifesto universal.
- HTTP API estável.
- CLI simples.
- MCP local.
- Context pack em Markdown.
- Formato `alexandria_memory_bundle_v1` documentado.

### V1.5

- Busca semântica no MCP.
- Fallback textual.
- Filtro por status/domínio/agente.
- Logs de consulta.
- Action `assimilate_memory` para receber memórias externas como `review`.
- Dedupe exato por hash.

### V2

- SDK JS/TS.
- SDK Python.
- Plugin mobile/web.
- Permissões por agente.
- Escrita governada com fila Hermione.
- Dedupe semântico por embedding.
- Detecção de obsolescência e conflitos.
- Exportadores de memória para Claude/Cursor/Codex/OpenClaw.

## 12. Critério de sucesso V1

A V1 funciona quando qualquer ambiente consegue chamar:

```bash
alexandria context "qual contexto preciso para ativar um SDR?" --agent pepper
```

E recebe um pacote Markdown útil, rastreável e pronto para injetar em uma IA.
