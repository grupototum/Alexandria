# SLA-2026-001: Performance, Acessibilidade e Segurança

Contrato técnico para garantir que a experiência do "Vibe Coding" se converta em um produto de nível Enterprise.

## 1. Core Web Vitals (Desempenho)
- **LCP (Largest Contentful Paint):** ≤ 2.5s (Mobile), ≤ 1.8s (Desktop para Landing Pages). Otimização via WebP/AVIF e Critical CSS.
- **INP (Interaction to Next Paint):** ≤ 200ms. Otimizado com Virtualização de listas, Debounce em botões e `requestAnimationFrame`.
- **CLS (Cumulative Layout Shift):** ≤ 0.1. Otimizado declarando `aspect-ratio`, explicitando tamanhos de imagem e reservando placeholders.

## 2. Acessibilidade (WCAG 2.1 AA)
- Contraste 4.5:1.
- Uso de rótulos ARIA adequados.
- Testes automatizados por via de `axe-core`.

## 3. SLA de Disponibilidade (Uptime)
- **Web Apps (ERP/CRM):** 99.9% (~43 minutos/mês de queda).
- **MicroSaaS:** 99.9% em horário comercial.
- **PWAs:** 99.5%.
- **Respostas de Incidente P1:** 15 min de resposta, 1 hora para resolução (Escalada CTO + CDO imediata).

## 4. Segurança Obrigatória
- **Em trânsito:** TLS 1.3 obrigatório (AEAD sem CBC), ECDSA P-256 ou RSA 2048+. 
- **Em repouso:** AES-256 via TDE ou KMS em DB/Backups.
