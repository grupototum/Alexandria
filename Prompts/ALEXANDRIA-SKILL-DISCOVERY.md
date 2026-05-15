# Alexandria Skill Discovery — Arquitetura

> **Princípio:** *"Não decidir se precisa de skill. A Alexandria define o que cobre."*
>
> **Inspirado no Claude Cowork/Code/Opus 4.7 system prompt**
> **Fonte:** https://github.com/asgeirtj/system_prompts_leaks
> **Data:** 2026-05-03

---

## 🎯 O Problema

Hoje, quando um agente recebe uma tarefa:
1. Ele tenta "adivinhar" se precisa de informação da Alexandria
2. Às vezes executa sem consultar
3. Às vezes consulta quando não precisa
4. Resultado: inconsistência, retrabalho, conhecimento não aplicado

## 💡 A Solução

**Inverter a lógica.** Assim como o Claude não decide se precisa de SKILL.md — ele lê primeiro porque a skill define o escopo — o agente da Totum não deve decidir se precisa da Alexandria. Ele deve **sempre consultar** antes de executar.

---

## 🏗️ Arquitetura

```
Tarefa Recebida
      ↓
[1] ALEXANDRIA SKILL DISCOVERY
      ↓
Query: "O que a Alexandria sabe sobre {tema}?"
      ↓
Retorna:
  - Skills relevantes
  - Procedimentos (POPs)
  - Documentação
  - Contexto histórico
      ↓
[2] AGENTE EXECUTA
      ↓
Usa o conhecimento da Alexandria como base
      ↓
[3] ATUALIZA ALEXANDRIA (se necessário)
      ↓
Novos aprendizados são persistidos
```

---

## 📋 Protocolo de Skill Discovery

### Passo 1: Query de Descoberta

Antes de qualquer ação, o agente executa:

```
GET /alexandria/query?q={tema}&type=skill,pop,doc
```

Parâmetros:
- `q`: Tema da tarefa (extraído automaticamente)
- `type`: Tipos de conteúdo (skill, pop, doc, context)
- `limit`: Máximo de resultados (default: 5)

### Passo 2: Avaliação de Relevância

A Alexandria retorna resultados com score de relevância:

```json
{
  "results": [
    {
      "type": "skill",
      "name": "feishu-bitable",
      "relevance": 0.95,
      "path": "skills/feishu-bitable/SKILL.md",
      "summary": "Gerenciamento de Bitable (multidimensional tables)"
    },
    {
      "type": "pop",
      "name": "POP-001-CRIACAO-AGENTES",
      "relevance": 0.87,
      "path": "planos/POP-001-CRIACAO-AGENTES.md",
      "summary": "Processo de criação de agentes"
    }
  ]
}
```

### Passo 3: Aplicação

- **Se relevance > 0.8:** Ler o documento completo antes de executar
- **Se relevance 0.5-0.8:** Considerar como contexto adicional
- **Se relevance < 0.5:** Ignorar, executar com conhecimento base

### Passo 4: Execução

O agente executa a tarefa **usando** o conhecimento da Alexandria como fundação.

---

## 🔄 Fluxo por Tipo de Tarefa

### Tarefa Técnica (ex: "Criar backup do banco")
```
1. Query Alexandria: "backup", "database", "postgresql"
2. Retorna: SKILL.md de healthcheck, POP de backup
3. Executa seguindo o procedimento
```

### Tarefa Comercial (ex: "Qual status do cliente X?")
```
1. Query Alexandria: "cliente", "CRM", "status"
2. Retorna: SKILL.md de CRM, contexto do cliente
3. Executa com contexto correto
```

### Tarefa Criativa (ex: "Escrever post sobre Y")
```
1. Query Alexandria: "marketing", "copy", "tom-de-voz"
2. Retorna: Guia de tom de voz, exemplos anteriores
3. Executa alinhado com a marca
```

---

## 📁 Estrutura na Alexandria

```
alexandria/
├── skills/
│   ├── feishu-bitable/
│   │   └── SKILL.md
│   ├── feishu-calendar/
│   │   └── SKILL.md
│   └── ...
├── pops/
│   ├── POP-001-CRIACAO-AGENTES.md
│   ├── POP-002-CRIACAO-SUBAGENTES.md
│   └── ...
├── contextos/
│   ├── clientes/
│   ├── projetos/
│   └── ...
├── templates/
│   ├── respostas/
│   ├── documentos/
│   └── ...
└── index.json  # Índice para busca rápida
```

---

## 🔧 Implementação Técnica

### Endpoint da API TOT

```
GET /alexandria/discover
Body: {
  "query": "criar agente",
  "context": "desenvolvimento",
  "types": ["skill", "pop", "doc"],
  "limit": 5
}

Response: {
  "discovered": [...],
  "recommended_action": "read_skill_first",
  "primary_skill": "..."
}
```

### No System Prompt dos Agentes

```markdown
## Alexandria Skill Discovery (OBRIGATÓRIO)

Antes de executar QUALQUER tarefa:

1. Consulte a Alexandria via `/alexandria/discover`
2. Forneça: tema da tarefa + contexto
3. Se retornar skill/pop com relevance > 0.8: LEIA ANTES DE AGIR
4. Execute usando o conhecimento da Alexandria como base
5. Após execução, se aprendeu algo novo: persista na Alexandria

NUNCA decida sozinho se precisa consultar. SEMPRE consulte.
A Alexandria define o que cobre, não você.
```

---

## 🎭 Aplicação por Agente

| Agente | Alexandria Discovery | O que Busca |
|--------|---------------------|-------------|
| **TOT (orquestrador)** | Sim | POPs, arquitetura, procedimentos |
| **Kimi Totum (Telegram)** | Sim | Regras de atendimento, FAQ, contexto cliente |
| **Prompt Master** | Sim | Templates, exemplos, guias de prompt |
| **Coding Agent** | Sim | SKILL.md, padrões de código, arquitetura |
| **Zelador** | Sim | Health checks, procedimentos de manutenção |

---

## ⚡ Exemplo Prático

**Tarefa:** "Criar um novo agente chamado 'Analista de Dados'"

**Fluxo SEM Alexandria Skill Discovery:**
```
1. Agente recebe tarefa
2. Executa baseado em conhecimento genérico
3. Pode violar POP-001
4. Resultado: agente mal documentado, sem aprovação
```

**Fluxo COM Alexandria Skill Discovery:**
```
1. Agente recebe tarefa
2. Query Alexandria: "criar agente", "POP-001"
3. Retorna: POP-001-CRIACAO-AGENTES.md (relevance: 0.98)
4. Agente LÊ o POP completo
5. Segue: checklist, aprovação, documentação
6. Resultado: agente criado corretamente
```

---

## 📈 Evolução Futura

### Fase 1: Query Manual (Agora)
- Agente chama `/alexandria/discover` explicitamente
- Avalia relevance manualmente

### Fase 2: Injeção Automática (Próximo)
- Gateway OpenClaw injeta contexto da Alexandria automaticamente
- Baseado no tema detectado da mensagem

### Fase 3: RAG Híbrido (Futuro)
- Alexandria como RAG layer completo
- Vetorização semântica para matches mais precisos
- Cache de contexto relevante

---

## 📝 Checklist de Implementação

- [ ] Endpoint `/alexandria/discover` na API TOT
- [ ] Índice `index.json` com metadados de todos os docs
- [ ] System prompt atualizado em todos os agentes
- [ ] Teste: criar tarefa e verificar se consulta Alexandria
- [ ] Documentar no `AGENTS.md`
- [ ] Documentar no `SOUL.md`
- [ ] Treinar Kimi Totum para usar no Telegram

---

*Arquitetura proposta por Israel | Documentado por TOT | 2026-05-03*
