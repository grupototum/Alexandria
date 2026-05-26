# PT-2026-005: Estratégia de Testes Contínuos (QA) com Kimi Claw

**Status:** Aprovada
**Data:** 2026
**Contexto:**
A antiga abordagem de testes com Visual FoxPro e PHP falhava por ter dados compartilhados, não-determinismo e falta de isolamento (sem rollback).

**Decisão:**
Adoção do Kimi Claw como Agente de Testes Contínuo e Autônomo com as seguintes especificações:

1. **Memória de Longo Prazo:** Kimi Claw utilizará PostgreSQL ou SQLite locais para indexar o AST do projeto, lembrando correlações históricas de código e teste.
2. **Ambiente Isolado (Caixa Preta/Cinza):** Testes E2E (com Playwright) e de API executarão em contêineres efêmeros (Docker Compose / Testcontainers).
3. **Mocks Locais via Ollama:** Para evitar flakiness e exposição de dados reais, qualquer chamada externa sensível ou dados sintéticos volumosos em testes de carga será orquestrada localmente pelo Ollama (ex: qwen2.5-coder para histórico sintético, llama3.2 para PII fake).

**Impacto:**
Substituição dos testes de verificação "pós-fato" por especificações de comportamento automatizadas em CI/CD, garantindo 100% de cobertura nos fluxos E2E críticos e 80% em testes unitários sob < 5 minutos.
