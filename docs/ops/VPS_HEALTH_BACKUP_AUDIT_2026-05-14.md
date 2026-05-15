# VPS Health and Backup Audit - 2026-05-14

## Scope

Read-only audit of the Hostinger VPS operational scripts and runtime state for the Totum 3.0 hardening queue.

The audit focused on:

- Root healthcheck and backup scripts under `/root/totum-ops`.
- Cron schedules for healthchecks and backups.
- Docker container health and local service endpoints.
- Backup coverage for PostgreSQL, Docker volumes, and bind-mounted service directories.
- Immediate hardening gaps that should be resolved before expanding Phase 5 automation.

No VPS service was modified during this audit.

## Runtime Status

The following services were observed running and healthy:

- `totum-chat`
- `alexandria-api`
- `n8n`
- `upixel-api`
- `meta-mcp-server`
- `evolution-api`
- `ollama-totum`
- `postgres-totum`
- `redis-totum`
- `openclaw-totum`

Local HTTP checks returned `200` for the expected internal endpoints:

- LobeChat: `http://127.0.0.1:3210/chat`
- Alexandria API: `http://127.0.0.1:5000/health`
- n8n: `http://127.0.0.1:5678/healthz`
- uPixel API: `http://127.0.0.1:3001/health`
- Meta MCP: `http://127.0.0.1:3000/health`
- Ollama: `http://127.0.0.1:11435/api/tags`
- OpenClaw: `http://127.0.0.1:63722/`

Disk usage was acceptable at audit time: roughly one third of the primary disk in use.

## Root Ops Scripts

The VPS has a root ops folder at `/root/totum-ops` with:

- `healthcheck.sh`
- `backup-postgres.sh`
- `backup-volumes.sh`
- `backup-bind-dirs.sh`
- `alert.sh`
- `alert.env`
- `logs/`
- `backups/`

### Healthcheck

`healthcheck.sh` runs every 5 minutes from root cron and checks both container presence and local HTTP endpoints.

Expected containers in the script:

- `totum-chat`
- `openclaw-totum`
- `alexandria-api`
- `n8n`
- `upixel-api`
- `meta-mcp-server`
- `evolution-api`
- `ollama-totum`
- `postgres-totum`
- `redis-totum`

When failures occur, the script calls `alert.sh` with a `healthcheck_failed` event.

### Alerts

`alert.sh` uses `alert.env` and Evolution API to send notifications. The alert configuration contains sensitive operational credentials and must stay out of Git.

The logs showed evidence of a prior dry-run test. A live alert validation routine is still recommended.

## Cron Schedule

Root cron contained:

- Every 5 minutes: `/root/totum-ops/healthcheck.sh`
- Daily 03:17: `/root/totum-ops/backup-postgres.sh`
- Daily 03:47: `/root/totum-ops/backup-volumes.sh`
- Daily 04:27: `/root/totum-ops/backup-bind-dirs.sh`

There is also Hestia backup activity around 05:10.

## Backup Coverage

### PostgreSQL

`backup-postgres.sh` runs `pg_dumpall` against `postgres-totum` and stores compressed SQL dumps under:

`/root/totum-ops/backups/postgres`

Retention is currently 14 days.

The logical dump covers the observed databases:

- `apps_totum`
- `evolution`
- `n8n`
- `postgres`
- `totum_system`
- `upixel_crm`

### Docker Volumes

`backup-volumes.sh` currently backs up:

- `compose_n8n_data`
- `compose_evolution_instances`
- `compose_redis_data`

Retention is currently 14 days.

Observed active volumes also include:

- `compose_postgres_data`
- `compose_ollama_data`

`compose_postgres_data` is covered logically by `pg_dumpall`, but it is not backed up as a raw Docker volume. `compose_ollama_data` is not backed up and should be treated as either rebuildable model cache or added to a backup plan depending on recovery time expectations.

### Bind-Mounted Directories

`backup-bind-dirs.sh` currently backs up:

- `/home/totum/totum-chat`
- `/docker/openclaw-j0bu/data`
- `/home/totum/alexandria-api`

Retention is currently 14 days.

Important directories not currently covered by this script:

- `/docker/compose`
- `/docker/upixel`
- `/home/totum/meta-mcp`
- `/etc/nginx/conf.d/domains`
- `/root/totum-ops`

These should be added carefully because some contain secrets. Backups should be encrypted or moved to a secured destination before expanding coverage.

## Findings

### Critical

1. Backups are local to the same VPS disk.

If the VPS disk is lost, the current backup plan is not enough. Add offsite backups to S3-compatible storage, Google Drive, another server, or a managed backup target.

2. Sensitive values exist in root-level operational configuration.

The compose and alert files contain operational secrets. These values should be moved to `.env`/secret-managed files where possible, permissions should be reviewed, and exposed credentials should be rotated after migration.

3. A root-only password note exists on the VPS.

The file should be moved into a password manager or removed after confirming the intended access path. Do not version it and do not copy it into project repos.

### Medium

1. Backup coverage misses operational source/config directories.

The current bind-dir backup captures chat, OpenClaw data, and Alexandria API, but misses core compose, nginx, uPixel, meta-mcp, and ops scripts.

2. Alerting has not been proven with a recent live failure simulation.

The healthcheck calls `alert.sh`, but the notification path should be tested with a controlled dry-run/live mode so failures are not discovered only during an outage.

3. Docker volumes contain many unused historical volumes.

Do not prune blindly. First inventory ownership, age, and whether any service has hidden dependency on them. After backup, remove obsolete volumes in a controlled cleanup window.

4. The root compose file contains services and port mappings that do not match the current active runtime exactly.

There is a latent local port conflict around `127.0.0.1:3001` if inactive services are started as-is. The active process is healthy, but the compose source should be reconciled before relying on it for disaster recovery.

### Low

1. Ollama models are not in backup scope.

This may be acceptable if models are documented and easy to repull. If recovery time matters, either back up `compose_ollama_data` or document the exact model pull commands.

2. Hestia backups exist, but they are not a full replacement for app-specific recovery.

Keep Hestia as an additional layer, not as the primary recovery plan for Docker workloads.

## Recommended Remediation Order

1. Add offsite backup target for `/root/totum-ops/backups`.
2. Extend backup coverage for critical config/source directories, using encrypted storage when secrets are included.
3. Move root compose secrets into `.env`/secret-managed files and rotate credentials already known to have been exposed.
4. Add a documented restore drill for PostgreSQL, n8n, Alexandria API, and Totum Chat.
5. Test the alert path with a controlled live validation.
6. Reconcile `/docker/compose/docker-compose.yml` against the actually running services.
7. Inventory unused Docker volumes and prune only after backup and service-owner confirmation.

## Status

Item 2 of the hardening sequence is audited and documented.

The VPS is currently healthy, but operational hardening is not finished until offsite backup, secret rotation, restore validation, and compose reconciliation are completed.
