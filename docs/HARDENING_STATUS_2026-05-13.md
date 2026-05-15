# Hardening Status — Totum 3.0 — 2026-05-13

## Snapshot

| Área | Estado | Evidência | Próxima ação |
|---|---|---|---|
| Totum Chat | Saudável | `https://chat.grupototum.com/chat` respondeu HTTP 200; container `totum-chat` healthy em `127.0.0.1:3210` | Validar uso real com sócios e registrar plugin Alexandria na UI se ainda não estiver persistido. |
| Alexandria API | Saudável | `https://alexandria.grupototum.com/health` respondeu `{"status":"ok","service":"alexandria-api"}` | Monitorar uptime e versionar rotina de restore. |
| Alexandria Plugin | Saudável por contrato HTTP | Manifest Supabase `alexandria-proxy` v1.1 expõe `searchAlexandria`, `getPop`, `getClientBrief`; busca por `Legacy Agent DNA: analista` retorna apenas o artefato canônico após filtro de deprecated | Testar chamada dentro da UI do LobeChat com sessão/código de acesso. |
| Fase 5 manual | Validada | Workflow n8n `alexandria-capture-intake` ativo; teste controlado em 2026-05-14 confirmou leitura de `ALEXANDRIA_CAPTURE_TOKEN` via env e criou artefato, depois deprecado | Migrar para credential nativa n8n continua desejável, mas env access está funcional. |
| Fase 5 legado | Validada | 12 markdowns legados de agentes foram enviados para Alexandria; duplicatas `Legacy Agent DNA: analista` foram deprecadas e apontam para o artefato canônico | Criar rotina/admin segura para limpeza física futura, se necessário. |
| n8n | Saudável | `https://n8n.grupototum.com` respondeu HTTP 200; container `n8n` healthy | Planejar upgrade controlado e backup de workflows/credentials. |
| Domínio do sistema | Saudável | `https://totum.pixelsystem.online` respondeu HTTP 200 em Vercel | Usar este domínio como sucessor de `system.grupototum.com`. |
| Legacy Totum-OS | Decisão alterada | O legado permanece em `https://apps.grupototum.com`; `legacy.grupototum.com` não é mais requisito de cutover | Não aplicar patch Nginx de legacy nesta rodada. |
| VPS Docker | Saudável | Containers healthy: `totum-chat`, `alexandria-api`, `n8n`, `upixel-api`, `meta-mcp-server`, `evolution-api`, `ollama-totum`, `postgres-totum`, `redis-totum`; scripts root auditados em `docs/ops/VPS_HEALTH_BACKUP_AUDIT_2026-05-14.md` | Fechar offsite backup, rotação de segredos e restore drill. |
| Disco VPS | Saudável | `/dev/sda1` com 63G usados de 193G, 33% | Adicionar alerta antes de 75%. |

## Limitação de Acesso Observada

O SSH atual entra como usuário `totum`. Com esse usuário foi possível validar containers, composes em `/home/totum` e endpoints públicos.

Em 2026-05-14, os scripts root foram auditados de forma read-only usando bind mount Docker. O usuário `totum` pertence ao grupo `docker`, mas `sudo` ainda exige senha. Nenhum serviço foi alterado durante a auditoria.

## Configurações Versionáveis Confirmadas na VPS

- `/home/totum/totum-chat/docker-compose.yml`
- `/home/totum/totum-chat/nginx-chat.conf`
- `/home/totum/alexandria-api/docker-compose.yml`
- `/home/totum/meta-mcp/docker-compose.yml`

## Decisão Sobre Legacy

Em 2026-05-14, Rael decidiu que o Totum-OS legado pode permanecer em `https://apps.grupototum.com`.

Com isso, `legacy.grupototum.com` deixa de ser parte obrigatória do plano. A evidência anterior continua útil apenas como diagnóstico histórico: o domínio estava caindo no default da VPS e servindo Upixel, mas não vamos gastar tempo corrigindo isso enquanto `apps.grupototum.com` seguir sendo o destino aceito do legado.

## Próxima Ordem Recomendada

1. Configurar offsite backup para `/root/totum-ops/backups`.
2. Expandir backup de configs críticas com armazenamento criptografado.
3. Migrar segredo do workflow n8n para credential nativa quando houver janela segura de UI/admin.
4. Rotacionar credenciais expostas ou hardcoded já identificadas; `clientes-totum` já aceita `sb_secret_*` no commit `aeb596b`.
5. Testar plugin Alexandria dentro do LobeChat com um agente real.
6. Criar restore drill para PostgreSQL, n8n, Alexandria API e Totum Chat.
