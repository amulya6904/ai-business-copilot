import requests
from fastapi import APIRouter

from core.db import db_ping
from core.settings import get_settings


router = APIRouter()


@router.get("/health")
def health():
    settings = get_settings()

    db_ok, db_error = db_ping()

    ollama_ok, ollama_error = True, None
    models = []
    model_loaded = False
    try:
        response = requests.get(f"{settings.ollama_base_url}/api/tags", timeout=5)
        response.raise_for_status()
        models = [model.get("name") for model in response.json().get("models", [])]
        model_loaded = any(name == settings.ollama_model for name in models)
    except Exception as exc:
        ollama_ok, ollama_error = False, str(exc)

    status = "ok" if (db_ok and ollama_ok and model_loaded) else "degraded"

    return {
        "status": status,
        "db": {"ok": db_ok, "error": db_error},
        "ollama": {
            "ok": ollama_ok,
            "error": ollama_error,
            "base_url": settings.ollama_base_url,
            "model_required": settings.ollama_model,
            "model_present": model_loaded,
            "models": models,
        },
    }
