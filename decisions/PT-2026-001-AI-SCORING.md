# PT-2026-001: Framework de Delegação por Pontuação (AI Scoring)

**Status:** Aprovada
**Data:** 2026
**Contexto:**
A seleção e delegação de tarefas para ferramentas de IA em 2026 requer rigor técnico para evitar introdução de dívida técnica e vulnerabilidades de segurança (exposição de PII).

**Decisão:**
Adoção do Vibe-Coding Master Playbook com as seguintes atribuições de papéis restritos:

1. **Claude 3.7 Sonnet (Líder de Arquitetura):**
   - Melhor lógica e refatoração.
   - Responsável por decisões técnicas complexas e code review final.
   - Usado para definir padrões de projeto, camadas de abstração e persistência de dados.

2. **Gemini 2.5 Pro (Analista de Dados & Documentação):**
   - Usado para análise de codebases gigantescas (Context window de 2M tokens).
   - Documentação técnica e extração de padrões em lote.

3. **Lovable (Gerador de UI):**
   - Vibe coding puro para gerar MVPs visuais rapidamente.
   - **Regra:** Código gerado por Lovable serve como especificação executável (handoff), mas NÃO é commitado diretamente sem reimplementação ou refatoração no Core.

4. **Ollama / Modelos Locais (Cofre de Privacidade):**
   - Obrigatório para processamento de PII (dados financeiros, saúde).
   - Operação 100% local com zero transmissão externa.

5. **Kimi Claw (Especialista em Testes & Agentes):**
   - Especializado em automação contínua, geração de testes unitários/E2E e orquestração de Agentes IA integrados ao longo prazo.

**Impacto:**
Essas restrições garantem que não usaremos ferramentas de interface (Lovable) para tomar decisões profundas de banco de dados, nem ferramentas em nuvem genéricas para processar dados sensíveis dos inquilinos/clientes.
