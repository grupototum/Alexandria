# Inventário de Agentes — 2026-05-13

## Resumo

| Fonte | Quantidade | Estado |
|---|---:|---|
| `DNAS_39_AGENTES/` | 39 | Todos têm equivalente em `src/agents/` |
| `DNAS_AGENCY_AGENTS/` | 28 | Todos têm equivalente em `src/agents/` |
| `src/agents/` | 67 | Fonte operacional principal no Totum-OS |
| `totum-system/src/agents/*.md` | 17 | Fonte legada/paralela; matriz de conciliação criada |
| `Totum-Chat/agents-index.json` | 1 | Agente padrão `alexandria-skill-discovery` versionado |

## Fonte Operacional Recomendada

Use `src/agents/<slug>/` como estrutura canônica para agentes executáveis no Totum-OS:

- `AGENT.md`: DNA/prompt legível por humanos
- `character.json`: configuração compatível com runtime/ElizaOS

As pastas `DNAS_39_AGENTES/` e `DNAS_AGENCY_AGENTS/` devem ser tratadas como fonte histórica/importação, não como runtime principal.

## DNAs de Agência Convertidos Nesta Rodada

Estes 10 arquivos existiam apenas em `DNAS_AGENCY_AGENTS/` e foram convertidos para `src/agents/` com `AGENT.md`, `character.json` e entrada em `src/lib/agents-registry.json`:

| DNA | Destino operacional |
|---|---|
| `aa-marketing-content-creator` | `src/agents/marketing_content_creator/` |
| `aa-marketing-instagram-curator` | `src/agents/marketing_instagram_curator/` |
| `aa-marketing-seo-specialist` | `src/agents/marketing_seo_specialist/` |
| `aa-marketing-tiktok-strategist` | `src/agents/marketing_tiktok_strategist/` |
| `aa-paid-media-creative-strategist` | `src/agents/paid_media_creative_strategist/` |
| `aa-paid-media-paid-social-strategist` | `src/agents/paid_social_strategist/` |
| `aa-paid-media-ppc-strategist` | `src/agents/paid_media_ppc_strategist/` |
| `aa-paid-media-tracking-specialist` | `src/agents/paid_media_tracking_specialist/` |
| `aa-sales-outbound-strategist` | `src/agents/sales_outbound_strategist/` |
| `aa-support-analytics-reporter` | `src/agents/support_analytics_reporter/` |

## Agentes Legados em `totum-system`

Arquivos markdown encontrados em `totum-system/src/agents/`:

`analista`, `chandler`, `chaplin`, `data`, `dona-clawdete`, `giles`, `git`, `guardiao`, `miguel`, `monk`, `pablo-marcal`, `pablo-marcal-checklist`, `radar`, `sabia`, `transcritor`, `watson`, `yoda`.

Antes de copiar qualquer um para `Totum-OS`, decidir se cada agente é:

- duplicado de um agente já existente;
- persona útil para manter como agente de apoio;
- legado a arquivar;
- material a assimilar na Alexandria como conhecimento/contexto, não como agente.

A decisão inicial está documentada em `docs/AGENTS_LEGACY_RECONCILIATION_2026-05-13.md`.

## Próximas Ações

1. Criar uma matriz “agente → fonte → status → onde roda”: Totum-OS, LobeChat, Alexandria ou legado.
2. Separar material legado que deve ser assimilado na Alexandria como POP/contexto.
3. Decidir se `sabia`, `data`, `chaplin` Remotion e `pablo-marcal` noturno entram como agentes runtime.
4. Revisar agentes existentes com `adjectives` contaminado por prompt antigo e limpar em rodada separada.
5. Testar no mínimo os agentes core: SEO, PPC, Content, Analytics, Tracking, Instagram, TikTok, Outbound, TOT/Totum AI, Radar, Auditor, Visu.
