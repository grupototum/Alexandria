# Deploy

## Fresh VPS Bootstrap

```bash
git clone https://github.com/grupototum/Alexandria.git /home/totum/alexandria-api
cd /home/totum/alexandria-api
cp .env.example .env
```

Edit `.env` with real keys from the password manager. Do not commit `.env`.

```bash
docker compose up -d --build
docker inspect -f '{{.State.Status}}' alexandria-api
curl http://127.0.0.1:5000/health
```

## Nginx

The current Hostinger Nginx route for `alexandria.grupototum.com` proxies to `127.0.0.1:5000`.

After rebuilding, validate:

```bash
curl -I https://alexandria.grupototum.com/health
curl https://alexandria.grupototum.com/health
```

## Production Inventory From 2026-05-12

- Docker image: `alexandria-api-alexandria-api`
- Container: `alexandria-api`
- Compose working dir: `/home/totum/alexandria-api`
- Compose file: `/home/totum/alexandria-api/docker-compose.yml`
- Port binding: `127.0.0.1:5000:5000`
- No git remote was configured in the VPS source directory at inventory time.
