# PT-2026-004: Regra de Ouro "One Change per Prompt"

**Status:** Aprovada
**Data:** 2026
**Contexto:**
A IA generativa consegue alterar vários módulos e funcionalidades em uma mesma passada (o chamado "Kitchen Sink" anti-pattern). Isso gera interações imprevisíveis, dificulta o rollback via git revert, e quebra o rastreio do débito técnico.

**Decisão:**
Instituir formalmente a restrição atômica **One Change per Prompt**.

**Obrigações do Desenvolvedor (Human-in-the-loop):**
1. **Redução de Complexidade:** A IA ou o programador deve modificar apenas UMA intenção por prompt/commit.
2. **Prompts Atômicos:** Todo prompt inserido no Claude/Roo Code/Cursor deve obrigatoriamente possuir os 4 pilares:
   - *Contexto* (Arquivos e dependências).
   - *Intenção* (O porquê e o quê, limitados a uma feature).
   - *Restrições* (O que NÃO modificar, qual biblioteca de validação focar).
   - *Critério de Sucesso* (Teste unitário ou manual para validar).
3. **Anti-Padrões a Evitar:**
   - Vague Intent ("melhore isso").
   - Nested Change ("aproveite para refatorar Y").
   - Implicit Dependency ("adicione X que depende de Z que não existe").

**Impacto:**
Redução de 40% no tempo de Code Review. MTTR (Mean Time to Recovery) reduzido para < 15 minutos em caso de reversão de feature quebrada pela IA.
