# AI Business Insights Copilot

## Frontend

The frontend is a Vite + React dashboard that talks to the existing FastAPI backend.

### Run

```bash
npm install
npm run dev
```

### API base URL

The frontend reads `VITE_API_BASE_URL`.

Default frontend API base URL:

```bash
http://127.0.0.1:8000
```

You can override it in a frontend `.env` file:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Backend config

The backend reads configuration from environment variables or `.env`.

Host-run defaults:

```bash
DB_HOST=127.0.0.1
DB_PORT=15432
DB_NAME=ecommerce
DB_USER=copilot
DB_PASSWORD=copilot
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral:7b
```

Docker Compose overrides these for the API container so it uses service DNS:

- `DB_HOST=postgres`
- `DB_PORT=5432`
- `OLLAMA_BASE_URL=http://ollama:11434`

The compose stack publishes Postgres on host port `15432` by default. This avoids collisions with Windows PostgreSQL services that already own low ports such as `127.0.0.1:5432` and `127.0.0.1:5433` on many machines. When you run FastAPI on the host against the Dockerized database, keep `DB_HOST=127.0.0.1` and `DB_PORT=15432`.

## Postgres volume note

Postgres container environment variables such as `POSTGRES_PASSWORD` only apply the first time the data volume is initialized. If the volume already exists, changing the compose env vars later will not reset the database password automatically.

If you hit a password mismatch on a persistent volume, fix it with:

```bash
docker compose exec postgres psql -U copilot -d ecommerce -c "ALTER USER copilot WITH PASSWORD 'copilot';"
```

Destructive reset:

```bash
docker compose down -v
docker compose up -d
```

Use the destructive reset only if you are willing to wipe the existing Postgres volume data.

## Host vs compose run modes

Use one API instance at a time on port `8000`.

- Host FastAPI + Dockerized Postgres/Ollama:
  - keep `.env` with `DB_HOST=127.0.0.1`, `DB_PORT=15432`, `OLLAMA_BASE_URL=http://127.0.0.1:11434`
  - run `uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload`
- Full Docker Compose:
  - run `docker compose up -d`
  - the API container uses `postgres:5432` and `http://ollama:11434` internally

If the frontend shows degraded health while Docker is healthy, check whether an old host `uvicorn` process is still bound to `127.0.0.1:8000`.

## Diagnostics

From the repo root, run:

```powershell
.\scripts\doctor.ps1
```

This prints:

- API health
- direct DB connection test
- Ollama tags and required model presence
- configured DB host/port sanity
