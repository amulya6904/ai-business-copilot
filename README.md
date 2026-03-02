AI Business Insights Copilot
<p align="center"> <b>AI-Powered Executive Insight Engine built with FastAPI, PostgreSQL & Local LLMs</b> </p> <p align="center"> <img src="https://img.shields.io/badge/FastAPI-Backend-green" /> <img src="https://img.shields.io/badge/PostgreSQL-Database-blue" /> <img src="https://img.shields.io/badge/Ollama-Mistral%207B-purple" /> <img src="https://img.shields.io/badge/Docker-Containerized-blue" /> <img src="https://img.shields.io/badge/React-Frontend-61DAFB" /> <img src="https://img.shields.io/badge/License-MIT-lightgrey" /> </p>
Executive Overview

AI Business Insights Copilot is a production-style analytics system that converts raw transactional data into structured, executive-ready insights.

Unlike traditional BI dashboards that only show numbers, this system:

Computes KPIs directly from PostgreSQL

Performs structured delta analysis

Identifies revenue drivers

Generates actionable recommendations

Produces boardroom-quality insight summaries

Operates fully offline using a local LLM

This project demonstrates applied AI engineering — not just prompting — but structured reasoning layered on deterministic analytics.

Problem Statement

Modern organizations struggle with:

Static dashboards that require manual interpretation

Lack of narrative explanation for KPI movement

Disconnected analytics and AI workflows

High dependency on paid LLM APIs

This system bridges:

Deterministic Analytics + Generative AI = Structured Executive Intelligence

System Architecture
Separation of Concerns
Layer	Responsibility
Frontend	Insight orchestration console
FastAPI	API contract + validation
KPI Engine	Deterministic metric computation
PostgreSQL	Source of truth
Ollama	Local LLM runtime
JSON Repair Layer	Ensures structured output validity
Core Capabilities
1️⃣ KPI Computation Engine

Revenue aggregation

Period-over-period delta analysis

Category decomposition

Region-level contribution

Sub-category driver ranking

Absolute & percentage growth detection

Built using SQLAlchemy and optimized SQL queries.

2️⃣ Structured Insight Generation

Every response strictly follows:

{
  "title": "...",
  "summary": "...",
  "key_drivers": [],
  "actions": [],
  "risks": []
}

The pipeline includes:

Strict schema validation

JSON extraction fallback

LLM repair pass if malformed

Retry logic with exponential backoff

3️⃣ Local LLM Integration

Ollama runtime

Model: mistral:7b

Fully offline capable

No external API cost

Retry & latency logging

Structured JSON enforcement

4️⃣ Reliability Engineering

This project includes production-style safeguards:

/health readiness endpoint

Database connectivity validation

Ollama availability check

Model presence verification

Graceful degradation handling

Latency measurement

Deterministic fallback if LLM fails

Example health response:

{
  "status": "ok",
  "db": {"ok": true},
  "ollama": {"ok": true, "model_present": true}
}
5️⃣ Advanced Frontend Console

Premium light-theme dashboard

Insight orchestration form

Copy + Download JSON

Network error transparency

Local history (client-only)

Zero backend contract changes

Designed to simulate enterprise analytics software.

Tech Stack
Backend

FastAPI

SQLAlchemy

psycopg2

python-dotenv

PostgreSQL

AI Layer

Ollama

Mistral 7B

Infrastructure

Docker

Docker Compose

Frontend

React

Vite

TailwindCSS

Running the Project
1️⃣ Start Infrastructure
docker compose up -d

Verify:

docker compose ps

Services:

postgres

ollama

2️⃣ Pull Model
docker compose exec ollama ollama pull mistral:7b
3️⃣ Setup Backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt

Load dataset:

python -m jobs.load_superstore

Run API:

uvicorn app:app --reload --port 8000

Docs:

http://127.0.0.1:8000/docs

Health:

http://127.0.0.1:8000/health
4️⃣ Run Frontend
cd frontend
npm install
npm run dev

Open:

http://localhost:5173
Example Request
{
  "metric": "revenue",
  "period_a_start": "2017-01-01",
  "period_a_end": "2017-01-31",
  "period_b_start": "2016-01-01",
  "period_b_end": "2016-01-31"
}

Example Response:

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
Production Design Principles Demonstrated

Schema-first API contracts

Deterministic analytics before generative AI

Strict output validation

Retry + timeout controls

Component health monitoring

Containerized infra

Separation of compute & narrative layers


Future Roadmap

KPI registry endpoint

Trend visualization module

Insight persistence in DB

Role-based authentication

CI/CD via GitHub Actions

Cloud deployment (GCP/AWS)

Caching layer for heavy metrics

Model evaluation benchmarking

Why This Project Stands Out

This is not a chatbot.

It is a structured AI analytics engine that:

Combines SQL analytics with generative reasoning

Enforces schema integrity

Operates fully offline

Demonstrates production-level design decisions

This reflects real-world AI system architecture, not prompt experimentation.

Author

Amulya Anutej
B.E. Computer Science
