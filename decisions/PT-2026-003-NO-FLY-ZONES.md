# PT-2026-003: No-Fly Zones (Limites de Delegação IA)

**Status:** Aprovada
**Data:** 2026

**Decisão:**
Ficam estabelecidas "No-Fly Zones" — áreas estritas onde a decisão HUMANA é obrigatória, com intervenção manual e overrides, independentemente da recomendação do modelo gerador de IA.

1. **Segurança (Aprovação: CTO + Security Lead)**
   - Algoritmos de criptografia.
   - Gestão de secrets e chaves de API.
   - Políticas de CORS e vulnerabilidades não detectáveis.
2. **Privacidade (Aprovação: CDO + DPO)**
   - Classificação de dados como PII (Informações Pessoalmente Identificáveis).
   - Decisões de retenção e deleção de dados (LGPD/GDPR).
3. **Arquitetura Crítica (Aprovação: CTO)**
   - Escolha de padrão de banco de dados.
   - Estratégia de sharding.
   - Trade-offs de consistência vs. disponibilidade.
4. **Experiência Crítica de Usuário (Aprovação: Product Lead + CAIO)**
   - Fluxos de checkout e pagamentos.
   - Onboarding core e recuperação de contas.
5. **Ética e Conformidade (Aprovação: CAIO + Jurídico)**
   - Moderação de conteúdo.
   - Algoritmos de scoring de usuário com potencial de viés algorítmico.

**Mecanismo:**
Todo override deve ser documentado em um Decision Log (como este diretório) atrelando o ticket de incidente.
