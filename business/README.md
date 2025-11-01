# Business — Codex Service

Runs the Codex assistant for Business prompts.

## Quick Start

```bash
cd projects/business
# Start
docker compose up -d
# Logs
docker compose logs -f codex
# Restart
docker compose restart codex
# Stop
docker compose down
```

## Configuration

- Image: `ghcr.io/datalux-ai/codex:latest`
- Port: `127.0.0.1:8000` (edit in `docker-compose.yml` if needed)
- Prompts: `codex/prompts/` mounted read-only in container
- Active prompt path inside container: `/app/prompts/system.md`

To use a different prompt file, update `CODEX_SYSTEM_PROMPT_FILE` in `docker-compose.yml` to `/app/prompts/<file>.md`.

## Files

- Compose: `projects/business/docker-compose.yml`
- Prompts: `projects/business/codex/prompts/`
- Guidance: `projects/business/AGENTS.md`

