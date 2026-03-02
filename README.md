# AI Business Insights Copilot

<p align="center">
  <b>AI-powered executive insight engine built with FastAPI, PostgreSQL, React, Docker, and local LLMs.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-Backend-green" alt="FastAPI Backend" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue" alt="PostgreSQL Database" />
  <img src="https://img.shields.io/badge/Ollama-Mistral%207B-6b7280" alt="Ollama Mistral 7B" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED" alt="Docker Containerized" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB" alt="React Frontend" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey" alt="MIT License" />
</p>

## Executive Overview

AI Business Insights Copilot is a production-style analytics system that transforms raw transactional data into structured, executive-ready business insights.

Unlike traditional BI dashboards that only expose charts and aggregates, this project combines deterministic analytics with a local LLM pipeline to produce concise, boardroom-style narratives. It computes KPIs directly from PostgreSQL, performs period-over-period comparisons, identifies primary business drivers, and returns actionable recommendations in a strict JSON schema.

This project demonstrates applied AI systems engineering: deterministic metric computation first, generative reasoning second, with validation and reliability controls around the entire pipeline.

## Problem Statement

Modern business teams often struggle with:

- Static dashboards that still require manual interpretation
- KPI movement without narrative explanation
- Disconnected analytics and AI workflows
- Dependence on paid external LLM APIs

This project addresses that gap with:

`Deterministic Analytics + Generative AI = Structured Executive Intelligence`

## Core Capabilities

### KPI Computation Engine

- Revenue aggregation from transactional data
- Period-over-period delta analysis
- Category-level decomposition
- Region-level contribution analysis
- Sub-category driver ranking
- Absolute and percentage growth detection

The metric layer is implemented with SQL-backed definitions and query execution through SQLAlchemy.

### Structured Insight Generation

Every insight response is normalized to this schema:

```json
{
  "title": "...",
  "summary": "...",
  "key_drivers": [],
  "actions": [],
  "risks": []
}
```

Pipeline protections include:

- Schema validation
- JSON extraction fallback
- LLM repair pass for malformed output
- Retry logic with backoff
- Deterministic fallback if the model response cannot be repaired

### Local LLM Integration

- Ollama runtime
- Default model: `mistral:7b`
- Fully offline-capable deployment
- No external API dependency
- Latency measurement and retry handling
- Structured JSON enforcement

### Reliability Engineering

Production-style safeguards include:

- `/health` readiness endpoint
- Database connectivity validation
- Ollama availability check
- Required model presence verification
- Graceful degradation reporting
- Response timing headers for deterministic and LLM stages

Example health response:

```json
{
  "status": "ok",
  "db": {
    "ok": true,
    "error": null
  },
  "ollama": {
    "ok": true,
    "error": null,
    "base_url": "http://localhost:11434",
    "model_required": "mistral:7b",
    "model_present": true,
    "models": ["mistral:7b"]
  }
}
```

### Frontend Insight Console

- React + Vite interface
- Insight request orchestration form
- Local API connectivity
- JSON response visibility
- Copy/download workflow support
- Health and error transparency for local development

## System Architecture

### Separation of Concerns

| Layer | Responsibility |
| --- | --- |
| Frontend | Insight orchestration console |
| FastAPI | API contract, validation, and response handling |
| KPI Engine | Deterministic metric computation and delta analysis |
| PostgreSQL | Source of truth for transactional data |
| Ollama | Local LLM runtime |
| JSON Validation Layer | Structured output enforcement and repair |

### Flow

1. The client sends an insight request with two comparison periods.
2. FastAPI validates the payload and invokes the analytics pipeline.
3. The KPI engine computes metric deltas and supporting drivers from PostgreSQL.
4. The LLM receives structured context and generates an executive narrative.
5. The response is validated, repaired if needed, and returned as strict JSON.

   
<img width="3005" height="1009" alt="mermaid-diagram" src="https://github.com/user-attachments/assets/2174eaeb-c76c-4c96-9b55-83544795e3e9" />



## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- psycopg2
- python-dotenv
- PostgreSQL

### AI Layer

- Ollama
- Mistral 7B

### Frontend

- React
- Vite
- Tailwind CSS

### Infrastructure

- Docker
- Docker Compose

## Project Structure

```text
api/                 FastAPI application and routes
core/                Analytics, database, LLM, and settings logic
db/                  Database schema
jobs/                Data loading scripts
data/                Source dataset
scripts/             Local diagnostics utilities
src/                 React frontend
docker-compose.yml   Local infrastructure stack
```

## Getting Started

### 1. Start Infrastructure

Start the local services:

```bash
docker compose up -d
```

This stack starts:

- `postgres`
- `ollama`
- `api`

Verify container status:

```bash
docker compose ps
```

### 2. Pull the Local Model

```bash
docker compose exec ollama ollama pull mistral:7b
```

### 3. Load the Dataset

If you are running the backend on your host machine, create a virtual environment and install dependencies:

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

Load the sample Superstore dataset into PostgreSQL:

```bash
python -m jobs.load_superstore
```

### 4. Run the API

You have two valid run modes.

Run the API from Docker Compose:

```bash
docker compose up -d
```

Or run FastAPI locally against the Dockerized Postgres and Ollama services:

```bash
uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload
```

API docs:

```text
http://127.0.0.1:8000/docs
```

Health endpoint:

```text
http://127.0.0.1:8000/health
```

### 5. Run the Frontend

The frontend lives at the repository root in this project.

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Configuration

The backend reads environment variables from `.env` when run on the host.

Typical host-run defaults:

```bash
DB_HOST=127.0.0.1
DB_PORT=15432
DB_NAME=ecommerce
DB_USER=copilot
DB_PASSWORD=copilot
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=mistral:7b
```

Docker Compose overrides these for the API container:

- `DB_HOST=postgres`
- `DB_PORT=5432`
- `OLLAMA_BASE_URL=http://ollama:11434`

The frontend reads `VITE_API_BASE_URL`, which defaults to:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Example API Request

```json
{
  "metric": "revenue",
  "period_a_start": "2017-01-01",
  "period_a_end": "2017-01-31",
  "period_b_start": "2016-01-01",
  "period_b_end": "2016-01-31"
}
```

Example `curl` request:

```bash
curl -X POST "http://127.0.0.1:8000/copilot/insight" ^
  -H "Content-Type: application/json" ^
  -d "{\"metric\":\"revenue\",\"period_a_start\":\"2017-01-01\",\"period_a_end\":\"2017-01-31\",\"period_b_start\":\"2016-01-01\",\"period_b_end\":\"2016-01-31\"}"
```

## Example API Response

```json
{
  "title": "Revenue increased by 25428.88 (137.14%)",
  "summary": "Revenue growth driven primarily by Office Supplies and Technology segments.",
  "key_drivers": [
    "Category 'Office Supplies': +15974.61",
    "Region 'Central': +15748.50"
  ],
  "actions": [
    "Replicate top-performing category strategy across adjacent segments."
  ],
  "risks": [
    "Growth may be concentrated in limited promotions or accounts."
  ]
}
```

## Diagnostics

For local environment checks, run:

```powershell
.\scripts\doctor.ps1
```

This verifies:

- API health
- Direct database connectivity
- Ollama model availability
- Local configuration sanity

## Production Design Principles Demonstrated

- Schema-first API contracts
- Deterministic analytics before generative AI
- Strict structured output validation
- Retry and timeout controls
- Health monitoring and graceful degradation
- Containerized local infrastructure
- Clear separation of compute and narrative layers

## Resume Keywords

FastAPI, PostgreSQL, SQLAlchemy, Docker, Docker Compose, Ollama, Mistral 7B, KPI Analytics, API Design, Health Checks, Retry Logic, JSON Validation, Structured Output Enforcement, AI Systems Engineering, Backend Development, Full Stack Engineering

## Roadmap

- KPI registry endpoint
- Trend visualization module
- Insight persistence in PostgreSQL
- Role-based authentication
- CI/CD via GitHub Actions
- Cloud deployment on GCP or AWS
- Caching for heavy metric workloads
- Model evaluation and benchmarking

## Why This Project Stands Out

This is not a generic chatbot. It is a structured AI analytics engine that:

- Combines SQL analytics with generative reasoning
- Enforces schema integrity
- Runs fully offline with a local LLM
- Reflects production-oriented system design choices

## Author

**Amulya Anutej**  
B.E. Computer Science
