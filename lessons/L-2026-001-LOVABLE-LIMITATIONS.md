# L-2026-001: Limitações Estruturais do Lovable no Vibe Coding

**Data:** 2026
**Autor:** Playbook Vibe Code
**Área:** Prototipagem & UI

### Contexto
Utilizamos o Lovable para "Vibe Coding Puro", gerando MVPs visuais com extrema velocidade de iteração (wireframes a protótipos de alta fidelidade em 10-30 minutos).

### O Problema Encontrado (Anti-pattern)
Desenvolvedores têm a tendência de commitar o código gerado pelo Lovable diretamente em produção por ele estar "visualmente perfeito" e aparentemente funcional.

**Limitações mapeadas do código do Lovable:**
1. Arquitetura monolítica com baixa separação de concerns (prop-drilling excessivo, mistura de estado global com local).
2. Ausência profunda de tratamento de erros (falhas silenciosas em tela branca).
3. Nenhuma cobertura de testes unitários ou end-to-end automatizados.
4. Dependências de UI não auditadas (riscos de segurança por falta de linting de terceiros).

### Lição Aprendida
O Lovable deve ser tratado ESTRITAMENTE como **especificação executável** (um handoff avançado), e não como entrega final.

**Plano de Ação:**
- Extrair tokens de design e comportamento visual do Lovable.
- O código gerado deve ser "descartado" ou massivamente refatorado.
- Reimplementar a lógica de negócio separando componentes na Fase 3 (Desenvolvimento Core) com Claude, usando `React Hook Form`, tipagem forte (`Zod`), Error Boundaries e testes.
