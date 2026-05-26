# PT-2026-002: Ciclo de Vida do Desenvolvimento (The Vibe Loop)

**Status:** Aprovada
**Data:** 2026
**Contexto:**
A velocidade do "vibe coding" (geração acelerada por IA) frequentemente compromete a qualidade caso não haja um processo estruturado de validação de entregas.

**Decisão:**
Fica estabelecido o ciclo "Vibe Loop" em 5 Fases rigorosas:

1. **Ideação e Design System:** 
   - Ferramentas: Google Stitch + Figma + Adobe.
   - Geração de wireframes e especificação visual. Output: Tokens de design.
2. **Prototipagem Rápida:**
   - Ferramentas: Lovable + Manus.
   - Validação de ideias com MVPs jogáveis. Validação de problema antes do código.
3. **Desenvolvimento Core:**
   - Ferramentas: VS Code (Roo Code/Continue) + Claude + Gemini.
   - Reimplementação robusta da prototipagem com clean architecture e prompts atômicos.
4. **Processamento de Dados e Backend Seguro:**
   - Ferramentas: Ollama (Local/VPS) + Kimi.
   - Dados PII restritos ao backend local. Comunicação segura via TLS 1.3 e WireGuard.
5. **Deploy e Operação Contínua:**
   - CI/CD automatizado com Kimi Claw para testes antes da aprovação em produção.

**Consequências:**
Não pular etapas. A fase de Prototipagem (Lovable) não substitui a Fase Core. Todo código gerado precisa passar pelo pipeline de Qualidade.
