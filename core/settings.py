from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - optional dependency at runtime
    load_dotenv = None


if load_dotenv is not None:
    load_dotenv()


@dataclass(frozen=True)
class Settings:
    db_host: str = os.getenv("DB_HOST", "127.0.0.1")
    db_port: int = int(os.getenv("DB_PORT", "5432"))
    db_name: str = os.getenv("DB_NAME", "ecommerce")
    db_user: str = os.getenv("DB_USER", "copilot")
    db_password: str = os.getenv("DB_PASSWORD", "copilot")
    db_url: str | None = os.getenv("DB_URL") or os.getenv("DATABASE_URL")
    db_connect_timeout: int = int(os.getenv("DB_CONNECT_TIMEOUT", "3"))
    db_statement_timeout_ms: int = int(os.getenv("DB_STATEMENT_TIMEOUT_MS", "3000"))
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "mistral:7b")
    ollama_timeout: float = float(os.getenv("OLLAMA_TIMEOUT", "90"))
    ollama_retries: int = int(os.getenv("OLLAMA_RETRIES", "2"))
    api_host: str = os.getenv("API_HOST", "127.0.0.1")
    api_port: int = int(os.getenv("API_PORT", "8000"))


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
