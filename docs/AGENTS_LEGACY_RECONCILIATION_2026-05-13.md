# Conciliação de Agentes Legados — 2026-05-13

## Escopo

Fonte analisada: `../totum-system/src/agents/*.md`.

Objetivo: decidir o destino dos 17 markdowns legados sem criar arquitetura paralela nem duplicar agentes que já existem em `Totum-OS/src/agents/`.

## Decisão Operacional

`Totum-OS/src/agents/<slug>/` continua sendo a fonte canônica para agentes executáveis. Os markdowns do `totum-system` devem ser tratados como fonte legada e migrados apenas quando trouxerem capacidade operacional distinta.

## Matriz de Conciliação

| Legado | Decisão | Destino recomendado | Observação |
|---|---|---|---|
| `analista.md` | Assimilar como conhecimento | Alexandria | Conteúdo de curadoria/análise aplicada à Totum; sobrepõe parcialmente `analyst`, mas é mais útil como protocolo de análise de conteúdo. |
| `chandler.md` | Mesclar | `tot_social` + `support_analytics_reporter` | Persona de análise social/trends; não precisa runtime separado antes de teste real. |
| `chaplin.md` | Duplicado parcial | Revisar contra `chaplin` existente | O `chaplin` canônico já existe, mas o legado foca Remotion/motion design enquanto o atual foca YouTube/video SEO. |
| `data.md` | Candidato a novo agente | `src/agents/data/` ou Alexandria | Capacidade de desenvolvimento técnico; migrar só se for usado como agente interno de programação, senão documentar como skill/processo. |
| `dona-clawdete.md` | Assimilar como visão/processo | Alexandria | Material de operação autônoma; contém premissas de custo/processo, não deve entrar como runtime sem revisão de segurança e custo. |
| `giles.md` | Substituído por Hermione/Alexandria | Alexandria | Giles foi renomeado/substituído pelo conceito Hermione/Alexandria; não criar agente `giles` novo. |
| `git.md` | Assimilar como skill | Alexandria / rotina de scouting | GitHub scout é melhor como protocolo/skill de pesquisa do que agente separado agora. |
| `guardiao.md` | Mesclar | `guardian` | O `guardian` canônico existe; legado traz lógica de interceptação/códigos otimizadores e pode enriquecer o prompt depois. |
| `miguel.md` | Arquivar privado | Não migrar para runtime | Conteúdo pessoal/valores familiares; manter fora da operação pública de agentes. |
| `monk.md` | Assimilar como protocolo | Alexandria | Análise obsessiva/processual de conteúdo; útil como POP ou checklist, não como runtime imediato. |
| `pablo-marcal-checklist.md` | Assimilar como POP | Alexandria | Checklist operacional noturno; não é agente. |
| `pablo-marcal.md` | Mesclar | `pablo` ou agente noturno futuro | `pablo` canônico existe, mas hoje é prospecting LinkedIn; decidir se o modo noturno vira outro agente ou POP. |
| `radar.md` | Mesclar | `radar_growth` / `monitor_news` | Monitor global de tendências; já há família Radar e monitoramento. |
| `sabia.md` | Candidato a novo agente | `src/agents/sabia/` | Monitor de tendências brasileiras é distinto e pode complementar Radar global. |
| `transcritor.md` | Assimilar como skill/serviço | Alexandria / automação local | Transcrição é ferramenta/pipeline (`yt-dlp`, `ffmpeg`, Whisper), não precisa persona de chat. |
| `watson.md` | Mesclar | `sherlock` | Investigação/dedução já existe em `sherlock`; legado pode enriquecer método de relatório. |
| `yoda.md` | Mesclar | `radar_growth` / `monitor_news` / `git` skill | Scouting noturno de GitHub/Hugging Face/Product Hunt; melhor como rotina/protocolo antes de runtime. |

## Itens Que Podem Virar Agente Depois

Prioridade para migração real, se Rael quiser ampliar o runtime:

1. `sabia`: monitor brasileiro de tendências tech.
2. `data`: agente técnico interno, se for separado de Codex/Claude Code.
3. `chaplin`: só se a versão Remotion/motion design for mantida como capacidade distinta do `chaplin` atual.
4. `pablo-marcal`: só se o modo noturno for separado do `pablo` de prospecting.

## Itens Para Alexandria

Conteúdo assimilado na Alexandria em 2026-05-13 como POP/protocolo/contexto:

- `analista`
- `dona-clawdete`
- `giles`
- `git`
- `monk`
- `pablo-marcal-checklist`
- `transcritor`
- partes úteis de `guardiao`, `watson`, `radar`, `yoda`, `chandler`

Validação: busca por `Legacy Agent DNA` retornou os pacotes legados assimilados. `pablo-marcal-checklist` entrou como `pop`; os demais entraram como `context_pack`.

Observação de cleanup: o teste inicial criou entradas duplicadas de `analista` antes do lote final. IDs encontrados:

- `d1d5d46b-87d6-451e-921a-d057e8fafb44` — parcial, título `Legacy Agent DNA: analista`
- `57018869-8dd2-4ea4-8eda-842c4f6a2578` — duplicado full
- `d90edd48-b127-43f1-96fd-eb7eae20e195` — full mais recente, manter

## Próxima Ação

Próximas ações:

- remover/deprecar as duas entradas antigas de `analista` quando houver rota/admin segura;
- decidir se `sabia`, `data`, `chaplin` Remotion e `pablo-marcal` noturno entram como agentes runtime;
- enriquecer agentes canônicos (`guardian`, `sherlock`, família `radar`) com trechos legados só depois de teste manual.

Não migrar todos automaticamente para `src/agents/`: isso recriaria duplicação e bagunçaria o catálogo operacional.
