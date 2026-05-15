# Alexandria

Standalone Alexandria app for `alexandria.grupototum.com`.

This service exposes the Alexandria knowledge interface and API currently running on the Hostinger VPS at `/home/totum/alexandria-api`. It is separate from the Supabase Edge Functions versioned in Totum-OS (`alexandria-proxy`, `alexandria-mcp`, `skills-sync`).

## Production Snapshot

- URL: `https://alexandria.grupototum.com`
- App: `GET /`
- Health: `GET /health`
- Runtime: Node.js 20 + Express
- Container: `alexandria-api`
- VPS source path at inventory time: `/home/totum/alexandria-api`
- Supabase project: `cgpkfhrqprqptvehatad`

## Local Run

```bash
cp .env.example .env
npm install
npm run dev
```

Local runs load `.env` automatically. Fill `ALEXANDRIA_API_TOKEN` and send it as
`x-alexandria-token` when using ingestion endpoints.

## Docker Run

```bash
cp .env.example .env
docker compose up -d --build
curl http://127.0.0.1:5000/health
```

## Docs

- [Deploy](docs/DEPLOY.md)
- [Backup](docs/BACKUP.md)
- [API Reference](docs/API_REFERENCE.md)
