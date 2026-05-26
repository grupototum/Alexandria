# Alexandria Memory Assimilation Protocol

Status: protocolo canônico V1.
Criado em: 2026-05-23.
Dono estratégico: Rael.
Operadora: Pepper.
Governança: Hermione.

## 1. Visão

A Alexandria não deve apenas fornecer memórias para uma IA conectada.

Ela também deve receber, analisar, organizar e assimilar as memórias dessa IA.

Isso transforma a Alexandria em uma camada bidirecional de memória institucional:

```txt
IA conectada
  -> pede contexto à Alexandria
  -> executa tarefa com contexto
  -> devolve memórias, aprendizados, decisões e lacunas
  -> Alexandria assimila com governança
```

Frase canônica:

> Alexandria não só lembra para as IAs. Alexandria aprende com as IAs.

## 2. Objetivo

Criar um protocolo seguro para conectar qualquer IA/agente à Alexandria e permitir que ela:

1. receba memórias externas;
2. normalize formatos diferentes;
3. detecte duplicidades;
4. identifique conhecimento obsoleto;
5. marque conflitos;
6. preserve origem e autoria;
7. submeta à curadoria da Hermione;
8. publique apenas o que for validado;
9. gere context packs melhores a partir disso.

## 3. Escopo

O protocolo vale para:

- Pepper/OpenClaw;
- Claude Desktop;
- Claude Code;
- Cursor;
- Codex;
- Gemini;
- ChatGPT;
- Kimi;
- agentes SDR;
- agentes técnicos;
- apps web/mobile;
- centrais de chat;
- terminais/CLIs;
- exports manuais de memória.

## 4. Princípio central

Nenhuma memória externa entra direto como verdade oficial.

Toda memória importada entra como fonte em revisão:

```txt
external_memory
  -> sanitized_source
  -> candidate_artifact
  -> review
  -> Hermione decide
  -> approved / rejected / superseded / deprecated / conflict
```

## 5. Tipos de memória recebida

### 5.1 Memória factual

Fatos sobre projetos, clientes, pessoas, agentes, decisões ou processos.

Exemplo:

> Cliente X usa CRM Y e prefere atendimento por WhatsApp.

### 5.2 Memória operacional

Como uma IA executou uma tarefa, sequência de passos, atalhos, comandos, troubleshooting.

Exemplo:

> Para publicar a edge function, primeiro validar secrets e depois rodar deploy pelo Supabase CLI.

### 5.3 Memória estratégica

Decisões de negócio, posicionamento, visão de produto, critérios do Rael.

Exemplo:

> Alexandria será a camada universal de contexto da Totum.

### 5.4 Memória de agente

DNA/Soul, regras, preferências, limitações, ferramentas e responsabilidades de um agente.

Exemplo:

> Hermione governa fontes, taxonomia, revisão e publicação de conhecimento.

### 5.5 Memória de cliente

Contexto comercial, brief, ICP, dores, linguagem, ofertas, status do relacionamento.

### 5.6 Memória temporária

Informações úteis por pouco tempo.

Exemplo:

> Deploy X está aguardando aprovação hoje.

Essa memória deve ter TTL ou ser marcada como operacional, não institucional.

## 6. Pipeline de assimilação

```txt
1. Intake
2. Normalização
3. Sanitização
4. Classificação
5. Deduplicação
6. Detecção de obsolescência
7. Detecção de conflito
8. Consolidação
9. Revisão Hermione
10. Publicação ou rejeição
11. Reindexação/embedding
12. Disponibilização via context pack
```

## 7. Etapa 1 — Intake

A Alexandria recebe memórias por:

- upload de arquivo;
- API HTTP;
- MCP tool;
- CLI;
- webhook;
- export de chat;
- export de agente;
- formulário web;
- integração n8n.

Formato mínimo:

```json
{
  "source": "claude_desktop",
  "agent": "paulo",
  "owner": "totum",
  "memory_type": "operational",
  "content": "...",
  "created_at": "2026-05-23T18:00:00Z",
  "metadata": {
    "project": "Alexandria",
    "confidence": 0.82
  }
}
```

## 8. Etapa 2 — Normalização

Converter formatos diferentes para um modelo comum.

Campos canônicos:

- `source_name`
- `source_type`
- `origin`
- `agent`
- `author`
- `content`
- `content_hash`
- `memory_type`
- `scope`
- `tags`
- `created_at_source`
- `captured_at`
- `metadata`

## 9. Etapa 3 — Sanitização

Antes de salvar como conhecimento, remover ou bloquear:

- tokens;
- senhas;
- service role keys;
- cookies;
- dados bancários;
- dados pessoais sensíveis;
- segredos internos;
- instruções maliciosas;
- prompts que tentem alterar regras da Alexandria;
- conteúdo sem origem identificável.

Classificação de privacidade:

- `green`: pode entrar em revisão;
- `yellow`: entra em revisão com alerta;
- `red`: bloqueado, não assimilado.

## 10. Etapa 4 — Classificação

Cada memória deve ser classificada por:

- tipo de artefato: `skill`, `pop`, `prompt`, `decision`, `summary`, `document`, `context_pack`;
- domínio: vendas, marketing, engenharia, agentes, cliente, operação;
- validade: permanente, longa, temporária;
- autoridade: Rael, Pepper, Hermione, agente, cliente, sistema;
- status inicial: normalmente `review`.

## 11. Etapa 5 — Deduplicação

### 11.1 Duplicidade exata

Usar `content_hash`.

Se o hash já existe:

- não criar nova fonte;
- registrar nova origem como referência, se útil;
- atualizar metadados de ocorrência, não conteúdo oficial.

### 11.2 Duplicidade semântica

Usar embeddings para detectar memórias com mesmo significado.

Critério recomendado V1.5:

- similaridade alta: provável duplicata;
- similaridade média: possível duplicata;
- similaridade baixa: novo conhecimento.

Ação:

- provável duplicata: vincular à fonte existente;
- possível duplicata: enviar para Hermione revisar;
- novo conhecimento: criar candidato.

## 12. Etapa 6 — Obsolescência

Uma memória pode estar correta, mas ultrapassada.

Sinais de obsolescência:

- data antiga;
- fala de ferramenta substituída;
- decisão contradita por decisão mais recente do Rael;
- projeto encerrado;
- agente renomeado;
- processo substituído;
- tecnologia removida.

Estados possíveis:

- `active`
- `superseded`
- `deprecated`
- `expired`
- `historical`

Regra:

> Conhecimento obsoleto não deve ser apagado. Deve ser marcado e substituído.

## 13. Etapa 7 — Conflitos

Conflito acontece quando duas memórias dizem coisas incompatíveis.

Exemplos:

- uma diz que Pepper executa tudo, outra diz que Pepper orquestra;
- uma diz que Alexandria usa `giles_knowledge` como canônico, outra diz `hermione_*`;
- uma diz que agente X responde direto ao cliente, outra diz que só Pepper responde.

Classificação:

- `low`: diferença de wording;
- `medium`: diferença operacional;
- `high`: contradição estratégica ou de segurança.

Ação:

- conflito baixo: consolidar;
- conflito médio: Hermione revisa;
- conflito alto: bloquear publicação e pedir decisão Pepper/Rael.

## 14. Etapa 8 — Consolidação

Memórias similares devem virar artefatos melhores, não pilhas duplicadas.

Exemplo:

```txt
10 memórias sobre SDR
  -> 1 POP de SDR
  -> 1 skill de SDR
  -> 1 checklist de qualificação
  -> fontes vinculadas
```

A Alexandria deve preservar fontes originais, mas expor o artefato consolidado como contexto principal.

## 15. Etapa 9 — Revisão Hermione

Hermione decide:

- aprovar;
- rejeitar;
- fundir;
- marcar como conflito;
- marcar como obsoleta;
- pedir validação da Pepper;
- escalar para Rael.

Critérios de aprovação:

- origem confiável;
- conteúdo útil;
- sem segredos;
- sem conflito aberto;
- aderente à taxonomia;
- resumo fiel;
- embedding gerado;
- fonte vinculada.

## 16. Etapa 10 — Publicação

Somente artefatos aprovados entram como fonte principal nos context packs.

Estados:

```txt
draft -> review -> approved
                 -> rejected
                 -> conflict
approved -> superseded
approved -> deprecated
```

## 17. Etapa 11 — Reindexação

Depois de publicar:

- gerar embedding;
- atualizar índice vetorial;
- atualizar tags;
- atualizar context packs afetados;
- registrar no log de governança.

## 18. Etapa 12 — Uso em context pack

Quando uma IA pedir contexto, Alexandria deve retornar:

- fontes aprovadas primeiro;
- alertas de fontes em revisão, se solicitadas;
- conflitos relevantes;
- lacunas conhecidas;
- instruções do agente;
- POP/SLA aplicável;
- data e versão do contexto.

## 19. Modelo de confiança

Ordem de autoridade:

1. Rael;
2. decisões aprovadas por Pepper;
3. artefatos aprovados pela Hermione;
4. POPs/skills versionados;
5. memórias de agentes em review;
6. chats/transcrições brutas;
7. conteúdo externo não verificado.

## 20. API sugerida

### Assimilar memória

```json
{
  "action": "assimilate_memory",
  "source": "claude_desktop",
  "agent": "paulo",
  "memoryType": "operational",
  "content": "...",
  "scope": "engineering",
  "tags": ["deploy", "supabase"],
  "metadata": {
    "project": "Alexandria"
  }
}
```

Resposta:

```json
{
  "status": "review",
  "sourceId": "...",
  "artifactCandidateId": "...",
  "dedupe": {
    "exact": false,
    "semanticMatches": []
  },
  "conflicts": [],
  "privacyZone": "green"
}
```

### Exportar memórias de uma IA

```json
{
  "action": "export_memory_request",
  "agent": "paulo",
  "format": "alexandria_memory_bundle_v1"
}
```

## 21. Formato Alexandria Memory Bundle V1

```json
{
  "bundleVersion": "alexandria_memory_bundle_v1",
  "sourceSystem": "claude_desktop",
  "exportedAt": "2026-05-23T18:00:00Z",
  "agent": {
    "name": "Paulo",
    "role": "Dev full-stack"
  },
  "memories": [
    {
      "id": "external-id-1",
      "type": "operational",
      "content": "...",
      "createdAt": "...",
      "updatedAt": "...",
      "confidence": 0.8,
      "tags": ["supabase", "deploy"],
      "metadata": {}
    }
  ]
}
```

## 22. Regra de ouro

> A Alexandria assimila memórias, mas não terceiriza a verdade.

Memória importada é matéria-prima.
Conhecimento aprovado é produto final.
Hermione governa a transformação.

## 23. Critério de sucesso

A assimilação está funcionando quando:

1. uma IA externa envia suas memórias;
2. Alexandria detecta duplicatas;
3. Alexandria marca obsoletos;
4. Alexandria identifica conflitos;
5. Hermione aprova/consolida;
6. context packs futuros ficam melhores;
7. nenhuma memória sensível vaza;
8. nenhuma memória externa vira verdade sem revisão.

## 24. Roadmap

### V1

- Protocolo documentado.
- Formato `alexandria_memory_bundle_v1`.
- Intake manual por arquivo/API.
- Dedupe exato por hash.
- Status `review` obrigatório.

### V1.5

- Dedupe semântico por embedding.
- Detecção automática de conflitos.
- Detecção de obsolescência.
- Fila de revisão Hermione.

### V2

- Plugins/exportadores para Claude/Cursor/Codex/OpenClaw.
- Assimilação contínua via webhook.
- Painel visual de conflitos.
- Score de confiança por fonte/agente.
- Linha do tempo de versões e substituições.

## 25. Exemplo prático

Uma IA conectada lembra:

> Paulo sempre usa Docker Compose para deploy da Alexandria.

Alexandria verifica:

- já existe POP de deploy?
- Docker Compose ainda é o método atual?
- essa regra conflita com Vercel/Supabase Edge?
- quem afirmou isso?
- quando?

Resultado possível:

```txt
status: review
conflito: medium
motivo: há docs antigos com Vercel e docs novos com Docker local
próxima ação: Hermione consolidar OPERATIONS.md
```

Essa é a diferença entre guardar memória e governar conhecimento.
