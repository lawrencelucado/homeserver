# Repository Guidelines

## Project Structure & Module Organization
- infra/: Docker Compose, reverse proxy, environment templates.
- backend/ (FastAPI): app/, tests/, requirements.txt.
- frontend/ (Next.js): src/, public/, __tests__/.
- dags/: Airflow DAGs (ingest, analytics), tests/.
- superset/: dashboards, SQL, seeds.
- docs/: brand, ops, and policy docs (see docs/aromaco/).
- data/: local volumes (ignored in VCS). Example: data/postgres/.

## Build, Test, and Development Commands
- Docker stack: `docker compose -f infra/docker-compose.yml up -d --build`
- Tail logs: `docker compose -f infra/docker-compose.yml logs -f fastapi nextjs airflow superset`
- Backend (dev): `cd backend && python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && uvicorn app.main:app --reload`
- Frontend (dev): `cd frontend && npm i && npm run dev`
- Run Airflow web (dev): use Compose; DAGs live under `dags/`.

## Coding Style & Naming Conventions
- Python: black (88), isort, ruff; snake_case for funcs/vars, PascalCase for classes.
- TypeScript/JS: eslint + prettier; camelCase for funcs/vars, PascalCase for React components.
- Files: python modules `lower_snake.py`; React `ComponentName.tsx`; tests as shown below.
- Env vars: UPPER_SNAKE; sample in `.env.example` (root and service-level).

## Testing Guidelines
- Backend: pytest + pytest-cov. Name: `tests/test_<module>.py`. Run: `pytest -q`.
- Frontend: vitest/jest + Testing Library. Name: `__tests__/*.test.(ts|tsx)`. Run: `npm test`.
- DAGs: unit test operators/utilities; smoke test import of all DAGs.
- Aim for meaningful coverage on changed code; avoid brittle snapshot tests.

## Commit & Pull Request Guidelines
- Use Conventional Commits: feat, fix, docs, chore, refactor, test, ci, perf.
- Branches: `feature/<scope>`, `fix/<scope>`, `docs/<scope>`.
- PRs: clear summary, linked issue, test plan, screenshots (UI), migration notes (DB). Keep diffs focused.

## Security & Configuration Tips
- Never commit secrets. Check in `.env.example` only; use `.env.local` for dev and Docker secrets in prod.
- Rotate API keys (Stripe, JWT) and restrict credentials by environment.
- Validate inputs at API boundaries; log without PII.

## Agent-Specific Instructions
- Prefer minimal, targeted changes; follow structure above.
- Add/update docs when introducing services or env vars.
- Use ripgrep for code search (`rg`); keep file reads under 250 lines per chunk.
