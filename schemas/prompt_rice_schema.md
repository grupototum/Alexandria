# Schema: Prompt Arquitetural RICE

Enquanto o `prompt_atomico_schema` é geral e tático para refatorações pontuais, a fórmula **RICE** é focada para delegar Arquitetura ao Claude (O Líder de Arquitetura IA).

## A Fórmula R.I.C.E

- **R - Requisito:** O que deve ser alcançado no negócio. 
  *(Ex: O sistema precisa suportar 10.000 requisições simultâneas sem latência notável).*
- **I - Implementação:** Abordagem técnica inicial sugerida. 
  *(Ex: Proponha uma arquitetura com Redis Cluster para cache e JWT para stateless).*
- **C - Critérios:** SLA mensurável ou comportamento técnico para avaliar sucesso. 
  *(Ex: P99 da latência deve se manter < 100ms e failovers do banco devem ser invisíveis).*
- **E - Exceções:** Constraints explícitas e limites. 
  *(Ex: Não podemos usar serviços proprietários fechados tipo AWS DynamoDB, tudo precisa ser on-premise na nossa VPS).*

## Template Pronto para Cópia

```markdown
**[Requisito]**
O sistema precisa...

**[Implementação]**
Avalie e proponha o uso de...

**[Critérios]**
A validação será feita medindo...

**[Exceções]**
No entanto, evite usar...
```
