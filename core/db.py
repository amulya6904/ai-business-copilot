from __future__ import annotations

from functools import lru_cache

from sqlalchemy import create_engine, text

from core.settings import get_settings


def _build_database_url() -> str:
    settings = get_settings()
    if settings.db_url:
        return settings.db_url

    return (
        f"postgresql+psycopg2://{settings.db_user}:{settings.db_password}"
        f"@{settings.db_host}:{settings.db_port}/{settings.db_name}"
    )


@lru_cache(maxsize=1)
def get_engine():
    settings = get_settings()
    return create_engine(
        _build_database_url(),
        pool_pre_ping=True,
        connect_args={
            "connect_timeout": settings.db_connect_timeout,
            "options": f"-c statement_timeout={settings.db_statement_timeout_ms}",
        },
    )


def db_ping() -> tuple[bool, str | None]:
    try:
        with get_engine().connect() as conn:
            conn.execute(text("SELECT 1"))
        return True, None
    except Exception as exc:  # pragma: no cover - runtime integration path
        return False, str(exc)
