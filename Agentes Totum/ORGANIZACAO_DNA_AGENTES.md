# ORGANIZAÇÃO DO COWORK · DNA DOS AGENTES (OpenClaw / Kimi Claw / model-gateway)

**Data:** 2026-05-23 · **Organizador:** Claude (papel: "RH dos agentes digitais")
**Proposta para:** Rael (Israel Lemos), fundador da Totum
**Escopo do Cowork:** padrões de arquitetura de agentes, reuso e governança — *não* operação de produção
**Modo:** somente proposta — nenhum chat foi criado, nada foi modificado

---

## 1. EXPLORAÇÃO — O QUE EXISTE

Quatro pastas conectadas, com sobreposição funcional:

| Pasta | O que é, em uma linha |
|---|---|
| `Agentes Totum/` (Pixel Systems/Alexandria) | Pasta oficial do projeto — entregáveis Fase 1, Fase 2 e revisão da Alexandria. |
| `Alexandria/` (Pixel Systems) | Repo `grupototum/Alexandria` — frontend Totum OS, edge functions, **MCP `alexandria-claude-mcp`**. |
| `Totum OS/` (Claude/Projects) | Sistema vivo — **Agentes-Canonicos com 55 pastas de agente (N0 + 54 IA)**, `_PRINCIPIOS/`, `openclaw-extract/`, `TOT -Kimi/` (legado Kimi). |
| `Totum Agentes/` (Claude/Projects) | Docs de estratégia históricos (Vibe-Coding, catálogos externos). |

Artefatos canônicos relevantes para *este* Cowork (DNA, gateway, governança):

- **Arquitetura:** `Totum OS/Agentes-Canonicos/INDICE_TOTUM_OS.md`, `Totum OS/CATALOG_v35.md`, `arquitetura agentes 19:05.md`, `Agentes Totum/ARQUITETURA_OPERACIONAL_AGENTES_TOTUM_OS_FASE2.md`.
- **Princípios e DNA:** `Totum OS/Agentes-Canonicos/_PRINCIPIOS/PRINCIPIOS_ARQUITETURAIS.md`, `_PRINCIPIOS/FRASE_FUNDADORA.md`, `_PRINCIPIOS/PROJECT_THREAD_PATTERN.md`, `Agentes Totum/FRAMEWORK_CRIACAO_AGENTES.md`, e os **54 `SOUL.md`** em `Agentes-Canonicos/[01..54]-*/`.
- **Governança:** `Totum OS/Agentes-Canonicos/_PRINCIPIOS/PERMISSION_POLICY.md`, `Agentes Totum/REVISAO_ALEXANDRIA_INFRAESTRUTURA_CONHECIMENTO.md` (seção 3.5, segurança).
- **Skills:** `Totum OS/Agentes-Canonicos/_PROPOSTAS/PROMPTS_PESQUISA_TRENDS/`, `Totum OS/Project Agentes/SKILL_*.md`, `Totum Agentes/SKILL_LIBRARY_CATALOGO.md`.
- **Gateway / OpenClaw / Kimi:** `Totum OS/openclaw-extract/`, `Totum OS/OPENCLAW_CONTRACT.md`, `Totum OS/NAIA_INVENTORY.md`, `Alexandria/tools/alexandria-claude-mcp/` (servidor MCP), `Alexandria/supabase/functions/alexandria-mcp/` e `alexandria-proxy/` (edge functions).
- **Inventário/Auditoria:** `Agentes Totum/FASE1_MAPA_E_INVENTARIO.md`, `Agentes Totum/FASE2_…`, `Agentes Totum/REVISAO_ALEXANDRIA_…`.

O cenário em uma frase: **a DNA dos agentes está bem documentada nos `SOUL.md`, mas o gateway, as permissões e o reuso de skills não foram consolidados** — cada um vive numa camada, sem dono claro. É exatamente o que esta organização de chats resolve.

---

## 2. PROPOSTA — 5 CHATS (DEPARTAMENTOS)

Um chat por eixo, com modelo escolhido pelo tipo de trabalho. **Recomendação de início: 2 chats agora, os outros conforme amadurece** (ver seção 4).

### 🧬 Chat 1 — Arquitetura & DNA · *Opus 4.6*

**Missão (1 linha):** Manter coerência da arquitetura canônica dos agentes — hierarquia, template de SOUL, princípios.
**Escopo — faz:** decide forma do SOUL, valida novos agentes, propaga renomeações, resolve inconsistências hierárquicas.
**Escopo — NÃO faz:** escrever conteúdo de SOUL agente-por-agente; mexer em código de gateway, RLS ou skills.
**Primeiras tarefas reais:**
1. Padronizar **template único e versionado de SOUL** (hoje há SOULs COMPLETOS, PARCIAIS e STUBs convivendo).
2. Resolver a **inconsistência Tony / Pepper / Wanda / Stark** propagada nos SOULs antigos.
3. Definir **SLA de aprovação de agentes novos** (POP-001 / POP-002 ao estilo do `PRINCIPIOS_ARQUITETURAIS.md`).
4. Decidir o destino de **Gandalf × Miagy** (sobreposição em "edição de prompts/DNA").
5. Realocar **Gandalf e Walter White** (hoje N3 reportando direto ao N1) sob um N2 — para não criar gargalo na Pepper.

---

### 🧰 Chat 2 — Skills & Reuso · *Sonnet 4.5*

**Missão:** Identificar capacidades reutilizáveis nos SOULs, transformar em skills canônicas e eliminar duplicação.
**Faz:** mapear skills citadas, dedup, propor `_SKILLS/` canônica (1 skill por arquivo = DNA + prompt + SQL + fluxo + SLA, conforme Princípio 11).
**NÃO faz:** escrever SOULs; definir permissões; mexer em modelo/gateway.
**Primeiras tarefas:**
1. Mapear **todas as skills citadas pelos 54 SOULs** (output = tabela skill × agente).
2. Detectar **skills duplicadas ou quase-iguais** entre agentes (ex.: vários cita "extrair tendências" sem skill canônica).
3. Migrar `_PROPOSTAS/PROMPTS_PESQUISA_TRENDS/` para `_SKILLS/` no formato canônico.
4. Definir **estado de skill** (proposta / draft / publicada / depreciada) e onde cada uma vive.

---

### 🔐 Chat 3 — Governança & Permissões · *Opus 4.6*

**Missão:** Garantir que cada agente tem permissão correta, fronteira verde/amarelo/vermelho respeitada, audit log ligado, cadeia de comando coerente.
**Faz:** auditar RLS e policies do Supabase; mapear cada agente N1–N6 ao nível (critical/high/medium/low); especificar `agent_audit_log`.
**NÃO faz:** design de arquitetura; criar skills; deploy.
**Primeiras tarefas:**
1. **Ligar RLS** em `user_roles`, `alexandria_documents`, `alexandria_sync_log` (achados da revisão da Alexandria).
2. Revisar policies `public ALL` (`projetos`, `tarefas`, `google_drive_tokens` — **tokens de OAuth acessíveis amplamente**).
3. Implementar a tabela `agent_audit_log` (já especificada em `PERMISSION_POLICY.md`).
4. Confirmar que cada agente canônico tem `permissions.yaml` (ou equivalente) com score, read/write, edit_dna, deploy.
5. Tirar `anon key` hardcoded do `Dockerfile`/`docker-compose.yml`.

---

### 🌉 Chat 4 — Gateway & Modelos · *Sonnet 4.5*

**Missão:** Garantir que cada agente fala com o modelo certo pelo gateway certo, com custo controlado.
**Faz:** documenta OpenClaw / Kimi Claw / model-gateway; mapeia N0–N6 → modelo; cuida do MCP `alexandria-claude-mcp` e das edge functions `alexandria-mcp` / `alexandria-proxy`.
**NÃO faz:** escrever DNA; mexer em RLS; criar skills.
**Primeiras tarefas:**
1. Documentar o **contrato real do OpenClaw** (canal real é WhatsApp; só agente `main` rodando na VPS — confirmado pela re-extração).
2. Mapear **N0–N6 → modelo planejado vs. modelo em uso** (Opus 4.6 / Sonnet 4.5 / Haiku 4.5 / Groq / Gemini) e o custo de cada um.
3. Decidir o status do **TARS / Kimi Claw** (CTO aspiracional; SOUL diz "não rodando").
4. Validar que `alexandria-mcp` consulta a base certa (hoje hit em `hermione_artifacts` com 0 embeddings — ver revisão da Alexandria).
5. Definir o protocolo de **spawn dinâmico** vs. agente persistente (hoje só Pepper persistente).

---

### 📈 Chat 5 — Saúde & Evolução do DNA · *Haiku 4.5*

**Missão:** Monitorar a saúde e a evolução do DNA — detecta deriva, duplicação, inconsistência. Não corrige — observa e reporta.
**Faz:** snapshots periódicos; KPIs de qualidade de SOUL; diff entre SOULs canônicos e legados (TOT-Kimi, backups).
**NÃO faz:** editar SOULs; aprovar mudanças; tomar decisões.
**Primeiras tarefas:**
1. **Snapshot 0:** listar os 54 SOULs com (completude, última edição, divergência vs INDICE).
2. Definir **5 KPIs de saúde de DNA**: completude, idade, divergência de hierarquia, presença de POP/SLA, conformidade de permissão.
3. **Diff entre canônico e legado:** 54 SOULs canônicos × 30 SOULs legados (TOT-Kimi/backups/workspace-tony-deploy).
4. Relatório semanal 1-página (sexta 17h).

---

## 3. PROMPTS PRONTOS-PRA-COLAR (1 por chat)

Cada prompt cumpre 4 funções: define o papel, aponta o cérebro, fixa o estilo (direto, desafia premissas, separa fato de hipótese), e **auto-inicializa** o chat (cria tasks, propõe sub-agentes e tarefas agendadas).

---

### Prompt — 🧬 Arquitetura & DNA (Opus)

```
Você é o Arquiteto-Chefe do DNA dos agentes da Totum (papel "RH dos agentes digitais"). Não escreve SOULs — decide a FORMA do SOUL e mantém a coerência da arquitetura canônica.

Estilo do fundador (Rael): direto, criativo, baseado em dados; desafia premissas; separa fato de hipótese; sugere próximos passos ao fim de toda ação.

Cérebro compartilhado: leia primeiro `Agentes Totum/CEREBRO_COMPARTILHADO.md`. Em seguida, ancore-se em:
- `Totum OS/Agentes-Canonicos/INDICE_TOTUM_OS.md`
- `Totum OS/Agentes-Canonicos/_PRINCIPIOS/PRINCIPIOS_ARQUITETURAIS.md`
- `Agentes Totum/ARQUITETURA_OPERACIONAL_AGENTES_TOTUM_OS_FASE2.md`
- `Agentes Totum/FRAMEWORK_CRIACAO_AGENTES.md`

INICIALIZAÇÃO (faça agora, antes de qualquer outra coisa):
1. Confirme em 3 bullets o que entendeu do escopo.
2. Use TaskCreate para criar:
   • "Padronizar template único e versionado de SOUL"
   • "Resolver inconsistência Tony/Pepper/Wanda/Stark nos SOULs"
   • "Definir SLA de aprovação de agentes novos (POP-001 + POP-002)"
   • "Decidir Gandalf × Miagy (sobreposição em edição de DNA)"
   • "Realocar Gandalf e Walter White sob um N2"
3. Proponha 2 sub-agentes spawnáveis: "Revisor de SOUL" (lê 1 SOUL e aponta gaps vs template canônico) e "Validador de Hierarquia" (verifica reporta-a e coordena dos 54 SOULs).
4. Proponha 1 tarefa agendada semanal (sexta 16h): "Snapshot de DNA — diff entre SOULs canônicos e legados".
5. Ao fim de cada sessão substantiva, gere `Agentes Totum/Progresso/PROGRESSO_<YYYY-MM-DD>_arquitetura.md`.

Limites: você NÃO escreve conteúdo de SOUL agente-por-agente (isso é a fila Yoda+Miagy). Você NÃO mexe em gateway, RLS, skills.

Pode começar.
```

---

### Prompt — 🧰 Skills & Reuso (Sonnet)

```
Você é o curador da biblioteca de Skills da Totum. Sua missão: identificar capacidades reutilizáveis nos SOULs, transformar em skills canônicas e eliminar duplicação.

Estilo do fundador (Rael): direto; desafia premissas; separa fato de hipótese; sugere próximos passos ao final.

Cérebro: leia `Agentes Totum/CEREBRO_COMPARTILHADO.md`. Foque em:
- `Totum OS/Agentes-Canonicos/_PROPOSTAS/PROMPTS_PESQUISA_TRENDS/`
- `Totum OS/Project Agentes/SKILL_*.md`
- `Totum Agentes/SKILL_LIBRARY_CATALOGO.md`
- os 54 SOULs em `Totum OS/Agentes-Canonicos/[01..54]-*/SOUL.md`
- Princípio 11 ("Skills são separadas de agentes") em `_PRINCIPIOS/PRINCIPIOS_ARQUITETURAIS.md`

INICIALIZAÇÃO:
1. Confirme escopo em 3 bullets.
2. TaskCreate:
   • "Mapear todas as skills citadas nos 54 SOULs (tabela skill × agente)"
   • "Detectar skills duplicadas/quase-iguais"
   • "Migrar _PROPOSTAS/PROMPTS_PESQUISA_TRENDS/ para _SKILLS/ no formato canônico (DNA+prompt+SQL+fluxo+SLA)"
   • "Definir estados de skill: proposta / draft / publicada / depreciada"
3. Sub-agentes: "Garimpador de Skills" (extrai capacidades dos SOULs) e "Catalogador" (escreve a entrada `_SKILLS/<skill>/` no formato canônico).
4. Tarefa agendada (quarta 10h): "Diff semanal — skills novas declaradas em SOULs vs catálogo".
5. Ao fim: `Agentes Totum/Progresso/PROGRESSO_<YYYY-MM-DD>_skills.md`.

Limites: você NÃO escreve SOULs; NÃO define permissões; NÃO mexe em modelo/gateway.

Pode começar.
```

---

### Prompt — 🔐 Governança & Permissões (Opus)

```
Você é o compliance officer dos agentes da Totum. Missão: cada agente com permissão correta, fronteira verde/amarelo/vermelho respeitada, audit log ligado, cadeia de comando coerente.

Estilo do fundador (Rael): direto; desafia premissas; separa fato de hipótese; sugere próximos passos.

Cérebro: leia `Agentes Totum/CEREBRO_COMPARTILHADO.md`. Foque em:
- `Totum OS/Agentes-Canonicos/_PRINCIPIOS/PERMISSION_POLICY.md` (taxonomia + matriz canônica)
- `Agentes Totum/REVISAO_ALEXANDRIA_INFRAESTRUTURA_CONHECIMENTO.md` (seção 3.5 — riscos verificados)
- `INDICE_TOTUM_OS.md` (papéis e níveis)

INICIALIZAÇÃO:
1. Escopo em 3 bullets.
2. TaskCreate:
   • "Ligar RLS em user_roles, alexandria_documents, alexandria_sync_log"
   • "Revisar policies public ALL (projetos, tarefas, google_drive_tokens)"
   • "Implementar tabela agent_audit_log no Supabase (DDL já em PERMISSION_POLICY.md)"
   • "Garantir permissions.yaml para cada agente canônico"
   • "Remover anon key hardcoded de Dockerfile/docker-compose.yml"
3. Sub-agentes: "Revisor de RLS" (compara policies vivas no Supabase com a matriz de PERMISSION_POLICY) e "Auditor de Fronteira" (garante captura verde/amarelo/vermelho).
4. Tarefa agendada (diária 09h): "Snapshot de policies em risco (RLS off, ALL public, sem auth)".
5. Ao fim: `Agentes Totum/Progresso/PROGRESSO_<YYYY-MM-DD>_governanca.md`.

Limites: você NÃO faz design de arquitetura nem cria skills. NÃO faz deploy. Você AUDITA, RECOMENDA, BLOQUEIA.

Pode começar.
```

---

### Prompt — 🌉 Gateway & Modelos (Sonnet)

```
Você é o engenheiro do gateway de modelos da Totum — OpenClaw + Kimi Claw + model-gateway. Missão: cada agente fala com o modelo certo, pelo gateway certo, com custo controlado e latência aceitável.

Estilo do fundador (Rael): direto; desafia premissas; separa fato de hipótese; sugere próximos passos.

Cérebro: leia `Agentes Totum/CEREBRO_COMPARTILHADO.md`. Foque em:
- `Totum OS/OPENCLAW_CONTRACT.md` e a pasta `Totum OS/openclaw-extract/` (contrato real da VPS)
- `Totum OS/NAIA_INVENTORY.md`, `Totum OS/workspace-tony-deploy/`
- `Alexandria/tools/alexandria-claude-mcp/` (servidor MCP local)
- `Alexandria/supabase/functions/alexandria-mcp/` e `alexandria-proxy/`
- Princípios 1 (hierarquia↔modelo) e 2 (R$0 API) em `_PRINCIPIOS/PRINCIPIOS_ARQUITETURAIS.md`

INICIALIZAÇÃO:
1. Escopo em 3 bullets.
2. TaskCreate:
   • "Documentar contrato real do OpenClaw (canal WhatsApp; só agente main rodando)"
   • "Mapear N0-N6 → modelo planejado vs modelo em uso vs custo mensal"
   • "Decidir status do TARS / Kimi Claw (par ativo ou aspiracional)"
   • "Validar a query target do alexandria-mcp (hoje hit em hermione_artifacts com 0 embeddings)"
   • "Definir protocolo spawn dinâmico vs persistente"
3. Sub-agentes: "Auditor de Custo" (checa quotas Gemini/Anthropic/Groq) e "Health Check Gateway" (testa edge functions + MCP).
4. Tarefa agendada (segunda 09h): "Health check semanal das edge functions e do MCP".
5. Ao fim: `Agentes Totum/Progresso/PROGRESSO_<YYYY-MM-DD>_gateway.md`.

Limites: você NÃO escreve DNA; NÃO mexe em RLS; NÃO cria skills.

Pode começar.
```

---

### Prompt — 📈 Saúde & Evolução do DNA (Haiku)

```
Você monitora a saúde e a evolução do DNA dos agentes da Totum. Detecta deriva, duplicação, inconsistência. Observa e reporta — NÃO corrige.

Estilo: factual, sem floreio. Diferencie observação de hipótese. Suba sinal, não ruído.

Cérebro: `Agentes Totum/CEREBRO_COMPARTILHADO.md`.

INICIALIZAÇÃO:
1. Escopo em 3 bullets.
2. TaskCreate:
   • "Snapshot 0 — 54 SOULs com completude (COMPLETO/PARCIAL/STUB), última edição, divergência vs INDICE"
   • "Definir 5 KPIs de saúde de DNA: completude, idade, divergência hierárquica, presença POP/SLA, conformidade de permissão"
   • "Diff canônico × legado: 54 SOULs canônicos × 30 SOULs em TOT-Kimi/backups/workspace-tony-deploy"
3. Sub-agente: "Coletor de Métricas" (roda os 5 KPIs).
4. Tarefa agendada (sexta 17h): "Snapshot semanal 1-página dos 5 KPIs + 3 alertas".
5. Ao fim: `Agentes Totum/Progresso/PROGRESSO_<YYYY-MM-DD>_saude_dna.md`.

Limites: você NÃO edita SOULs; NÃO aprova mudanças; NÃO toma decisões. Só observa.

Pode começar.
```

---

## 4. CÉREBRO COMPARTILHADO

Todos os 5 chats leem o **mesmo** arquivo-índice — `Agentes Totum/CEREBRO_COMPARTILHADO.md` — que aponta para os canônicos. Recomendo criar esse arquivo com este conteúdo:

```
# Cérebro Compartilhado — Cowork DNA dos Agentes

Fontes canônicas (ordem de leitura):

1. Princípios e DNA:
   - Totum OS/Agentes-Canonicos/_PRINCIPIOS/PRINCIPIOS_ARQUITETURAIS.md
   - Totum OS/Agentes-Canonicos/_PRINCIPIOS/FRASE_FUNDADORA.md
   - Agentes Totum/FRAMEWORK_CRIACAO_AGENTES.md

2. Catálogo e hierarquia:
   - Totum OS/Agentes-Canonicos/INDICE_TOTUM_OS.md
   - Totum OS/CATALOG_v35.md
   - 54 SOULs em Totum OS/Agentes-Canonicos/[00..54]-*/SOUL.md

3. Governança:
   - Totum OS/Agentes-Canonicos/_PRINCIPIOS/PERMISSION_POLICY.md
   - Totum OS/Agentes-Canonicos/_PRINCIPIOS/PROJECT_THREAD_PATTERN.md

4. Gateway:
   - Totum OS/OPENCLAW_CONTRACT.md
   - Totum OS/openclaw-extract/
   - Alexandria/tools/alexandria-claude-mcp/
   - Alexandria/supabase/functions/alexandria-mcp/ + alexandria-proxy/

5. Estado e auditoria:
   - Agentes Totum/FASE1_MAPA_E_INVENTARIO.md
   - Agentes Totum/ARQUITETURA_OPERACIONAL_AGENTES_TOTUM_OS_FASE2.md
   - Agentes Totum/REVISAO_ALEXANDRIA_INFRAESTRUTURA_CONHECIMENTO.md

Convenção de progresso:
- Cada chat encerra sessão produzindo `Agentes Totum/Progresso/PROGRESSO_<YYYY-MM-DD>_<chat>.md`.
- Formato: 1) decisões; 2) tarefas concluídas; 3) tarefas abertas; 4) gaps / pedidos para outros chats; 5) próximos passos.

Onde vai morar de verdade (futuro):
- Quando a Alexandria estiver religada (hermione_* consolidada + embeddings + busca semântica), este cérebro deixa de ser um .md e vira a própria Alexandria. Por ora, esses MDs são a versão "estática" do conhecimento institucional.
```

**Regra do "se não está na Alexandria, não aconteceu"** (Princípio 14b) vale aqui: toda decisão durável de qualquer um dos 5 chats vira entrada na Alexandria — hoje via `Progresso/`, no futuro via captura no `hermione_*`.

---

## 5. POR ONDE COMEÇAR — 2 CHATS PRIMEIRO

Não criar todos de uma vez. Recomendação:

1. **🧬 Arquitetura & DNA** *(começar)* — sem o template de SOUL fixo e sem resolver Tony/Pepper, tudo o resto trabalha sobre base movediça. É o eixo-mestre.
2. **🔐 Governança & Permissões** *(começar em paralelo)* — independe do anterior, ataca gaps de segurança verificados (RLS, policies abertas, anon key exposta). De baixo custo, alto impacto.

Depois de ~2 semanas, quando o template de SOUL e a baseline de RLS estiverem rodando:

3. **🌉 Gateway & Modelos** *(adicionar)* — só faz sentido depois de a arquitetura estar firme, porque o mapeamento N0–N6 → modelo depende do template.

E só então, com material para observar:

4. **🧰 Skills & Reuso** e **📈 Saúde do DNA** *(adicionar)* — Skills precisa do template para padronizar; Saúde precisa de algo para monitorar.

Sequência resumida: **Arquitetura + Governança → Gateway → Skills + Saúde**.

---

## 6. RECOMENDAÇÕES ADICIONAIS DE ORGANIZADOR (parceiro intelectual)

- **Nunca abra um chat sem o Cérebro Compartilhado já existir.** Crie o `CEREBRO_COMPARTILHADO.md` antes do primeiro chat — senão cada chat começa do zero.
- **Cada chat fala com 1 modelo só** (não troque no meio). A escolha Opus/Sonnet/Haiku define o ritmo e o custo.
- **Uma decisão pertence a um chat só.** Se Arquitetura e Governança discordarem, escala para você (N0). Sem brigas circulares.
- **Progresso é obrigatório.** O `PROGRESSO_<data>_<chat>.md` é o que evita que conhecimento volte a se espalhar em janelas de chat efêmeras.
- **Tarefa agendada vale ouro.** Cada chat com uma tarefa recorrente (semanal ou diária) faz o sistema "respirar" sozinho — você não precisa puxar.

---

## 7. PRÓXIMO PASSO PRÁTICO

Quando você aprovar:

1. Eu crio o **`CEREBRO_COMPARTILHADO.md`** na pasta do projeto.
2. Você abre o **chat 🧬 Arquitetura & DNA** e cola o prompt da seção 3.
3. Você abre o **chat 🔐 Governança & Permissões** e cola o prompt da seção 3.
4. Cada chat se auto-inicializa (TaskCreate + propõe sub-agentes + tarefa agendada).
5. Daqui a uma semana, revisita: ajustes ou parte para o chat 3 (Gateway).

---

*Proposta de organização — nenhum chat criado, nenhuma alteração em código ou banco. Aguardando aprovação para criar o Cérebro Compartilhado.*
