import time

import requests

from core.settings import get_settings


def ollama_chat(system: str, user: str) -> str:
    settings = get_settings()
    url = f"{settings.ollama_base_url}/api/chat"
    payload = {
        "model": settings.ollama_model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "stream": False,
        "options": {"temperature": 0.2}
    }

    last_err = None
    for attempt in range(settings.ollama_retries + 1):
        try:
            t0 = time.perf_counter()
            response = requests.post(url, json=payload, timeout=settings.ollama_timeout)
            response.raise_for_status()
            data = response.json()
            _ = time.perf_counter() - t0
            return data["message"]["content"]
        except Exception as exc:
            last_err = exc
            time.sleep(1.0 * (attempt + 1))

    raise RuntimeError(f"Ollama call failed after retries: {last_err}")
