import time

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from api.health import router as health_router
from core.analytics.delta_explainer import explain_delta
from core.analytics.insight_writer import write_insight
from core.analytics.schemas import InsightRequest, InsightResponse


app = FastAPI(title="AI Business Insights Copilot")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Delta-Seconds", "X-LLM-Seconds"],
)
app.include_router(health_router)

@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/copilot/insight", response_model=InsightResponse)
def copilot_insight(req: InsightRequest, response: Response):
    try:
        t0 = time.perf_counter()
        delta = explain_delta(
            req.metric,
            req.period_a_start,
            req.period_a_end,
            req.period_b_start,
            req.period_b_end,
        )
        t_delta = time.perf_counter() - t0

        t1 = time.perf_counter()
        insight = write_insight(delta)
        t_llm = time.perf_counter() - t1

        response.headers["X-Delta-Seconds"] = f"{t_delta:.3f}"
        response.headers["X-LLM-Seconds"] = f"{t_llm:.3f}"
        return insight
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except KeyError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except OperationalError as exc:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed. Check DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD in .env and make sure the target Postgres instance is running.",
        ) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to compute insight: {exc}") from exc
