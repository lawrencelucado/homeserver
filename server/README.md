# Home Server Orchestration

Centralized Docker Compose to run all services from one place.

## Layout

- compose file: `projects/server/compose.yml`
- env file: `projects/server/.env` (not committed) — see `.env.example`

## Services

- DataLux stack: `postgres`, `fastapi-backend`, `datalux-website`
  - Website served on `127.0.0.1:8002`
  - FastAPI on `127.0.0.1:8003` (health/debug)
  - Postgres on `127.0.0.1:5433`
- Codex assistant: `127.0.0.1:8000`
- FE SCADA Dashboard: `127.0.0.1:3005`
- Perez Fashion: `127.0.0.1:8080`

All public ports bind to localhost for safety; publish via Cloudflare Tunnel or a reverse proxy.

## Quick Start

```bash
cd projects/server
cp .env.example .env  # fill secrets

# Build and start
docker compose -f compose.yml up -d --build

# Status / logs
docker compose -f compose.yml ps
docker compose -f compose.yml logs -f
```

## Common Ops

```bash
# Recreate only the website stack
docker compose -f compose.yml up -d datalux-website fastapi-backend postgres

# Restart a single service
docker compose -f compose.yml restart codex

# Tail logs for backend
docker compose -f compose.yml logs -f fastapi-backend

# Stop everything
docker compose -f compose.yml down
```

## Tunnels / Ingress

Expose selected services through Cloudflare Tunnel (recommended) or a reverse proxy.

- Datalux website: map `datalux.dev` → `http://localhost:8002`
- Other apps: add routes as needed (e.g., subdomains)

Example systemd unit (existing pattern): `cloudflared-datalux.service` pointing to `http://localhost:8002`.

## Notes

- Service folders stay in their original locations; compose only wires them.
- Networks:
  - `datalux-network` for website/backend/postgres
  - `apps-net` for other apps
- Volumes: `postgres_data` persists DB data under Docker’s volume store.

## Next Steps (optional)

- Add Traefik/Caddy for local reverse proxying and TLS termination
- Add Watchtower for automated image updates
- Add backup cron for `postgres_data`
- Add systemd unit to auto-start `compose.yml` on boot

