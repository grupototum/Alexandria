# FASE 1 — MAPA E INVENTÁRIO TOTAL

**Auditoria do ecossistema de agentes Totum OS**
**Data:** 2026-05-22 · **Auditor:** Claude (papel: "RH dos agentes digitais")
**Status:** Fase 1 concluída — somente leitura, nenhum arquivo modificado
**Escopo:** 3 pastas locais · ~365 arquivos inventariados individualmente (+ ~165 em nível de pasta)

---

## 1. RESUMO EXECUTIVO

A Fase 1 leu e catalogou todo o material de agentes nas três pastas em escopo. O ecossistema está **rico em conteúdo, mas fragmentado**: existe uma fonte canônica sólida (`Agentes-Canonicos/`, 54 agentes de IA + N0 humano), cercada de camadas históricas, conjuntos paralelos e catálogos divergentes que nunca foram reconciliados.

Números-chave:

| Métrica | Valor |
|---|---|
| Agentes de IA canônicos (`Agentes-Canonicos/`) | 54 (+ N0 humano = 55 entradas) |
| Arquivos `SOUL.md` no total (todas as pastas) | 84 — sendo **54 canônicos + 30 legados/paralelos** |
| Catálogos de agentes concorrentes encontrados | ≥ 5, com contagens 54 / 78 / 41 / 19 / ~14 |
| Relatórios de inventário (pasta `Relatório 22-05/`) | 4, divergentes (55 / 55 / 19 / ~14) |
| `node_modules` / código de dependência (fora do escopo) | ~35.000 arquivos |

**Veredito da Fase 1:** o sistema tem uma espinha dorsal canônica utilizável, mas precisa de uma passada de reconciliação antes de qualquer deploy. Os problemas estão mapeados na seção 4.

---

## 2. MAPA DE ÁRVORE

```
ESCOPO DA AUDITORIA (3 pastas)

[A] /Pixel Systems/Alexandria/Agentes Totum/        ← PASTA OFICIAL DO PROJETO
├── FRAMEWORK_CRIACAO_AGENTES.md                    → manual de criação de agentes
├── arquitetura agentes 19:05.md                    → arquitetura v3.5 / 27 agentes pendentes
├── Biblioteca_Melhor_Programador_IA.docx           → biblioteca de boas práticas de IA
└── Relatório 22-05/                                → 4 relatórios de inventário (divergentes)

[B] /Claude/Projects/Totum OS/                       ← O SISTEMA VIVO
├── (36 arquivos na raiz)                           → prompts, briefings, catálogos, runbooks, SQL
├── Agentes-Canonicos/                              → ★ FONTE DE VERDADE — 54 agentes + N0
│   ├── 00-N0-Israel/ ... 54-N6-Zelador/            → 1 pasta por agente, 1 SOUL.md cada
│   ├── INDICE_TOTUM_OS.md · README.md
│   ├── _PRINCIPIOS/  (4 arquivos)                  → princípios, permissões, frase fundadora
│   └── _PROPOSTAS/   (PROMPTS_PESQUISA_TRENDS)     → propostas de agentes de conteúdo
├── Project Agentes/   (42 arquivos)                → specs/refactor "Apps Totum" (abril/26, legado)
├── TOT -Kimi/         (76 arquivos)                → conjunto PARALELO/legado de agentes (~28 SOULs)
├── workspace-tony-deploy/ (5 arquivos)             → workspace de deploy do agente CEO
├── openclaw-extract/  (19 arquivos)                → dumps da extração da VPS OpenClaw
├── backups/           (91 arquivos)                → snapshots de limpeza (mai/2026)
├── cliente-totum/     (~150 arquivos)              → projeto Next.js do portal do cliente (repo à parte)
├── branding/          (15 imagens)                 → assets de marca
└── node_modules/ ×28                               → FORA DO ESCOPO (dependências regeneráveis)

[C] /Claude/Projects/Totum Agentes/                  ← DOCS DE ESTRATÉGIA (histórico)
└── (6 arquivos)                                    → guias multi-agente, catálogos externos, playbook
```

---

## 3. REGISTRO DE ARQUIVOS

### 3.1 — Pasta do Projeto · `Agentes Totum/`

| # | Arquivo | Tipo | Bytes | Assunto |
|---|---|---|---|---|
| 1 | FRAMEWORK_CRIACAO_AGENTES.md | md | 25.906 | Manual operacional de criação de agentes Totum (10 regras de ouro, árvore de decisão de IA, templates). |
| 2 | arquitetura agentes 19:05.md | md | 103.218 | Arquitetura Totum OS v3.5 dos 27 agentes pendentes; revisa 46 agentes; gerada por Kimi DeepSearch (19/05). |
| 3 | Biblioteca_Melhor_Programador_IA.docx | docx | 309.849 | Biblioteca de boas práticas para "melhor programador IA"; base do Vibe-Coding Playbook (não-extraível: lock do SO). |
| 4 | Relatório 22-05/INVENTARIO_AGENTES_TOTUM_OS.md | md | 49.551 | Inventário por Claude (Cowork): afirma 55 agentes (54 IA + N0), catálogo v3.5. |
| 5 | Relatório 22-05/INVENTARIO_AGENTES_TOTUM_OS_v1.md | md | 64.506 | Inventário por Claude Sonnet 4.6: 55 agentes (1 N0 + 54 IA), fonte `/Agentes-Canonicos/`. |
| 6 | Relatório 22-05/Ivenvtario Agente totum 2.md | md | 27.090 | Inventário por Claude Sonnet 4.6 (projeto Apps Totum): afirma 19 agentes, catálogo v2.0 (typo no nome). |
| 7 | Relatório 22-05/Relatórios Chat GPT.md | md | 19.503 | Inventário por ChatGPT GPT-5.5: nega hierarquia oficial, lista ~14 agentes/bots sem estrutura. |

### 3.2 — `Totum OS/` · raiz (36 arquivos)

| # | Arquivo | Tipo | Bytes | Assunto |
|---|---|---|---|---|
| 1 | ASSIMILACAO_LOG.md | md | 4.043 | Log de limpeza/assimilação de 17/05: o que ficou na raiz e o que foi para `backups/`. |
| 2 | ASSIMILACAO_PROJECT_AGENTES_ROUND1.md | md | 24.479 | Assimilação Round 1 dos 10 arquivos prioritários do Project Agentes (catálogo v3.2). |
| 3 | ASSIMILACAO_PROJECT_AGENTES_ROUND2.md | md | 15.082 | Assimilação Round 2 dos 34 arquivos de execução do Project Agentes (catálogo v3.4). |
| 4 | BRIEFING_PARA_CHAT_AGENTES.md | md | 5.073 | Briefing: workspace OpenClaw em estado de template; sub-agentes são spawn dinâmico. |
| 5 | BRIEFING_TRANSICAO_NAIA_TOTUM_OS.md | md | 9.662 | Briefing do chat de transição para executar a migração Naia → Tony. |
| 6 | CATALOGO_CANONICO_UNIFICADO.md | md | 16.871 | Catálogo canônico v3.x consolidando 78 agentes de 3 fontes (NAIA, Totum-OS, TOT-Kimi). |
| 7 | CATALOGO_CANONICO_UNIFICADO_AGENTES.md | md | 59.056 | Catálogo canônico v3.4 detalhado (padrão Yoda+Miagy, rotina diária de evolução). |
| 8 | CATALOG_v35.md | md | 7.615 | Catálogo de agentes v3.5 (54 agentes, N0–N6, Pepper Potts como N1-CEO). |
| 9 | CC_PROMPT_PASSO1_NAIA_INVENTORY.md | md | 8.730 | Prompt do Passo 1 da fusão NAIA: inventário read-only da VPS Hostinger. |
| 10 | CC_PROMPT_PASSO2_TOTUM_OS_INVENTORY.md | md | 6.952 | Prompt do Passo 2: inventário read-only do Totum-OS em produção. |
| 11 | DEPLOY_TONY_SSH.md | md | 6.604 | Runbook de deploy Naia → Tony via SSH (PT-2026-002). |
| 12 | HANDOFF_CHAT_AGENTES_TOTUM_v1.md | md | 21.115 | Handoff do chat "Agents Totum" com inventário de 19 SOULs. |
| 13 | HERMIONE_ANALISE_TOT_KIMI.md | md | 15.724 | Análise da Hermione sobre TOT-Kimi: ~38 agentes, 3 catálogos divergentes, 6 duplicatas. |
| 14 | JARVIS_RUNBOOK_v1.md | md | 8.564 | Constituição técnica operacional do Jarvis (N2 VP Engineering). |
| 15 | LISTA_GERAL_AGENTES_PARA_VALIDACAO.md | md | 7.143 | Lista geral v3.4 (41 ativos + 2 skills + 5 planejados + 3 fantasma). |
| 16 | MAPA_INFRA_TOTUM_OS.md | md | 17.052 | Mapa de infraestrutura: GitHub/Vercel/Hostinger/Alibaba/Supabase. |
| 17 | MIGRATION_PROJECT_THREAD.sql | sql | 15.969 | Migration SQL idempotente do Project Thread Pattern (Supabase). |
| 18 | MIGRATION_PT_2026_002_OPEN.sql | sql | 3.134 | Migration SQL de abertura do thread PT-2026-002 (transição Naia → Tony). |
| 19 | NAIA_INVENTORY.md | md | 5.928 | Inventário da NAIA na VPS: agente principal + 12 sub-agentes, Sonnet 4.5. |
| 20 | OPENCLAW_CONTRACT.md | md | 14.762 | Contrato OpenClaw extraído da VPS — canal real é WhatsApp (não Telegram). |
| 21 | PROMPT_CAPTURA_NAIA.md | md | 2.717 | Prompt para capturar identidade/memória da Naia via Telegram antes do rename. |
| 22 | PROMPT_CHAT_3_IMPLANTACAO.md | md | 5.020 | Prompt para o Chat 3 executar a implantação da Fusão Totum 3.0. |
| 23 | PROMPT_CODEX_EXTRACT_OPENCLAW.md | md | 5.597 | Prompt para extrair endpoint/schema/auth do OpenClaw Gateway. |
| 24 | PROMPT_HANDOFF_CHAT_AGENTES_TOTUM.md | md | 5.821 | Prompt para consolidar o histórico do chat "Agents Totum". |
| 25 | PROMPT_KIMI_DEEPSEARCH_27_AGENTES.md | md | 13.755 | Prompt para o Kimi DeepSearch validar a hierarquia e gerar os 27 agentes pendentes. |
| 26 | PROMPT_NAIA_TELEGRAM_CONFIRMAR_ESTRUTURA.md | md | 2.542 | Prompt de 5 perguntas para a Naia confirmar a estrutura dos sub-agentes. |
| 27 | PROMPT_NOVO_CHAT_VALIDACAO_AGENTES.md | md | 5.485 | Prompt para validação agente-por-agente do catálogo v3.4. |
| 28 | PROMPT_PROXIMO_CHAT_TOTUM_OS.md | md | 6.941 | Prompt de continuidade do projeto Totum OS (55 agentes). |
| 29 | PROMPT_REEXTRACT_OPENCLAW_DEEP.md | md | 6.431 | Prompt para re-extração DEEP dos arquivos de workspace OpenClaw. |
| 30 | PROMPT_REEXTRACT_SIBLING_WORKSPACES.md | md | 2.985 | Prompt para extrair workspaces irmãos dos sub-agentes da Naia. |
| 31 | PROMPT_SONNET_CLAUDE_CODE_VPS.md | md | 10.342 | Prompt para o Claude Code executar a reforma Naia → Tony na VPS. |
| 32 | PROMPT_VALIDACAO_5_AGENTES_N3.md | md | 5.737 | Prompt de validação canônica dos 5 SOULs N3 (Roboto, Data, Eve, WALL·E, Sentinela). |
| 33 | REBRAND_NAIA_PEPPER.sh | sh | 10.955 | Script bash de rebrand Naia → Pepper Potts (PT-2026-002), com backup. |
| 34 | RESUMO_EXECUTIVO_TONY.md | md | 9.566 | Resumo executivo do Totum OS para o Tony: status global 65%. |
| 35 | STATUS_PT_2026_002_PAUSA_NOTURNA.md | md | 7.442 | Status da pausa noturna do PT-2026-002. |
| 36 | dashboard-tarefas.html | html | 53.880 | Dashboard kanban offline (localStorage) de tarefas/pendências do Totum OS. |

### 3.3 — `Totum OS/Agentes-Canonicos/` · ★ FONTE DE VERDADE

**Os 54 agentes de IA + N0 humano** (1 `SOUL.md` por pasta de agente):

| Nº | Agente / Nível | Bytes | Papel (do SOUL) |
|---|---|---|---|
| 00 | N0 — Israel "Rael" | 1.243 + 3.237 | Humano fundador/decisor soberano (`REGISTRO.md` + `USER.md`, sem SOUL). |
| 01 | N1 — Tony *(SOUL = Pepper Potts)* | 9.041 | CEO operacional do Totum OS, orquestra/audita tudo. ⚠ pasta x nome divergem. |
| 02 | N1 — TARS | 7.909 | CTO técnico de bastidores, motor de execução pesada (modo aspiracional). |
| 03 | N2 — Sobral | 7.958 | CMO, dono do tráfego pago (Meta/Google Ads) e criativos de performance. |
| 04 | N2 — Cláudia | 5.590 | CCO Customer, experiência/retenção do cliente, prevenção de churn. |
| 05 | N2 — Miguel | 5.802 | COO, operação interna, processos, qualidade e consistência. |
| 06 | N2 — Hermione | 7.114 | CDO/CIO, dona da Alexandria (knowledge base) e governança de dados. |
| 07 | N2 — Jarvis | 7.153 | VP Engineering, constrói/mantém sistemas, ferramentas e infraestrutura. |
| 08 | N2 — Liz | 7.542 | CPO, guardiã da cultura e estrategista de talentos. |
| 09 | N2 — Tigrinha | 11.444 | CCO Creative & Content, dona do criativo/conteúdo e do time visual. |
| 10 | N4 — Marquinho | 3.399 | Radar de trends de Meta Ads (formatos e criativos emergentes). |
| 11 | N4 — Buscapé | 3.416 | Radar de trends de Google Ads e comportamento de busca. |
| 12 | N4 — Silvio | 4.303 | Radar de comportamento do consumidor BR. |
| 13 | N3 — Tay | 6.121 | Copywriter de conteúdo orgânico, executa briefs da Tigrinha. |
| 14 | N3 — Roboto | 7.067 | Dev full-stack do Totum OS (APIs, Supabase, deploy). |
| 15 | N3 — Data | 7.547 | Analyst de BI e dashboards, transforma dados crus em evidência. |
| 16 | N3 — Eve | 7.540 | Analyst de KPIs e alertas, detecta anomalias. |
| 17 | N3 — WALL·E | 8.642 | Otimização contínua e housekeeping do stack técnico. |
| 18 | N3 — Sentinela | 9.986 | Monitoramento técnico 24/7 da infraestrutura. |
| 19 | N2 — Saul | 7.586 | CSO/Head de Vendas, lidera e coordena o time de 7 SDRs. |
| 20 | N3 — Loki | 3.474 | Copywriter de ads / copy de conversão paga. |
| 21 | N3 — Cypher | 3.693 | Tracking specialist (Pixel, GA4, GTM, server-side/CAPI). |
| 22 | N3 — Sherlock | 3.596 | Paid media auditor, auditorias de campanhas pagas com score. |
| 23 | N3 — Israel Lemos | 3.902 | Gestor de parcerias e embaixadores (contadores, white-label). |
| 24 | N3 — Landin | 3.665 | Especialista em landing pages e conversão (A/B testing). |
| 25 | N3 — Chaplin | 4.096 | Analista de performance de conteúdo publicado. |
| 26 | N3 — Visu | 3.582 | Designer auxiliar / branding visual, executa no design system. |
| 27 | N3 — Sorkin | 3.862 | Carousel designer, narrativa e copy de carrosséis Instagram. |
| 28 | N3 — Fignaldo | 4.418 | Gestor do design system / arquiteto visual no Figma. |
| 29 | N3 — Mataburro | 4.179 | Follow-up insistente / sequências de persistência. |
| 30 | N3 — Doutor House | 4.206 | Gestor de CRM (Kommo) / inteligência comercial. |
| 31 | N3 — Pablo | 3.871 | Gestor de projetos / coordenador de entregas e prazos. |
| 32 | N3 — Matlock | 4.207 | Jurídico / compliance (contratos, NDAs, LGPD). |
| 33 | N3 — Tio Patinhas | 4.039 | Financeiro / administrativo (NF, fluxo de caixa, DRE, DAS). |
| 34 | N3 — April Ludgate | 3.446 | Curadora de conteúdo externo (triagem SKIP/AVALIAR/PRIORIDADE). |
| 35 | N3 — Yoda | 3.494 | Scout de madrugada / pesquisador proativo de inovação. |
| 36 | N3 — Miagy | 3.762 | Trainer diário, aplica findings do Yoda no DNA dos agentes. |
| 37 | N3 — Indiana | 3.935 | SEO specialist (técnico, on-page, content SEO). |
| 38 | N3 — Neo | 4.048 | Gap detection transversal / guardião do princípio fundador. |
| 39 | N3 — McGyver | 4.101 | Arquiteto de automações n8n. |
| 40 | N3 — Rico | 3.746 | Quality assurance / especialista em testes. |
| 41 | N3 — Ghost | 3.761 | Chaos testing / bug hunter (stress test, vulnerabilidades). |
| 42 | N3 — Gandalf | 3.775 | Prompt master / engenheiro de meta-prompts de todos os agentes. |
| 43 | N3 — Walter White | 3.987 | Arquiteto de ofertas e produtos (pricing, packaging). |
| 44 | N4 — Link | 3.219 | Radar de insights cross-cutting, correlações entre departamentos. |
| 45 | N4 — Sonar | 2.631 | Radar global de trends (mercado, tech, comportamento, regulação). |
| 46 | N4 — Radar Ads | 2.785 | Monitor de anúncios de concorrentes (criativos, copy, gasto). |
| 47 | N5 — Davi | 1.660 | SDR de outbound frio B2B. |
| 48 | N5 — Lucas | 1.666 | SDR de inbound qualificado (speed-to-lead <5min). |
| 49 | N5 — Felipe | 1.593 | SDR de reativação de clientes inativos (90+ dias). |
| 50 | N5 — Matheus | 1.842 | SDR closer de vendas complexas (médio/alto ticket). |
| 51 | N5 — Amanda | 1.628 | SDR de pós-venda / onboarding 30 dias. |
| 52 | N5 — Carolina | 1.826 | SDR B2B em verticais/nichos especializados. |
| 53 | N5 — Bianca | 1.631 | SDR cold copy specialist (emails e LinkedIn). |
| 54 | N6 — Zelador | 4.187 | Guardião da Alexandria (taxonomia, indexação, housekeeping). |

**Arquivos de governança e propostas em `Agentes-Canonicos/`:**

| Arquivo | Tipo | Bytes | Assunto |
|---|---|---|---|
| INDICE_TOTUM_OS.md | md | 10.226 | Índice canônico v3.5 — hierarquia, tabela de agentes, resumo por nível. |
| README.md | md | 6.960 | README da pasta (⚠ desatualizado: cita "19 SOULs"). |
| _PRINCIPIOS/FRASE_FUNDADORA.md | md | 1.345 | Frase fundadora + backlog de 10 gaps conhecidos. |
| _PRINCIPIOS/PERMISSION_POLICY.md | md | 8.903 | Política de permissões v1.1 (low/medium/high/critical, matriz por agente). |
| _PRINCIPIOS/PRINCIPIOS_ARQUITETURAIS.md | md | 5.134 | 15 princípios arquiteturais (⚠ usa nomes antigos: Wanda, Alfred, Tony). |
| _PRINCIPIOS/PROJECT_THREAD_PATTERN.md | md | 4.186 | Padrão Project Thread (schema Supabase, 7 Edge Functions). |
| Comandos Claude Creator.docx | docx | 13.842 | Guia de 7 passos para o Claude operar como estrategista de conteúdo. |
| _PROPOSTAS/PROMPTS_PESQUISA_TRENDS/ | pasta | — | 13 arquivos: prompts v1.0/v1.1 de pesquisa de trends + manuais de uso. |
| _PROPOSTAS/PROMPTS_PESQUISA_TRENDS.zip | zip | 50.320 | ⚠ Snapshot redundante — não abre como zip válido (possível placeholder de sync). |

### 3.4 — `Totum OS/Project Agentes/` (42 arquivos · legado abril/2026)

Pacote de refatoração "Apps Totum / elizaOS". Conteúdo: índices (`00_LEIA_PRIMEIRO_INDICE`, `README_INDICE`), quick-starts e briefs para Claude Code, templates de código, specs (`SPEC_APPS_TOTUM_v2.0_FINAL`), checklists de execução (Day1/Day2-5, diário), prompts Opus/Kimi de auditoria, docs de status do elizaOS, a política `TOTUM_AGENT_PERMISSION_POLICY.md` (v1.0), as skills "Analisador de Anúncios", 2 arquivos de código (`AgentChatLayout_REFACTORED.tsx`, `useAgentExecution.ts`), 1 SQL e 1 HTML de arquitetura de VPS. Já parcialmente assimilado pelos arquivos `ASSIMILACAO_ROUND1/2` da raiz.

### 3.5 — `Totum OS/TOT -Kimi/` (76 arquivos · conjunto PARALELO/legado)

Sistema de agentes anterior, baseado em Kimi/OpenClaw. Contém **28 `SOUL.md`** em `agents/` (AdRaptor, April Ludgate, Auditor, Chaplin, Data, Dona Clawdete, Fignaldo, Gestor Tráfego, Ghost, Hermione, Jarvis, Kimi-Totum, Carousel Designer, KVirtuoso, Liz, Loki, Mataburro, Miguel, Pablo, Radar Insights, Rico, Scrivo, Sentinela, Stark, Visu, Wanda, Yoda, Zelador), além de `INDEX.md`, `ORGANOGRAMA.md`, READMEs, system-prompts, o subsistema `kira/` (Alexandria core/ingestor/zelador + Carousel Designer com código `.mjs`), schemas SQL e clientes JS da Hermione (ainda nomeados "Giles" em parte). **~13 desses nomes coincidem com agentes canônicos** — provável migração incompleta.

### 3.6 — `Totum OS/workspace-tony-deploy/` (5 arquivos)

Workspace operacional do agente CEO para deploy: `AGENTS.md` (boot + roster de sub-agentes), `IDENTITY.md`, `SOUL.md`, `MEMORY.md` (decisões de 18/05, rebrand Naia→Tony), `USER.md` (perfil do Rael).

### 3.7 — `Totum OS/openclaw-extract/` (19 arquivos)

Dumps da extração da VPS OpenClaw: 2 tarballs (`openclaw-deep.tgz`, `openclaw-extract.tgz`) + 1 (`sibling-extract.tgz`) e suas pastas extraídas — versão/config/endpoints/logs/plugins/env/workspace do OpenClaw, registro de plugins (`installs.json`), estrutura do agente "main". Confirma: só existe 1 agente OpenClaw na VPS, canal WhatsApp. `sibling-extract/contents.txt` está vazio (0 bytes).

### 3.8 — `Totum OS/backups/` (91 arquivos · snapshots de limpeza)

Quatro pastas datadas de maio/2026: `cleanup_20260512_094330/` (43 duplicatas da raiz + 3 arquivos únicos da fase "Totum 3.0/LobeHub"), `cleanup_20260517/` (projeto elizaOS completo + tot-kimi + processos "Modo Madrugada" + agente Giles), `cleanup_20260518/` (nota de arquivamento), `cleanup_specs_20260518/` (2 specs de refactor). Material majoritariamente **histórico e duplicado** — inclui lixo (`test.txt.deletar`, `.DS_Store`).

### 3.9 — `Totum OS/cliente-totum/` e `branding/` (nível de pasta)

- **cliente-totum/** (~150 arquivos) — projeto Next.js 15 + TypeScript + Supabase + Tailwind/shadcn: o "Central do Cliente Totum", portal multi-tenant em produção (repo `grupototum/clientes-totum`, deploy Vercel). **Não é material de agentes** — fora do escopo de auditoria de agentes, inventariado em nível de pasta.
- **branding/** (15 imagens) — assets de marca (logos word/mascote em vários tamanhos, favicon).

### 3.10 — `Totum Agentes/` (antigo · 6 arquivos · histórico)

| # | Arquivo | Tipo | Bytes | Assunto |
|---|---|---|---|---|
| 1 | AGENTES_AUTONOMOS_IMPLEMENTACAO.md | md | 16.162 | Guia de implementação de agentes autônomos (base Frontier/Manus), por TOT, 13/04. |
| 2 | PLANO-HIBRIDO-AGENTES.md | md | 8.500 | Plano híbrido de gestão: Dashboard operacional + Obsidian para conhecimento. |
| 3 | SISTEMAS_MULTI_AGENTES_COMPARATIVO.md | md | 13.772 | Guia comparativo de frameworks/arquiteturas multi-agente. |
| 4 | SKILL_LIBRARY_CATALOGO.md | md | 15.134 | Catálogo de 500+ skills para OpenClaw. |
| 5 | catalogo-agentes-agency.md | md | 30.601 | Catálogo de 149 agentes externos (agency-agents + elizaOS/the-org). |
| 6 | Vibe-Coding Master Playbook 2026.pdf | pdf | 158.501 | Manual SOP+SLA de "Vibe Coding": governança de IA, delegação por pontuação (32 págs, Kimi). |

---

## 4. ACHADOS NOTÁVEIS CONSOLIDADOS

Ordenados por gravidade para a operação. Estes são os itens que a Fase 2 e a reconciliação precisam resolver.

**A. Crise de identidade do agente-CEO (crítico).**
A mesma entidade aparece como **Naia → Tony → Pepper Potts** ao longo dos arquivos. A pasta `01-N1-Tony/` contém o `SOUL.md` da **Pepper**. SOULs de outros agentes citam `reports to` ora "Tony", ora "Pepper". Sem um nome único, a cadeia de comando é ambígua — e a Pepper é justamente a CEO que deve gerir a operação na VPS.

**B. Cinco catálogos concorrentes, nenhum eleito como único (crítico).**
Coexistem: `CATALOGO_CANONICO_UNIFICADO` (78), `CATALOGO_CANONICO_UNIFICADO_AGENTES` (v3.4), `CATALOG_v35` (54), `LISTA_GERAL_AGENTES_PARA_VALIDACAO` (41) e `Project Agentes/TODOS_OS_AGENTES` (v3.0). Os 4 relatórios em `Relatório 22-05/` divergem na mesma medida (55 / 55 / 19 / ~14). **Reconciliação proposta:** a fonte real é `Agentes-Canonicos/` = **54 agentes de IA + N0 humano**. Os relatórios que dizem "55" contam o N0; os que dizem 19 ou 14 usam catálogos antigos (v2.0) ou não acharam a pasta canônica.

**C. 30 SOULs legados fora da pasta canônica (alto).**
Dos 84 `SOUL.md`, só 54 são canônicos. Os outros 30 estão em `TOT -Kimi/agents` (28), `workspace-tony-deploy` (1) e `backups/.../giles` (1). `TOT -Kimi` é um conjunto anterior parcialmente migrado — risco de um agente ler DNA obsoleto. Precisa de uma tabela de-para e de ser marcado formalmente como arquivado.

**D. Documentos canônicos desatualizados (alto).**
`README.md` de `Agentes-Canonicos/` diz "19 SOULs" (existem 54) e cita estrutura inexistente (`_SKILLS/`, `IDENTITY.md`/`USER.md`/`permissions.yaml` por agente). `PRINCIPIOS_ARQUITETURAIS.md` usa nomes antigos (Wanda, Alfred, Tony) e modelos de LLM divergentes do `INDICE`. O `INDICE` tem header "54" mas tabela "55".

**E. Claims de "production-ready" contraditos (médio).**
`Project Agentes/` tem 3 docs declarando o sistema elizaOS pronto para produção — que o próprio `REALITY_CHECK_7DAY_ROADMAP.md` da mesma pasta classifica como "ficção". Decisões futuras não devem se basear nesses 3 docs.

**F. Migração Giles → Hermione pela metade (médio).**
Em `TOT -Kimi`, a pasta virou `hermione/` mas schemas, clientes JS e testes ainda dizem "Giles".

**G. Lixo e redundância (baixo).**
`.DS_Store` espalhados, `test.txt.deletar`, o `.zip` corrompido em `_PROPOSTAS`, `claude_root_duplicates/` (43 duplicatas). Limpeza trivial na fase de consolidação.

**H. Limitação técnica registrada.**
`Biblioteca_Melhor_Programador_IA.docx` não pôde ser extraído (lock do SO — provavelmente aberto no Word/Pages). Os 3 `.tgz` de `openclaw-extract` não puderam ser listados internamente, mas seus arquivos já-extraídos foram todos inventariados.

---

## 5. PRÓXIMO PASSO — FASE 2

A Fase 1 está concluída. A **Fase 2 — Análise por Agente** fará, para cada um dos 54 agentes canônicos, o bloco de dados detalhado (identidade, papel, nível, modelo de IA, permissões, dependências, completude do SOUL, status).

Antes da Fase 2, recomenda-se decidir o achado **A** (nome do agente-CEO), pois ele afeta a leitura de quase todos os SOULs.

**Aguardando confirmação do Rael para iniciar a Fase 2.**
