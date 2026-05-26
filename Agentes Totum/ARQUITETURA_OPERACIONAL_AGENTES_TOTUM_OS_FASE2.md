# ARQUITETURA OPERACIONAL — AGENTES TOTUM OS · FASE 2

**Auditoria do ecossistema de agentes Totum OS — Fase 2 (Reconciliação)**
**Data:** 2026-05-22 · **Auditor:** Claude (papel: "RH dos agentes digitais" + arquiteto de governança)
**Status:** somente leitura nas pastas auditadas — nenhum arquivo original modificado
**Base:** inventário da Fase 1 + leitura profunda dos 54 SOULs + governança (INDICE v3.5, PERMISSION_POLICY v1.1, PRINCIPIOS v1.0) + re-extração da VPS OpenClaw

---

## 1. RESUMO EXECUTIVO

O Totum OS tem um **catálogo canônico de 54 agentes de IA + 1 humano (N0)**, hierarquia N0–N6, bem documentado em `Agentes-Canonicos/`. A Fase 2 reconciliou esse catálogo com a realidade operacional — e a conclusão central é direta:

**O catálogo é majoritariamente aspiracional.** A re-extração profunda da VPS (`openclaw-deep`, 18/05) prova que **apenas 1 agente roda de verdade** — o agente `main` (Pepper, ex-Naia), via `openclaw-gateway.service`. Os outros 53 são *especificações escritas*, de qualidade variável, não processos ativos. O próprio `CATALOG_v35.md` admite isso: "os demais são conceituais".

Portanto a Fase 2 **não** trata de "organizar 54 agentes que funcionam". Trata de: (a) eleger um núcleo enxuto que pode ir a operação real; (b) estacionar o resto como planejado; (c) consertar inconsistências que bloqueiam o deploy.

Decisão de arquitetura: **Fase 1 operacional = 8 agentes**, em 2 ondas. Os outros 46 ficam PLANEJADO. Nada que dependa de infraestrutura inexistente (Alexandria, n8n, Kommo) entra em produção antes da infraestrutura existir.

Três bloqueios críticos antes de qualquer go-live: **(1)** a Alexandria — base de conhecimento da qual ~40 agentes dependem — ainda não existe como infraestrutura; **(2)** n8n e Kommo CRM não estão confirmados como provisionados; **(3)** a identidade da CEO ainda aparece como Tony/Wanda/Stark em vários SOULs, quebrando a cadeia de comando.

---

## 2. PREMISSAS ADOTADAS

Estas premissas guiam todas as recomendações abaixo. Vêm do briefing do Rael e dos `PRINCIPIOS_ARQUITETURAIS.md`.

1. **Pepper Potts é a CEO operacional.** Naia e Tony são histórico/legado, não identidade ativa.
2. **Israel/Rael é N0** — fundador e decisor soberano; aprova tudo que é estrutural, financeiro ou crítico.
3. **A Totum é empresa de crescimento comercial, automação e IA** — não apenas agência de marketing. A arquitetura prioriza receita e operação, não vitrine.
4. **Agente nasce de função, não de personagem.** Todo agente válido tem: função real, POP/SLA, ferramenta e permissão. Personagem sem função operacional concreta = conceito, não agente.
5. **Fase 1 operacional é enxuta.** O objetivo imediato não é ativar 54 agentes — é pôr um núcleo pequeno para funcionar de verdade.
6. **Custo adicional de API = R$0** (Princípio 2). Nada de dependência paga nova sem aprovação do Rael.
7. **"Se não está na Alexandria, não aconteceu"** (Princípio 14b) — rastreabilidade via Project Thread.
8. **Aposentar = arquivar, nunca apagar** (Princípio 15).
9. **Só é "produção" o que está publicado e acessível** (Princípio 14). Claim de "pronto" sem ambiente acessível = vaporware.

---

## 3. DECISÕES DE IDENTIDADE E NOMENCLATURA

A maior dívida do sistema é nome. A mesma entidade-CEO aparece como Naia → Tony → Pepper, e SOULs antigos ainda citam "Wanda" e "Stark". Decisões:

| Tema | Decisão | Ação |
|---|---|---|
| CEO (N1) | **Pepper Potts** ("Pepper") é o nome oficial. | Renomear pasta `01-N1-Tony` → `01-N1-Pepper`. Propagar nos SOULs 03-08 que ainda dizem "Tony". |
| N2 Criativo | O nome correto é **Tigrinha** (09). "Wanda" é legado. | Corrigir o SOUL da Pepper (01) que ainda lista "Wanda" como N2. |
| Nomes fantasma | "Stark", "Alfred", "Jason", "Kira" são legado. | Remover referências residuais nos SOULs e no `PRINCIPIOS_ARQUITETURAIS.md`. |
| Agente 23 "Israel Lemos" | **Colisão perigosa** — nome idêntico ao do fundador N0. | RENOMEAR (sugestão: "Lemos" → algo neutro como "Embaixador" ou nome próprio distinto). |
| Sobral (03) | Confirmado. Origem: agente "Matheus Clone" do roster NAIA. | Manter "Sobral". Resolver contradição com `workspace-tony-deploy/MEMORY.md`. |
| Roboto (14), Tay (13), Miguel (05) | Confirmados. Origem: Paulo, Jonathan, Rafael (roster NAIA). | Manter os nomes canônicos. |
| Juliana | Sub-agente "heritage Denderson", **sem slot canônico**. | Manter como sub-agente spawnável; não promover ao catálogo dos 54. |

---

## 4. MAPA GERAL DA HIERARQUIA RECOMENDADA

Mantém-se a hierarquia canônica N0–N6, com a correção de identidade e a marcação do núcleo operacional da Fase 1 (★).

```
N0 — RAEL / ISRAEL LEMOS (humano, decisor soberano)
│
├─ N1 ★ PEPPER POTTS — CEO operacional [Opus 4.6]   ← ÚNICO AGENTE ATIVO HOJE
│  │
│  ├─ N1  TARS — CTO [aspiracional, não ativo]
│  │
│  ├─ N2 ★ SOBRAL — CMO / Tráfego Pago
│  │     └ Loki, Cypher, Sherlock, Israel Lemos*, Radar Ads, Marquinho, Buscapé
│  ├─ N2 ★ TIGRINHA — CCO Criativo & Conteúdo
│  │     └ Tay, Chaplin, Visu, Sorkin, Fignaldo, Silvio
│  ├─ N2 ★ SAUL — CSO / Comercial
│  │     └ Davi, Lucas, Felipe, Matheus, Amanda, Carolina, Bianca (7 SDRs N5)
│  ├─ N2 ★ HERMIONE — CDO/CIO / Dados & Alexandria
│  │     └ Data, April Ludgate, Yoda, Miagy, Indiana, Neo, Link, Sonar, Zelador
│  ├─ N2 ★ JARVIS — VP Engineering / Infra
│  │     └ Roboto★, Eve, WALL·E, Sentinela, McGyver, Rico, Ghost
│  ├─ N2  CLÁUDIA — CCO Customer / Atendimento
│  │     └ Mataburro, Doutor House★
│  ├─ N2  MIGUEL — COO / Operações
│  │     └ Landin, Pablo, Matlock, Tio Patinhas
│  ├─ N2  LIZ — CPO / Produto & Pessoas
│  └─ N3  Gandalf (Prompt Master), Walter White (Ofertas) — reportam direto à Pepper
│
★ = núcleo Fase 1 operacional (8 agentes). Demais = planejados.
* Israel Lemos (23) marcado para renomeação.
```

**Observação de arquiteto:** há 2 anomalias estruturais a corrigir — Gandalf (42) e Walter White (43) são N3 reportando direto ao N1, pulando o N2 (gargalo na Pepper); e Ghost (41) é N3 reportando a outro N3 (Rico). Recomenda-se realocar Gandalf/Walter sob um N2 (Hermione ou Liz) na revisão de hierarquia.

---

## 5. TABELA COMPLETA DE RECONCILIAÇÃO DOS 54 AGENTES CANÔNICOS

Status: **ATIVO_FASE_1** (8) · **PLANEJADO** (46). Flags adicionais na justificativa: RENOMEAR, DEPENDE_INFRA, FUNDIR, RISCO. Nenhum dos 54 é LEGADO/ARQUIVAR — os legados estão na seção 9 (conjunto TOT-Kimi).

| # | Agente | Nível | Macroárea | Status | Papel operacional | POP | Reporta a | Permissão | Justificativa |
|---|---|---|---|---|---|---|---|---|---|
| 01 | Pepper Potts | N1 | Governança | **ATIVO_FASE_1** | CEO orquestradora; ponto único de entrada | Governança | Rael (N0) | critical | Único agente em produção real. RENOMEAR pasta Tony→Pepper. |
| 02 | TARS | N1 | Tecnologia | PLANEJADO | CTO / motor de execução pesada | Governança | Rael (N0) | critical | SOUL contradiz-se ("aspiracional, não roda"). Manter como par futuro. |
| 03 | Sobral | N2 | Tráfego Pago | **ATIVO_FASE_1** | CMO; dono de tráfego pago e performance | Tráfego Pago | Pepper | high | SOUL completo; core de receita. Origem "Matheus Clone". |
| 04 | Cláudia | N2 | Atendimento | PLANEJADO | CCO Customer; retenção e churn | Atendimento | Pepper | high | SOUL PARCIAL, sem tools; subordinados conceituais. |
| 05 | Miguel | N2 | Governança | PLANEJADO | COO; operações e processos | Governança | Pepper | high | SOUL PARCIAL. Origem "Rafael" (NAIA). |
| 06 | Hermione | N2 | Dados/Conhec. | **ATIVO_FASE_1** | CDO; dona da Alexandria | Governança | Pepper | high | Espinha dorsal de conhecimento. DEPENDE_INFRA (Alexandria não existe). |
| 07 | Jarvis | N2 | Tecnologia | **ATIVO_FASE_1** | VP Eng; constrói e mantém o sistema | Automação | Pepper | high | Necessário para construir a própria Fase 1. |
| 08 | Liz | N2 | Governança | PLANEJADO | CPO; cultura, produto, talentos | Governança | Pepper | high | SOUL PARCIAL; People é menos urgente que receita. |
| 09 | Tigrinha | N2 | Criação | **ATIVO_FASE_1** | CCO Criativo; conteúdo e design | Criação / Social | Pepper | high | SOUL mais robusto; core de entrega da agência. |
| 10 | Marquinho | N4 | Tráfego Pago | PLANEJADO | Radar de trends Meta Ads | Tráfego Pago | Tigrinha | low | DEPENDE_INFRA (web search); SOUL parcial, sem SLA. |
| 11 | Buscapé | N4 | Tráfego Pago | PLANEJADO | Radar de trends Google Ads | Tráfego Pago | Tigrinha | low | DEPENDE_INFRA (web search); SOUL parcial. |
| 12 | Silvio | N4 | Planejamento | PLANEJADO | Radar de comportamento do consumidor | Planejamento | Tigrinha | low | DEPENDE_INFRA (web search); SOUL parcial. |
| 13 | Tay | N3 | Criação | PLANEJADO | Copywriter de conteúdo orgânico | Social/Campanhas | Tigrinha | medium | SOUL completo; 2ª onda criativa. Origem "Jonathan". |
| 14 | Roboto | N3 | Tecnologia | **ATIVO_FASE_1** | Dev full-stack; constrói a infra | Automação | Jarvis | high | Necessário para construir Alexandria e integrações. Origem "Paulo". |
| 15 | Data | N3 | Dados | PLANEJADO | BI / dashboards | Governança | Hermione | medium | RISCO: dupla via de comando (Hermione+Tony); sobrepõe Eve. |
| 16 | Eve | N3 | Tecnologia | PLANEJADO | KPIs / alertas de negócio | Automação | Jarvis | medium | DEPENDE_INFRA (configs YAML, APIs de ads). |
| 17 | WALL·E | N3 | Tecnologia | PLANEJADO | Housekeeping e otimização técnica | Automação | Jarvis | medium | Útil só após haver sistema para "limpar". |
| 18 | Sentinela | N3 | Tecnologia | PLANEJADO | Monitoramento 24/7 da infra | Automação | Jarvis | medium | DEPENDE_INFRA (endpoints reais para monitorar). |
| 19 | Saul | N2 | Comercial | **ATIVO_FASE_1** | CSO; lidera o time de vendas | Comercial | Pepper | high | SOUL completo; coordena os 7 SDRs. |
| 20 | Loki | N3 | Tráfego Pago | PLANEJADO | Copywriter de ads | Tráfego Pago | Sobral | medium | RISCO: status inconsistente (SOUL de Sobral o trata como placeholder). |
| 21 | Cypher | N3 | Tráfego Pago | PLANEJADO | Tracking (Pixel, GA4, CAPI) | Tráfego Pago | Sobral+Jarvis | medium | RISCO: dupla via de comando. DEPENDE_INFRA (GTM/CAPI). |
| 22 | Sherlock | N3 | Tráfego Pago | PLANEJADO | Auditor de mídia paga | Tráfego Pago | Sobral | medium | SOUL parcial; entra após Sobral ativo. |
| 23 | Israel Lemos | N3 | Comercial | PLANEJADO | Gestor de parcerias e embaixadores | Comercial | Sobral | medium | RENOMEAR (colisão de nome com o fundador N0). |
| 24 | Landin | N3 | Criação/Web | PLANEJADO | Landing pages e conversão | Criação/Web | Miguel | medium | SOUL parcial; depende de Fignaldo. |
| 25 | Chaplin | N3 | Planejamento | PLANEJADO | Analista de conteúdo publicado | Social/Campanhas | Tigrinha | medium | SOUL parcial; pós-publicação. |
| 26 | Visu | N3 | Criação | PLANEJADO | Designer auxiliar / branding | Criação | Tigrinha | medium | Depende do design system do Fignaldo. |
| 27 | Sorkin | N3 | Criação | PLANEJADO | Carousel designer | Criação | Tigrinha | medium | Depende de Fignaldo e Chaplin. |
| 28 | Fignaldo | N3 | Criação/Design | PLANEJADO | Gestor do design system (Figma) | Criação | Tigrinha | high | DEPENDE_INFRA (Figma API, Tokens Studio). |
| 29 | Mataburro | N3 | Atendimento | PLANEJADO | Follow-up insistente | Atendimento | Cláudia | medium | DEPENDE_INFRA (Kommo). RISCO: guardrails anti-assédio. |
| 30 | Doutor House | N3 | Automação & CRM | **ATIVO_FASE_1** | Gestor de CRM / inteligência comercial | Automação & CRM | Cláudia | medium | INDICE indica como 1º agente operacional, maior impacto. DEPENDE_INFRA (Kommo). |
| 31 | Pablo | N3 | Governança | PLANEJADO | Gestor de projetos | Governança | Miguel | medium | SOUL completo; baixo risco; entra na 2ª onda. |
| 32 | Matlock | N3 | Governança | PLANEJADO | Jurídico / compliance | Governança | Miguel | medium | Guardrails embutidos (não vinculante). |
| 33 | Tio Patinhas | N3 | ADM/Financeiro | PLANEJADO | Financeiro / administrativo | ADM/Financeiro | Miguel | medium | DEPENDE_INFRA (integração fiscal/contábil ausente). |
| 34 | April Ludgate | N3 | Dados/Conhec. | PLANEJADO | Curadoria de conteúdo externo | Governança | Hermione | low | DEPENDE_INFRA (RSS/Alerts). Baixo risco. |
| 35 | Yoda | N3 | Dados/Conhec. | PLANEJADO | Scout de inovação (madrugada) | Governança | Hermione | medium | Par com Miagy; depende de fonte de pesquisa. |
| 36 | Miagy | N3 | Governança | PLANEJADO | Trainer; aplica findings ao DNA | Governança | Hermione+Pepper | critical | RISCO alto: edita DNA de agentes; dupla via. FUNDIR/separar de Gandalf. |
| 37 | Indiana | N3 | Tráfego/SEO | PLANEJADO | SEO specialist | Tráfego/Planej. | Hermione | medium | DEPENDE_INFRA (SEMrush/Ahrefs/GSC). |
| 38 | Neo | N3 | Governança | PLANEJADO | Detecção de gaps transversal | Governança | Hermione | medium | Ciclo mensal; 1º relatório só jun/2026. |
| 39 | McGyver | N3 | Automação | PLANEJADO | Arquiteto de automações n8n | Automação | Jarvis | high | DEPENDE_INFRA (n8n). RISCO: core operacional. |
| 40 | Rico | N3 | Tecnologia | PLANEJADO | Quality Assurance | Automação | Jarvis | medium | SOUL completo; entra junto com a engenharia. |
| 41 | Ghost | N3 | Tecnologia | PLANEJADO | Chaos testing / bug hunter | Automação | Rico→Jarvis | medium | Anomalia: N3 reporta a N3. Exige janela de manutenção. |
| 42 | Gandalf | N3 | Governança | PLANEJADO | Prompt master | Governança | Pepper | high | FUNDIR/separar de Miagy (ambos mexem em prompts). Realocar sob N2. |
| 43 | Walter White | N3 | Planejamento | PLANEJADO | Arquiteto de ofertas e produtos | Governança | Pepper | medium | Realocar sob N2; baixo risco. |
| 44 | Link | N4 | Dados | PLANEJADO | Insights cross-cutting | Governança | Hermione | medium | SOUL completo; entra após haver dados a cruzar. |
| 45 | Sonar | N4 | Dados | PLANEJADO | Radar global de trends | Governança | Hermione | low | DEPENDE_INFRA (fontes web). |
| 46 | Radar Ads | N4 | Tráfego Pago | PLANEJADO | Monitor de anúncios de concorrentes | Tráfego Pago | Sobral | low | DEPENDE_INFRA (Ad Library, SEMrush). |
| 47 | Davi | N5 | Comercial | PLANEJADO | SDR outbound frio B2B | Comercial | Saul | low | SOUL PARCIAL — sem seção de ferramentas/CRM. RISCO em contato real. |
| 48 | Lucas | N5 | Comercial | PLANEJADO | SDR inbound qualificado | Comercial | Saul | low | SOUL PARCIAL. Maior ROI dos SDRs (speed-to-lead) — candidato à Fase 1.5. |
| 49 | Felipe | N5 | Comercial | PLANEJADO | SDR reativação de inativos | Comercial | Saul | low | SOUL PARCIAL; contradição interna (30 vs 90 dias). |
| 50 | Matheus | N5 | Comercial | PLANEJADO | Closer de vendas complexas | Comercial | Saul | low | SOUL PARCIAL; sem ferramentas de proposta/CRM. |
| 51 | Amanda | N5 | Atendimento | PLANEJADO | Pós-venda / onboarding 30 dias | Atendimento | Saul | low | SOUL PARCIAL; cruzamento de cadeia (handoff p/ Cláudia). |
| 52 | Carolina | N5 | Comercial | PLANEJADO | SDR B2B em verticais | Comercial | Saul | low | SOUL PARCIAL; depende de copy da Bianca. |
| 53 | Bianca | N5 | Comercial | PLANEJADO | Cold copy specialist | Comercial | Saul | low | SOUL PARCIAL; baixo risco (só produz copy). |
| 54 | Zelador | N6 | Dados/Conhec. | PLANEJADO | Guardião da Alexandria | Governança | Hermione+Liz | high | DEPENDE_INFRA (Alexandria). RISCO: ponto único de falha; dupla via. |

---

## 6. AGENTES ATUAIS DA VPS/OPENCLAW vs CATÁLOGO CANÔNICO

**Achado factual decisivo:** a re-extração profunda (`openclaw-deep`, 18/05) mostra que a VPS roda **1 único agente real — `main`**. Os nomes abaixo existem como *personas/sub-agentes configurados* na documentação NAIA, não como processos ativos.

| Agente citado na VPS | Papel descrito | Corresponde a | Decisão |
|---|---|---|---|
| **Pepper** | Agente principal N1 (ex-Naia, ex-Tony) | **01 — Pepper Potts** | Manter. É o agente `main` real. |
| **Juliana** | Sub-gerente / Chief of Staff (heritage Denderson) | *nenhum slot canônico* | Manter como sub-agente spawnável; não promover. |
| **Rafael** | Projetos, prazos, roadmap | **05 — Miguel** | Fundido; nome canônico "Miguel" prevalece. |
| **Paulo** | Dev full-stack, APIs, deploy | **14 — Roboto** | Renomeado para "Roboto". |
| **Jonathan** | Copywriter, roteiros, pesquisa | **13 — Tay** | Renomeado para "Tay". |
| **"Matheus Clone"** | Tráfego pago, Meta Ads, criativos | **03 — Sobral** | Renomeado para "Sobral". ⚠ contradição com `MEMORY.md` a resolver. |
| **Matheus** | SDR vendas | **50 — Matheus** | Correspondência 1:1; manter nome. |
| **Davi / Lucas / Felipe / Amanda / Carolina / Bianca** | SDRs de vendas | **47/48/49/51/52/53** | Correspondência 1:1; manter nomes. |

**Síntese:** apenas **Juliana** não tem slot canônico — decisão registrada de mantê-la como sub-agente, não agente do catálogo. Rafael/Paulo/Jonathan/"Matheus Clone" não existem mais como nomes — foram fundidos. Pepper e os 7 SDRs mantêm nome idêntico ao catálogo. **Todo o resto do catálogo (TARS, 7 chefes N2, todos os N3/N4/N6) é planejado e não roda.**

---

## 7. AGENTES RECOMENDADOS PARA A FASE 1 OPERACIONAL

Núcleo enxuto de **8 agentes**, em 2 ondas. Critério: SOUL utilizável + papel de alto impacto + dependência de infra gerenciável.

**Onda 1 — Núcleo "construir + lembrar" (semana 1):**

| Agente | Por quê agora |
|---|---|
| 01 · Pepper | Já roda. Orquestra tudo; ponto único de entrada. |
| 07 · Jarvis | Constrói e mantém a infraestrutura da própria Fase 1. |
| 14 · Roboto | Dev que materializa Alexandria, integrações e deploy. |
| 06 · Hermione | Dona da Alexandria — sem ela "nada acontece" (Princípio 14b). |

**Onda 2 — Primeira camada de valor comercial (semana 2-3, após infra de pé):**

| Agente | Por quê |
|---|---|
| 30 · Doutor House | CRM operante = maior impacto comercial imediato (recomendação do próprio INDICE). |
| 19 · Saul | Comando do comercial; organiza pipeline antes dos SDRs. |
| 03 · Sobral | Tráfego pago — atividade-núcleo de receita da agência. |
| 09 · Tigrinha | Criativo/conteúdo — entrega-núcleo da agência. |

Tudo fora desses 8 fica PLANEJADO. **Não** se ativam 54 agentes; ativa-se um núcleo que comprova o modelo.

---

## 8. AGENTES PLANEJADOS PARA FASE 2 (e além)

Os 46 agentes restantes, agrupados por onda de entrada recomendada:

- **Fase 1.5 — Vendas (após Saul + CRM estáveis):** os 7 SDRs N5 (Davi, Lucas, Felipe, Matheus, Amanda, Carolina, Bianca) — começar por **Lucas** (inbound, maior ROI). Pré-requisito: completar os SOULs N5 (hoje PARCIAIS, sem ferramentas).
- **Fase 2 — Chefes restantes + especialistas de entrega:** Cláudia, Miguel, Liz (completar SOULs); Tay, Chaplin, Visu, Sorkin, Fignaldo, Landin (criação); Loki, Cypher, Sherlock, Israel Lemos*, Radar Ads (tráfego); Pablo, Matlock, Tio Patinhas (operações).
- **Fase 3 — Inteligência e automação avançada:** Data, Eve, WALL·E, Sentinela, McGyver, Rico, Ghost; radares Marquinho, Buscapé, Silvio, Link, Sonar; Yoda+Miagy (ciclo de treino); Neo (gaps); Indiana (SEO); Zelador.
- **Aspiracional / sem prazo:** TARS (CTO) — reavaliar quando houver carga técnica que justifique um 2º N1.

---

## 9. AGENTES LEGADOS / ARQUIVÁVEIS

Nenhum dos 54 canônicos é legado. Os legados são o **conjunto paralelo TOT-Kimi** e nomes históricos:

| Item | Natureza | Recomendação |
|---|---|---|
| `TOT -Kimi/agents/` (28 SOULs) | Sistema de agentes anterior, baseado em Kimi/OpenClaw | ARQUIVAR formalmente em `backups/`. Marcar read-only para nenhum agente ler DNA obsoleto. |
| Giles (em backups e TOT-Kimi) | Predecessor da Hermione | ARQUIVAR. Migração Giles→Hermione já é a versão canônica. |
| Naia, Tony, Stark, Alfred, Jason, Wanda, Kira | Nomes de identidade históricos | LEGADO — não usar; limpar referências residuais nos SOULs canônicos. |
| `Project Agentes/` (pacote elizaOS) | Refactor de abril/26; 3 docs "production-ready" desmentidos pelo próprio REALITY_CHECK | LEGADO de referência; não basear decisões nos claims de "pronto". |
| 30 SOULs duplicados fora de `Agentes-Canonicos/` | Cópias em TOT-Kimi, workspace-tony-deploy, backups | ARQUIVAR; a fonte de verdade é só `Agentes-Canonicos/`. |

---

## 10. AGENTES DUPLICADOS OU FUNDÍVEIS

| Caso | Análise | Recomendação |
|---|---|---|
| **Miagy (36) × Gandalf (42)** | Ambos mexem em prompts/DNA de agentes. Miagy "aplica findings ao DNA"; Gandalf "otimiza prompts". Fronteira difusa. | Decidir: fundir num só "Engenheiro de Prompts/DNA", **ou** separar com contrato explícito (Gandalf = qualidade de prompt; Miagy = ciclo Yoda→DNA). Não ativar os dois sem isso. |
| **Data (15) × Eve (16)** | O próprio SOUL do Data admite sobreposição com Eve. Data = BI/dashboards; Eve = KPIs/alertas. | Manter separados, mas escrever fronteira no SOUL: Data analisa histórico, Eve dispara alertas em tempo real. |
| **Sherlock (22) × Matlock (32)** | Sem sobreposição real (mídia paga × jurídico) — confusão só de nome no SOUL do Sobral, que cita "Paid Media Auditor" genérico. | Corrigir o SOUL do Sobral para nomear "Sherlock" explicitamente. |
| **TOT-Kimi × canônicos** | ~13 nomes coincidem (Hermione, Liz, Miguel, Jarvis, Visu, Chaplin, Pablo, Yoda, Rico, Ghost, Sentinela, Loki, Zelador). | Não é duplicação a fundir — é versão anterior. Arquivar TOT-Kimi (seção 9). |

---

## 11. GAPS CRÍTICOS DA ARQUITETURA

1. **Alexandria não existe como infraestrutura.** ~40 dos 54 agentes citam a Alexandria (Supabase + pgvector) como dependência de leitura/escrita. Hoje ela é só conceito. **É o gap nº 1** — bloqueia quase tudo.
2. **n8n e Kommo CRM não confirmados.** Doutor House, Saul, McGyver, Mataburro e os SDRs dependem deles. Sem confirmação de provisionamento, não há Fase 1.5 comercial.
3. **Um único agente roda.** A distância entre "54 no catálogo" e "1 em produção" é o maior risco de gestão — gera falsa sensação de sistema pronto.
4. **Os 8 departamentos canônicos não mapeiam os 8 POPs operacionais.** "Web/UX" não tem dono claro (Landin é landing pages, não UX completo); "Atendimento/Suporte" é fino (só Cláudia + Mataburro); "ADM/Financeiro" depende de 1 agente sem integração fiscal.
5. **SOULs N5 incompletos.** Os 7 SDRs não têm seção de ferramentas/integrações — ativá-los para contato real com leads sem isso é arriscado.
6. **Inconsistência de identidade não propagada.** SOULs antigos citam Tony/Wanda/Stark — quebra a cadeia de comando ao ler.
7. **Anomalias de hierarquia.** N3 reportando a N1 (Gandalf, Walter White) e N3 a N3 (Ghost) — gargalo e cadeia irregular.
8. **Quem faz o deploy?** Nenhum agente "dono" do processo de pôr os outros em produção — hoje depende do Rael + Claude Code. Problema do ovo e da galinha que Jarvis+Roboto na Onda 1 resolvem.

---

## 12. DEPENDÊNCIAS TÉCNICAS

| Infra | Estado atual | Agentes que dependem | Bloqueia Fase 1? |
|---|---|---|---|
| Alexandria (Supabase + pgvector) | ❌ não construída | ~40 agentes; Hermione, Zelador, todos N3+ | **SIM** — pré-requisito da Onda 1 |
| OpenClaw Gateway (VPS Hostinger) | ✅ ativo (roda a Pepper) | Pepper e futuros sub-agentes | Não |
| n8n | ⚠ não confirmado | Doutor House, Saul, McGyver, Mataburro, SDRs | Sim, para Onda 2 |
| Kommo CRM | ⚠ não confirmado | Doutor House, Saul, Walter White, SDRs | Sim, para Onda 2 |
| WhatsApp (canal real) | ✅ ativo (OpenClaw) | Pepper, atendimento, SDRs | Não |
| Telegram | ⚠ legado/desabilitado | docs antigas assumem; canal real é WhatsApp | Não |
| Meta Ads / Google Ads API | ⚠ não confirmado | Sobral, Sherlock, Cypher, Data, Eve, radares | Sim, para Sobral (Onda 2) |
| Figma API + Tokens Studio | ⚠ não confirmado | Fignaldo, Visu, Sorkin, Landin | Não (Fase 2) |
| SEMrush/Ahrefs/GSC | ⚠ não confirmado | Indiana, Radar Ads | Não (Fase 3) |
| Supabase (projeto base) | ✅ conectado | toda a camada de dados/auditoria | — |

**Regra derivada:** nenhum agente DEPENDE_INFRA é ativado antes de sua infra estar verificada e publicada.

---

## 13. PERMISSÕES E RISCOS

Taxonomia (de `PERMISSION_POLICY.md` v1.1): **critical** (7+), **high** (5-6), **medium** (3-4), **low** (0-2).

| Nível | Permissão | Agentes |
|---|---|---|
| critical | edita dados sensíveis / DNA com aprovação Rael | Pepper, TARS, Miagy |
| high | escreve na Alexandria, move arquivos críticos, deploy | 8 chefes N2, Neo, Gandalf, Fignaldo, Zelador, Roboto |
| medium | roda tools, escreve via fila de revisão | especialistas N3 |
| low | leitura + rotinas pré-aprovadas | radares N4, SDRs N5, Zelador N6 |

**Riscos principais a mitigar antes do go-live:**

- **Miagy e Zelador = pontos únicos de falha.** Miagy edita DNA de todos; Zelador é admin total da Alexandria. Exigir aprovação Rael + audit log obrigatório (a política já prevê — garantir que está implementado).
- **Doutor House com acesso full ao CRM** — se scoring/limpeza automática falhar, corrompe a base comercial. Começar em modo somente-leitura.
- **SDRs em contato real com leads** sem guardrails (Mataburro/follow-up insistente, cold outbound) — risco de assédio/spam e dano de marca. Não ativar sem guardrails testados.
- **Dupla via de comando** (Data: Hermione+Tony; Cypher: Sobral+Jarvis; Miagy/Zelador) — definir comando único por agente.
- **Agente 23 "Israel Lemos"** — colisão de identidade com o N0; risco de confusão de autoridade e de segurança. Renomear antes de qualquer ativação.
- **Audit log** (`agent_audit_log` no Supabase) precisa existir e estar obrigatório antes de qualquer agente `medium+` agir.

---

## 14. RECOMENDAÇÃO FINAL DE IMPLANTAÇÃO

**Não ativar agentes ainda.** Primeiro existir infraestrutura; depois ativar o núcleo enxuto. Sequência recomendada:

**Sprint 0 — Saneamento (1-2 dias, sem ativar agente):**
Renomear `01-N1-Tony`→`01-N1-Pepper`; corrigir nomes Tony/Wanda/Stark nos SOULs; renomear o agente 23; versionar `Agentes-Canonicos/` no Git (`grupototum/Totum-OS`); atualizar README e INDICE.

**Sprint 1 — Infraestrutura (Onda 1 de agentes):**
Jarvis + Roboto constroem a Alexandria (Supabase + pgvector) e o `agent_audit_log`; confirmam n8n e Kommo. Hermione assume a Alexandria. Pepper orquestra. Critério de saída: Alexandria publicada e acessível (Princípio 14).

**Sprint 2 — Primeira camada de valor (Onda 2):**
Ativar Doutor House (CRM, modo leitura → escrita gradual), Saul, Sobral, Tigrinha. Cada um entra só com sua infra verificada.

**Sprint 3 — Fase 1.5 comercial:**
Completar os SOULs dos 7 SDRs; ativar Lucas (inbound) primeiro; depois os demais SDRs sob Saul.

**Fase 2+:** chefes e especialistas restantes, conforme seção 8.

**Princípio de governança:** um agente só passa de PLANEJADO para ATIVO quando tem (1) SOUL completo, (2) POP/SLA, (3) infra verificada, (4) permissão definida, (5) audit log ligado. Sem os 5, permanece planejado.

---

## 15. PRÓXIMOS PASSOS PRÁTICOS

1. **Decidir nomes (Rael):** confirmar Pepper Potts e aprovar a renomeação do agente 23.
2. **Sprint 0 de saneamento:** renomear pasta da Pepper, limpar nomes legados nos SOULs, versionar a pasta canônica no Git.
3. **Definir dono da Alexandria como projeto:** Hermione + Roboto, com Jarvis na infra — primeiro entregável concreto.
4. **Confirmar infraestrutura:** checar se n8n e Kommo já estão provisionados na VPS; se não, é a prioridade técnica.
5. **Completar SOULs PARCIAIS:** Cláudia, Miguel, Liz e os 7 SDRs — adicionar seção de ferramentas/integrações.
6. **Resolver Miagy × Gandalf:** decidir fundir ou separar com contrato explícito.
7. **Implementar o `agent_audit_log`** no Supabase antes de qualquer ativação.
8. **Ativar a Onda 1** (Pepper, Jarvis, Roboto, Hermione) só após Sprint 0.
9. **Reavaliar a hierarquia:** realocar Gandalf e Walter White sob um N2.
10. **Atualizar este documento** ao fim de cada Sprint — ele é a fonte viva da arquitetura operacional.

---

*Documento gerado na Fase 2 da auditoria — 2026-05-22. Não substitui o inventário da Fase 1 (`FASE1_MAPA_E_INVENTARIO.md`). Próxima revisão: ao fim do Sprint 0.*
