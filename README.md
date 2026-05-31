# Alexandria - Fonte Canônica Totum OS

Alexandria é a fonte canônica de conhecimento do Totum OS. Aqui vivem decisões, projetos, lições, contatos e schemas.

## Estrutura

- `AGENT_ARCHITECTURE.md` → **MUITO IMPORTANTE:** Arquitetura de "Cascata Circular" (Regras de Operação p/ Agentes Autônomos).
- `decisions/` → Decisões estratégicas permanentes
- `projects/` → Projetos ativos
- `lessons/` → Lições aprendidas
- `people/` → Contatos importantes
- `tracking/` → Tracking IDs (PT-YYYY-XXX)
- `schemas/` → Schemas canônicos (JSON Schema)
- `integrations/` → Configurações de integrações
- `logs/` → Logs de auditoria

## Como usar

1. **Criar decisão:** Usar template em `decisions/`
2. **Criar projeto:** Usar template em `projects/`
3. **Registrar lição:** Usar template em `lessons/`
4. **Adicionar contato:** Usar template em `people/`
5. **Tracking ID:** Seguir padrão `PT-YYYY-XXX` em `tracking/`

## Integrações

- OpenClaw: `integrations/openclaw.md`
- Flowise: `integrations/flowise.md`
- n8n: `integrations/n8n.md`

## Princípios

- **Versionamento:** Tudo em Git
- **Formato:** Markdown + JSON Schema
- **Auditoria:** Logs em `logs/`
- **Clareza:** Templates claros, sem ambiguidade
- **Escalabilidade:** Estrutura cresce incremental, sem retrabalho
