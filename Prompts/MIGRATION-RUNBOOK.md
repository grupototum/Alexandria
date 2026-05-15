# Runbook de Migração Alibaba → Hostinger

**Início:** 2026-05-04
**Responsável:** Israel (Rael) + Claude Code
**Objetivo:** Decommissionar Alibaba VPS (`43.98.170.199`) consolidando tudo no Hostinger VPS (`187.127.4.140`)

---

## Restrições confirmadas

- ⛔ **Upixel + Evolution são intocáveis** — não migrar, não desligar enquanto não houver plano próprio
- ⏳ **Migração efetiva só após apresentação** — fase de prep pode rodar antes
- ✅ **Sem janela de manutenção** — pode operar livremente (exceto Upixel)
- 🗑️ **Containers Docker parados no Alibaba** — podem ser removidos (já confirmado pelo Rael)

---

## Estado inicial (inventário Alibaba — coletado 2026-05-04)

### Containers Docker ativos
| Container | Image | Status | Porta |
|---|---|---|---|
| lobe-chat | lobehub/lobe-chat:latest | Up 16h (healthy) | 3210 |
| vaultwarden | vaultwarden/server:latest | Up 5 dias (healthy) | 4000 |

### Containers/serviços Docker parados
- `/opt/docker-apps/docker-compose.yml` — Redis, Beszel, Vaultwarden, Docmost+PG, Duplicati, FileFlows, Documenso+PG, Immich+ML+PG+Redis, Blesta+MariaDB, Ollama
- `/opt/docker-services/docker-compose.yml` — stark-api, totum, totum-backend
- `/opt/traefik/docker-compose.yml` — Traefik, Upixel CRM, Totum System, Stark API, Landing page

### PM2 (serviços ativos)
| Serviço | Porta | URL |
|---|---|---|
| openclaw-gateway | 18789-18792 | openclaw.grupototum.com |
| stark-api | 3001 | stark.grupototum.com |
| api-tot | 3334 | api-tot.grupototum.com |
| sre-dashboard | 8091 | — |

### Cloudflare Tunnel
- **Tunnel ID:** `a28ebbe1-7d1b-44e4-9ece-bcb04d4c50af`
- **Nome:** totum-apps
- **Hostnames roteados:**
  - `vault.grupototum.com` → localhost:4000
  - `chat.grupototum.com` → localhost:3210
  - `stark.grupototum.com` → localhost:3001 + localhost:4174
  - `api-tot.grupototum.com` → localhost:3334
  - `openclaw.grupototum.com` → localhost:18789
  - `tunnel.grupototum.com` → localhost:4174
  - `totum.pixelsystem.online` → localhost:4174

### Recursos Alibaba
- RAM: 7.1 GB total, 2.3 GB usado
- Disco: 40 GB total, 28 GB usado (73%), 11 GB livre
- CPU: 2 cores
- Swap: 4 GB

### Issues conhecidos
| Issue | Severidade | Ação |
|---|---|---|
| Cloudflare token hardcoded em /opt/traefik/docker-compose.yml | 🔴 Alta | Rotacionar após migração |
| Stark API definida em 2 lugares (traefik + docker-services) | 🟡 Média | Decidir código oficial antes de migrar |
| Port conflict 4174 (traefik + docker-services) | 🟡 Média | Já resolvido ao limpar containers parados |
| Containers parados em docker-apps | 🟢 Baixa | Remover (aprovado pelo Rael) |

---

## Fase 0 — Pré-flight

- [x] Plano criado e revisado (Opus + Claude Code)
- [x] Runbook criado
- [ ] Acesso SSH/API ao Hostinger confirmado
- [ ] Inventário Hostinger coletado
- [ ] Capacidade Hostinger validada (RAM, disco)
- [ ] Cloudflare tunnel credentials no Hostinger

**GATE:** não iniciar Fase 1 sem acesso ao Hostinger confirmado.

---

## Fase 1 — Inventário detalhado

- [ ] Inventário completo Alibaba (PM2 jlist, docker volumes, nginx)
- [ ] Inventário completo Hostinger
- [ ] Capacidade validada

---

## Fase 2 — Backups

- [ ] Backup Vaultwarden → `/backups/vw-backup.tgz`
- [ ] Backup PM2 dump → `/backups/pm2-dump.json`
- [ ] Backup código PM2 apps → `/backups/pm2-apps.tgz`
- [ ] Backup configs (cloudflared, nginx) → `/backups/configs.tgz`
- [ ] LobeChat IndexedDB export (manual pelo Rael no browser)
- [ ] Validar todos os backups (tar tzf)

**GATE:** nenhum backup vazio ou corrompido.

---

## Fase 3 — Preparar Hostinger

- [ ] Docker, Node.js, PM2, cloudflared instalados
- [ ] Estrutura /opt/totum criada
- [ ] Backups enviados pro Hostinger
- [ ] Tunnel credentials copiadas

---

## Fase 4 — Migrar serviços (ordem: Vaultwarden → PM2 services → LobeChat)

- [ ] Vaultwarden up no Hostinger + curl 200
- [ ] openclaw-gateway up no Hostinger
- [ ] stark-api up no Hostinger
- [ ] api-tot up no Hostinger
- [ ] LobeChat up no Hostinger + healthcheck verde

**GATE:** todos os serviços respondendo internamente antes de trocar Cloudflare.

---

## Fase 5 — Repoint Cloudflare Tunnel

Ordem: `vault` → `stark` → `api-tot` → `openclaw` → `chat`

- [ ] vault.grupototum.com → Hostinger ✅
- [ ] stark.grupototum.com → Hostinger ✅
- [ ] api-tot.grupototum.com → Hostinger ✅
- [ ] openclaw.grupototum.com → Hostinger ✅
- [ ] chat.grupototum.com → Hostinger ✅
- [ ] Smoke test todos os endpoints (curl 200)
- [ ] Alexandria plugin funciona no LobeChat

**GATE:** todos 200 + demo funcional.

---

## Fase 6 — Decommission Alibaba (24h+ após Fase 5)

⚠️ **NÃO executar enquanto Upixel + Evolution estiverem no Alibaba sem plano de migração**

- [ ] Stop services Alibaba (reversível)
- [ ] 24-48h sem incidente
- [ ] Rael cancela Alibaba no painel (manual)

---

## Comandos executados

*(preencher durante execução)*

---

## Decisões pendentes

1. **Upixel + Evolution:** manter Alibaba vivo por isso? Migrar junto? Plano separado?
2. **Stark API código oficial:** `/root/.openclaw/workspace/src/stark-api` vs `/opt/stark-api`
3. **LobeChat server mode:** seguir IndexedDB por ora (confirmado — server mode é follow-up)
4. **Cloudflare token exposto:** rotacionar após migração

---

*Runbook gerado em 2026-05-04. Atualizar a cada operação.*
