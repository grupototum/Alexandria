# Backup

Back up:

- `.env` values in a password manager.
- Supabase project data for `cgpkfhrqprqptvehatad`.
- Any future local files mounted into the container.
- Nginx config for `alexandria.grupototum.com`.

No application state is stored in this repository. The API reads/writes Supabase using service credentials from `.env`.

Recovery drill:

1. Clone this repo.
2. Restore `.env`.
3. Run `docker compose up -d --build`.
4. Confirm `/health`.
5. Confirm `/alexandria/discover` with a non-sensitive query.
