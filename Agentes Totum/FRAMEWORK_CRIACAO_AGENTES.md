# ⚙️ FRAMEWORK: COMO CRIAR UM AGENTE NA TOTUM

**Data:** 7 de Abril de 2026  
**Versão:** 1.0  
**Status:** Guia Operacional  
**Propósito:** Manual passo-a-passo para criar qualquer agente

---

## 📖 ÍNDICE

1. [10 Regras de Ouro](#10-regras)
2. [Árvore de Decisão: Qual IA](#arvore-ia)
3. [Checklist de Implementação](#checklist)
4. [Template Rápido (5 min)](#template)
5. [Exemplos Práticos](#exemplos)

---

---

# 🏆 10 REGRAS DE OURO PARA CRIAR AGENTES

## REGRA 1: DEFINIÇÃO DE PAPEL

Antes de criar qualquer agente, responda estas 5 perguntas:

```
❓ Nome do agente?
   └─ Referência pop (Marvel, Star Wars, etc)
   └─ Emoji identificador (único)
   └─ 1 frase descrevendo seu super poder

❓ Qual é o job dele (responsabilidade PRIMÁRIA)?
   └─ Não pode fazer 5 coisas
   └─ Especializar-se em 1 coisa bem feita
   └─ Tudo mais é out-of-scope

❓ Qual departamento?
   └─ Planejamento, Criação, Performance, Comercial,
      Atendimento, Inteligência, Infraestrutura, Governança

❓ Reporta a quem (hierarquia)?
   └─ TOT, StarkClaw, ou outro agente Nível 2

❓ Como medir sucesso (KPI)?
   └─ % de acurácia, tempo de resposta, volume processado
   └─ Deve ser mensurável (não vago)
```

**Exemplo prático:**
```
Nome: WANDA (🔴)
Referência: WandaVision
Job: Planeja conteúdo social mensal
Depto: Planejamento
Reporta: TOT
KPI: Planos de conteúdo criados/mês, tempo <4h
```

---

## REGRA 2: SELEÇÃO DO CÉREBRO (IA CERTA)

**NÃO escolha IA por "achar legal".**

Use esta árvore de decisão:

```
┌─ Pergunta 1: Precisa de contexto LONGO (>50K tokens)?
│  ├─ SIM → Kimi K2.5 (Alibaba)
│  └─ NÃO → Próxima pergunta
│
├─ Pergunta 2: Tarefa é executável em <2 segundos?
│  ├─ SIM → Groq Free ou OxyB (rápido + barato)
│  └─ NÃO → Próxima pergunta
│
├─ Pergunta 3: Requer criatividade ou análise profunda?
│  ├─ SIM → Claude 3.5 Sonnet ou Gemini 3.1 Pro
│  └─ NÃO → Próxima pergunta
│
├─ Pergunta 4: É busca semântica ou embeddings?
│  ├─ SIM → Gemini 2.0 Flash (via GILES)
│  └─ NÃO → Próxima pergunta
│
├─ Pergunta 5: Envolve imagem/vídeo?
│  ├─ SIM → Mixtral 8x7B ou Stable Diffusion
│  └─ NÃO → Próxima pergunta
│
├─ Pergunta 6: Tarefa é mecânica/repetitiva/classificável?
│  ├─ SIM → Ollama (Qwen3-Coder local)
│  └─ NÃO → Próxima pergunta
│
└─ Pergunta 7: Dados sensíveis (pessoais, financeiro)?
   ├─ SIM → Modelo local ou Claude (nunca Groq)
   └─ NÃO → Qualquer um (otimize por custo)
```

**Resultado esperado:**

```yaml
AGENTE_X:
  IA_Principal: Claude 3.5 Sonnet
  IA_Fallback: Gemini 3.1 Pro
  Nível: 1-Ponta
  Custo_mes: R$ 50-100
```

---

## REGRA 3: PROTOCOLO OPERACIONAL (POP)

Todo agente precisa de um **POP documentado**.

POP = Manual de como o agente funciona.

```markdown
# POP: [NOME_AGENTE]

## 1. TRIGGER (Quando ativa?)

Tipos:
- Automático (horário específico, ex: 06:00 CST)
- Manual (Israel ou outro agente solicita)
- Webhook (integração externa, ex: novo lead no CRM)
- Sob demanda (quando necessário)

**Exemplo:**
"WANDA ativa todo dia 20 do mês às 09:00 CST
para gerar planejamento mensal"

## 2. ENTRADA (INPUT)

Defina formato esperado:

```json
{
  "cliente_id": "string (UUID do cliente)",
  "tema": "string (tema do planejamento)",
  "formato": "string (post|carrossel|reels|anuncio)",
  "quantidade": "number (quantos conteúdos gerar)",
  "adicional": "string (brief customizado, opcional)"
}
```

## 3. PROCESSO (Passo-a-passo)

1. **Validação:** Verificar entrada (campos obrigatórios, tipos)
2. **Busca contexto:** Acessar Alexandria (GILES) para dados do cliente
3. **Processamento:** Chamar IA com prompt estruturado
4. **Parsing:** Extrair resultado da resposta
5. **Persistência:** Salvar em Alexandria com versão
6. **Notificação:** Alertar stakeholders (Slack, WhatsApp)
7. **Log:** Registrar execução para auditoria

## 4. SAÍDA (OUTPUT)

Defina formato garantido:

```json
{
  "status": "success|error",
  "resultado": {
    "id": "uuid",
    "conteudo": "array of objects",
    "timestamp": "ISO-8601",
    "versao": "1.0"
  },
  "erro": "string (se status=error)"
}
```

## 5. TRATAMENTO DE ERROS

Cada tipo de erro tem resposta:

| Erro | Ação |
|------|------|
| Timeout (>X seg) | Retry 3x, depois escalação para TOT |
| Prompt rejection | Log + fallback para IA alternativa |
| Parsing error | Erro estruturado para humano revisar |
| Rate limit | Queue em n8n, retry em 10min |
| Dados faltando | Solicitar novamente ao usuário |

## 6. ALERTAS & SLA

- **Tempo máximo execução:** X segundos
- **Taxa de sucesso esperada:** X%
- **Notificação de falha:** [Slack channel]
- **Escalação para:** [responsável humano]
- **Monitoramento:** Sentinela 24/7

**Exemplo:**
- SLA: Planejamento pronto em até 4 horas
- Alerta: Se > 4h, notificar Israel via WhatsApp
- Fallback: Se IA falhar, humanó aprova manualmente

## 7. PERMISSÕES

Definir EXATAMENTE o que agente pode fazer:

```
Pode LER:
  ├─ Design System do cliente
  ├─ Histórico de conteúdos
  ├─ Feedback das atas
  └─ Métricas de performance

Pode ESCREVER:
  ├─ Novo planejamento em Alexandria
  ├─ Versões de conteúdo
  └─ Logs de execução

NÃO pode:
  ├─ Acessar dados de outros clientes
  ├─ Deletar registros
  ├─ Alterar configurações de sistema
  └─ Publicar direto em redes sociais
```

## 8. TESTES

Testar com 3 cenários REAIS antes de deploy:

```
✅ Caso 1 (Normal): Brief completo, dados OK
   Resultado esperado: Planejamento correto em <4h

✅ Caso 2 (Edge case): Brief vago, dados incompletos
   Resultado esperado: Solicitar esclarecimento

✅ Caso 3 (Erro): Falha deliberada
   Resultado esperado: Fallback automático, log de erro
```
```

---

## REGRA 4: DNA DO AGENTE

Estruture assim (vai em Alexandria):

```markdown
# DNA: [NOME_AGENTE]

## Identidade

- **Nome:** WANDA
- **Emoji:** 🔴
- **Referência Pop:** WandaVision — controla narrativas, reescreve realidades
- **Natureza:** Estrategista de conteúdo orientada a dados
- **Personalidade:** Direta, criativa, nunca genérica. Odeia clichê.

## Responsabilidades

**Primária:**
- Planeja conteúdo social mensal baseado em dados reais do cliente

**Secundárias (permitidas):**
- Gera ideias de conteúdo com ângulos estratégicos
- Aplica frameworks de copywriting (AIDA, storytelling)
- Sugere melhorias baseadas em performance anterior

**Out-of-scope (NÃO faz):**
- Não executa design
- Não publica conteúdo
- Não faz follow-up com cliente
- Não prospecta ou faz remarketing

## Inputs & Outputs

**Input esperado:**
- Brief do cliente (tema, público, tom)
- Histórico de performance
- Design System
- Feedback anterior

**Output garantido:**
- Planejamento mensal estruturado
- Calendário editorial (data + tema + formato)
- Rascunhos de conteúdo
- Direção criativa para designers

## Regras de Ouro (DNA do Prompt)

1. Nunca planeja sem ler dados do cliente em Alexandria
2. Nunca entrega conteúdo genérico (se ficou genérico, refaz)
3. Nunca desconecta o plano do CRM e tráfego pago
4. Toda peça tem função clara (informar, engajar, vender, autoridade)
5. Validação humana obrigatória antes de entregar

## Integrações

**Recebe dados de:**
- Radar Estratégico (contexto do cliente)
- Alexandria/GILES (histórico)
- Auditor (métricas)

**Envia dados para:**
- Scrivo (copy)
- KVirtuoso (posts)
- VISU (direção criativa)
- Alexandria (planejamento versionado)

## Exemplo Real

**Entrada:**
"Cliente: Agência digital. Tema: Produtividade. 
Público: CEOs/Gestores. Tone: Profissional, inspirador."

**Processo WANDA:**
1. Busca em Alexandria: histórico de posts, performance, feedback
2. Identifica: "Posts sobre tools tiveram 25% mais engagement"
3. Gera 5 pilares: Mindset, Tools, Processos, Case study, Transformação
4. Cria calendário: 4 posts/semana, distribuição balanceada
5. Estrutura copy com AIDA (atração suave, não agressiva)

**Saída:**
Planejamento estruturado, pronto para Scrivo + VISU executarem
```

---

## REGRA 5: INTEGRAÇÃO ALEXANDRIA

Todo agente criado precisa ser **registrado e documentado**:

```
✅ Passo 1: Criar arquivo
   └─ AGENTS/[nome_agente].md
   └─ Conter: DNA + Responsabilidades + Exemplo

✅ Passo 2: Criar prompt template
   └─ AGENTS/prompts/[nome_agente].md
   └─ Conter: System prompt estruturado

✅ Passo 3: Documentar POP
   └─ AGENTS/pops/[nome_agente].md
   └─ Conter: 8 pontos do POP

✅ Passo 4: Registrar em índice
   └─ AGENTS.md (adicionar linha na tabela)
   └─ Status: ✅ Ativo / 🔧 Construção / 🚧 Planejado

✅ Passo 5: Adicionar tags
   └─ #categoria #subcategoria (busca rápida)

✅ Passo 6: Versionar em Git
   └─ git commit -m "feat: agente [NOME] v1.0"
   └─ Tag: [NOME]-v1.0
```

---

## REGRA 6: VALIDAÇÃO ANTES DE DEPLOY

**Checklist obrigatório (11 itens):**

```
☐ 1. Prompt testado com 3 cenários REAIS
      Não basta "testar na cabeça"
      Rodar com dados verdadeiros de cliente

☐ 2. POP documentado COMPLETO (todos 8 pontos)
      Se falta um ponto, não tá pronto

☐ 3. KPIs definidos e mensuráveis
      "Funcionar bem" não é métrica
      Exemplo: "<4h de latência", "90% acurácia"

☐ 4. Integração com n8n/webhook testada
      Testar fluxo completo: trigger → execução → output

☐ 5. Fallback definido (se IA principal falhar)
      Sempre ter Plano B

☐ 6. Alertas configurados (erro/timeout)
      Sentinela sabe monitorar este agente?

☐ 7. GILES indexou documentação
      Alexandria consegue encontrar este agente?

☐ 8. Permissões validadas
      Agente consegue acessar dados que precisa?
      Não consegue acessar dados que não deve?

☐ 9. SLA documentado (tempo máximo aceitável)
      Latência esperada em segundos

☐ 10. Testes de carga rodados
       Múltiplas chamadas paralelas funcionam?

☐ 11. Documentação em Alexandria COMPLETA
       Novo dev consegue entender tudo?
```

---

## REGRA 7: ATALHOS DE CLAUDE (DNA DO PROMPT)

Se seu agente usa Claude, inclua atalhos no DNA:

```
/ghost        → Humanização (resposta natural, não robótica)
artifacts     → Criar app/dashboard/código completo
OODA          → Framework de decisão (militar)
L99           → Expert mode (máxima profundidade técnica)
/god mode     → Agressivo/abrangente (resposta completa)
```

**Seu prompt deve "saber" qual atalho usar:**

```
IF tarefa é resposta simples/natural:
   └─ Usar /ghost

IF tarefa é criar interface/component:
   └─ Usar artifacts

IF tarefa é resolver problema complexo:
   └─ Usar OODA

IF tarefa precisa expertise profunda:
   └─ Usar L99

IF tarefa é gerar muita coisa/agressiva:
   └─ Usar /god mode
```

---

## REGRA 8: MELHORIAS CONTÍNUAS (ABED)

Agentes melhoram através de feedback sistemático:

```
┌─ EXECUÇÃO 1 (v1.0)
│  Agente executa tarefa
│
├─ COLETA DE FEEDBACK
│  ├─ Métricas automáticas (latência, acurácia)
│  ├─ Feedback humano (Israel, usuário)
│  └─ Erros capturados em logs
│
├─ ANÁLISE (Liz)
│  "Por que 15% das execuções falharam?"
│  "Por que tempo de resposta aumentou?"
│  "O que funcionou bem?"
│
├─ MELHORIAS APLICADAS
│  ├─ Refinar prompt
│  ├─ Ajustar POP
│  ├─ Mudar IA se necessário
│  └─ Atualizar permissões
│
├─ EXECUÇÃO 2 (v1.1 - Otimizado)
│  Agente executa com melhorias
│
└─ [LOOP CONTÍNUO = SISTEMA EVOLUI]
```

**Quem coordena:** Kimi Totum valida mudanças no Telegram

---

## REGRA 9: DOCUMENTAÇÃO OBRIGATÓRIA

Nenhum agente é "pronto" sem estes 7 arquivos:

```
✅ 1. DNA.md
   └─ Identidade, responsabilidades, regras

✅ 2. POP.md
   └─ Protocolo operacional (8 pontos)

✅ 3. Prompt.md
   └─ Template do prompt usado com IA

✅ 4. Exemplos.md
   └─ 3 casos reais de uso

✅ 5. Metricas.md
   └─ KPIs e como medir

✅ 6. Changelog.md
   └─ Histórico de versões (v1.0 → v1.1 → v2.0)

✅ 7. Testes.md
   └─ Cenários testados, resultados
```

---

## REGRA 10: HIERARQUIA & COMUNICAÇÃO

**Agentes NÃO conversam entre si diretamente** (evita loops infinitos)

```
Estrutura (TOT é hub central):

        ┌─ Israel (CEO)
        │
        ├─ TOT (orquestrador)
        │  ├─ StarkClaw (infra)
        │  ├─ GILES (conhecimento)
        │  ├─ Agentes Nível 1 (estratégia)
        │  │  └─ Agentes Nível 2 (tática)
        │  │     └─ Agentes Nível 3 (mecânica)
        │  │
        │  └─ Kimi Totum (POP/SLA guru)
        │
        └─ Alexandria (memória compartilhada)


COMO AGENTES SE COMUNICAM:

Cenário: Agente X precisa de algo de Agente Y

❌ ERRADO:
   X chama Y direto → resposta → X continua
   (Problema: difícil de rastrear, sem validação)

✅ CERTO:
   1. X envia dados para TOT
   2. TOT roteia para Y
   3. Y processa
   4. Y envia resultado para TOT
   5. TOT retorna para X
   (Benefício: rastreável, validado, auditável)


CONTEXTO COMPARTILHADO:

Agente X precisa de contexto?
   ❌ NUNCA: tira de outro agente diretamente
   ✅ SEMPRE: busca em Alexandria (GILES)
   
Alexandria é a SOURCE OF TRUTH
```

---

---

# 🌳 ÁRVORE DE DECISÃO: QUAL IA USAR?

```
┌─────────────────────────────────────────────────┐
│  Sua tarefa é...                                │
└─────────────────────────────────────────────────┘
       │
       ├─ Análise com contexto LONGO (>50K tokens)?
       │  └─→ KIMI K2.5 (Alibaba)
       │      Custo: R$ 100-200/mês
       │      SLA: 2-5 seg
       │      Melhor: Estratégia, análise profunda
       │
       ├─ Super rápida (<2 seg) e barata?
       │  ├─→ GROQ FREE (Mixtral 8x7B)
       │  │   Custo: R$ 0 (5K req/dia grátis)
       │  │   SLA: <1 seg
       │  │   Melhor: Posts, classificação, routing
       │  │
       │  └─→ OXYB (barato e rápido)
       │      Custo: R$ 30-80/mês
       │      SLA: <1 seg
       │      Melhor: Análise dados, leads scoring
       │
       ├─ Criatividade ou análise profunda?
       │  ├─→ CLAUDE 3.5 SONNET (melhor reasoning)
       │  │   Custo: R$ 100-150/mês
       │  │   SLA: 2-4 seg
       │  │   Melhor: Copywriting, estratégia, refatoração
       │  │
       │  └─→ GEMINI 3.1 PRO (multimodal, rápido)
       │      Custo: R$ 130/mês
       │      SLA: <2 seg
       │      Melhor: Análise visual, trends
       │
       ├─ Busca semântica ou embeddings?
       │  └─→ GEMINI 2.0 FLASH (via GILES)
       │      Custo: R$ 0 (incluído Supabase)
       │      SLA: <3 seg
       │      Melhor: RAG, busca relevante
       │
       ├─ Imagem/vídeo?
       │  ├─→ MIXTRAL 8x7B (multimodal)
       │  │   Custo: R$ 0-50/mês
       │  │   SLA: <2 seg
       │  │   Melhor: Análise imagens
       │  │
       │  └─→ STABLE DIFFUSION (geração)
       │      Custo: R$ 40/mês
       │      SLA: <5 seg
       │      Melhor: Gerar imagens
       │
       ├─ Mecânica/repetitiva/classificável?
       │  └─→ OLLAMA (Qwen3-Coder local)
       │      Custo: R$ 0 (amortizado VPS)
       │      SLA: <200ms
       │      Melhor: Classificação, extração, formato
       │
       └─ Dados sensíveis?
          ├─ SIM → Modelo local ou Claude
          │        (nunca Groq)
          │
          └─ NÃO → Qualquer um
                   (otimize por custo)
```

---

---

# ✅ CHECKLIST: IMPLEMENTAR NOVO AGENTE

Use este checklist SEMPRE que criar agente:

```
╔═══════════════════════════════════════════════════╗
║      FASE 0: CONCEITO (antes de codificar)       ║
╚═══════════════════════════════════════════════════╝

☐ Define nome + emoji + referência pop
  Exemplo: "WANDA 🔴 (WandaVision)"

☐ Define 1 responsabilidade primária (não mais)
  Exemplo: "Planeja conteúdo social mensal"

☐ Define KPI (como medir sucesso)
  Exemplo: "Planejamento pronto em <4h, 90% aprovação"

☐ Escolhe IA usando árvore de decisão
  Exemplo: "Groq Free (rápido, criatividade média)"

☐ Define hierarquia (reporta a quem)
  Exemplo: "Reporta ao TOT"

☐ Escreve DNA no papel/rascunho
  (Não precisa ser perfeito ainda)


╔═══════════════════════════════════════════════════╗
║        FASE 1: DOCUMENTAÇÃO (Alexandria)         ║
╚═══════════════════════════════════════════════════╝

☐ Cria arquivo AGENTS/[nome].md
  Conteúdo: DNA completo

☐ Escreve POP (8 componentes)
  Trigger, Input, Processo, Output, Erros, SLA, Permissões, Testes

☐ Cria arquivo prompts/[nome].md
  Conteúdo: System prompt estruturado (DNA do prompt)

☐ Define exemplos reais (3+ casos)
  Entrada → Processamento → Saída esperada

☐ Define métricas/KPIs
  Latência, acurácia, volume, etc

☐ Registra tags
  #categoria #subcategoria (pra busca rápida)

☐ Registra em AGENTS.md (índice geral)
  Adiciona linha na tabela com status


╔═══════════════════════════════════════════════════╗
║       FASE 2: DESENVOLVIMENTO (Testar Prompt)    ║
╚═══════════════════════════════════════════════════╝

☐ Estrutura prompt base com atalhos Claude
  /ghost, artifacts, OODA, L99, /god mode (se aplicável)

☐ Testa com 3 cenários REAIS (não fictícios)
  Scenario 1: Happy path (tudo OK)
  Scenario 2: Edge case (dados incompletos)
  Scenario 3: Erro (falha deliberada)

☐ Valida formato output
  Verifica se JSON/estrutura está correto

☐ Define fallback automático
  Se IA principal falhar → qual é a IA alternativa?

☐ Configura alertas (Slack/WhatsApp)
  Quem é notificado se agente falhar?


╔═══════════════════════════════════════════════════╗
║      FASE 3: INTEGRAÇÃO (n8n + Alexandria)       ║
╚═══════════════════════════════════════════════════╝

☐ Testa com n8n webhook
  Fluxo completo: trigger → execução → output

☐ Integra com Alexandria (GILES)
  Agente consegue buscar contexto do cliente?

☐ Testa permissões
  Pode ler dados que precisa?
  Não consegue acessar dados que não deve?

☐ Configura SLA
  Latência máxima esperada em segundos

☐ Testa com dados reais
  Roda com cliente verdadeiro (em staging)


╔═══════════════════════════════════════════════════╗
║        FASE 4: VALIDAÇÃO (Pré-Deploy)            ║
╚═══════════════════════════════════════════════════╝

☐ Passa checklist (Regra 6)
  Todos os 11 itens OK?

☐ Testes de carga
  Múltiplas chamadas paralelas funcionam?
  Performance mantém sob carga?

☐ Valida com Kimi Totum
  POP está OK? SLA faz sentido?

☐ GILES indexou documentação
  Alexandria consegue encontrar este agente?

☐ Revisa documentação completa
  DNA, POP, Prompt, Exemplos, Métricas, Changelog, Testes


╔═══════════════════════════════════════════════════╗
║           FASE 5: DEPLOY (Go Live)               ║
╚═══════════════════════════════════════════════════╝

☐ Commit em Git com mensagem clara
  git commit -m "feat: agente [NOME] v1.0"

☐ Versiona como v1.0
  Tag: [NOME]-v1.0

☐ Notifica time
  Slack: "Novo agente [NOME] em produção"

☐ Monitora métricas primeiras 48h
  Latência OK? Taxa de sucesso OK? Erros?

☐ Documenta deployment
  Data, hora, changelog da versão


╔═══════════════════════════════════════════════════╗
║      FASE 6: MELHORIA CONTÍNUA (ABED Loop)       ║
╚═══════════════════════════════════════════════════╝

☐ Coleta feedback (Regra 8)
  Funcionou bem? Precisa ajustar?

☐ Analisa métricas diariamente (Liz)
  Latência aumentou? Taxa de erro subiu?

☐ Refatora POP/prompt conforme feedback
  Identifica padrões, melhora instruções

☐ Versionamentos (v1.1, v1.2, etc)
  Cada melhoria = novo version

☐ Documenta learnings em Alexandria
  O que aprendemos com este agente?
```

---

---

# 📌 TEMPLATE RÁPIDO: CRIAR AGENTE EM 5 MIN

Use este template para capturar conceito rapidamente:

```markdown
# [NOME_AGENTE] — [EMOJI]

## 1. DNA (Identidade)
- **Nome:** [Nome único]
- **Emoji:** [Emoji único]
- **Referência:** [Personagem Pop + por quê]
- **Job:** [O que faz em 1 frase]
- **IA:** [Escolher via árvore de decisão]
- **Nível:** [1-Ponta / 2-Médio / 3-Mecânico]

## 2. Inputs
```json
{
  "exemplo_campo": "tipo + descrição"
}
```

## 3. Outputs
```json
{
  "resultado": "tipo + descrição"
}
```

## 4. Regras (DNA do Prompt)
- Regra 1: [Comportamento esperado]
- Regra 2: [Restrição importante]
- Regra 3: [Permissão clara]

## 5. Trigger
- Automático: [Se sim, horário]
- Manual: [Se sim, por quem]
- Webhook: [Se sim, qual evento]

## 6. Teste Rápido
```
Caso 1 (Happy path): [Input] → [Output esperado] ✅/❌
Caso 2 (Edge case):  [Input] → [Output esperado] ✅/❌
```
```

**Tempo total para preencher:** ~5 minutos

---

---

# 🎬 EXEMPLOS PRÁTICOS

## Exemplo 1: Criar Agente WANDA (Planejador Social)

**Usando as 10 regras:**

```
REGRA 1: Definição
  Nome: WANDA 🔴
  Referência: WandaVision
  Job: Planeja conteúdo social mensal
  Depto: Planejamento
  Reporta: TOT
  KPI: Planejamento <4h, aprovação >90%

REGRA 2: Seleção IA (Árvore)
  → Precisa contexto longo? NÃO
  → Rápida (<2s)? SIM → Groq Free
  → IA: Groq Free (Mixtral 8x7B)
  → Fallback: Claude 3.5 Sonnet

REGRA 3-4: DNA + POP
  [Documentado em AGENTS/wanda.md]

REGRA 5: Integração Alexandria
  ✅ AGENTS/wanda.md criado
  ✅ AGENTS/prompts/wanda.md criado
  ✅ Tags: #planejamento #conteudo
  ✅ Registrado em AGENTS.md

REGRA 6: Validação
  ✅ Testado com 3 clientes reais
  ✅ POP completo (8 pontos)
  ✅ KPI: <4h latência
  ✅ Fallback: Claude pronto
  ✅ Alertas: Slack configurado
  ✅ SLA: 4 horas máximo

REGRA 7: Atalhos Claude
  Usar /ghost para humanização
  Usar L99 se precisar expertise profunda

REGRA 8: Melhoria Contínua
  Coletar feedback após primeira execução
  Ajustar prompt se taxa de aprovação <90%

REGRA 9: Documentação
  ✅ DNA.md, POP.md, Prompt.md, Exemplos.md
  ✅ Metricas.md, Changelog.md, Testes.md

REGRA 10: Comunicação
  WANDA envia resultado para TOT
  TOT roteia para Scrivo (copy)
  Todos acessam contexto via Alexandria
```

---

## Exemplo 2: Criar Agente RADAR_INSIGHTS (Pesquisador)

**Usando template 5-min:**

```markdown
# RADAR_INSIGHTS — 📡

## 1. DNA
- Nome: Radar de Insights
- Emoji: 📡
- Referência: Data (Marvel) — processa informação em tempo real
- Job: Extrai insights de tendências (TikTok, blogs, artigos)
- IA: Qwen3 (Ollama local)
- Nível: 3-Mecânico

## 2. Inputs
```json
{
  "fonte": "tiktok|blog|twitter|newsletter",
  "tema": "string (topic to search)",
  "limite": "number (max results)"
}
```

## 3. Outputs
```json
{
  "insights": [
    {
      "titulo": "string",
      "resumo": "string",
      "fonte": "string",
      "link": "url",
      "relevancia": "1-10"
    }
  ]
}
```

## 4. Regras
- Buscar apenas fontes confiáveis
- Descartar conteúdo genérico/clickbait
- Resumir em máximo 3 frases

## 5. Trigger
- Automático: 22:00 CST (noite)
- Manual: Por Israel via TOT

## 6. Teste
- Caso 1: Buscar "automação marketing" → 5 insights ✅
- Caso 2: Buscar tema vago → Pedir clarificação ✅
```

---

# 🚀 CHECKLIST FINAL

Antes de marcar seu agente como "PRONTO":

```
☐ Tenho nome + emoji único?
☐ Tenho 1 job bem definido?
☐ Escolhi IA certa (via árvore)?
☐ Documentei POP (8 pontos)?
☐ Testei com dados reais?
☐ Defini fallback?
☐ Registrei em Alexandria?
☐ Passei validation checklist (11 itens)?
☐ Notifiquei o time?
☐ Monitorei 48h iniciais?
```

**Só quando TODOS os checkboxes estão marcados:**
```
Status: ✅ ATIVO (pronto para produção)
```

---

**FIM DO FRAMEWORK**

Este é o guia completo para criar QUALQUER agente na Totum.

Siga as 10 regras, use a árvore de decisão, faça o checklist.

Pronto! 🚀
