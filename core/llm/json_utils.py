import json
import re
from typing import Any, Dict


REQUIRED_KEYS = ["title", "summary", "key_drivers", "actions", "risks"]


def extract_json_object(text: str) -> str | None:
    m = re.search(r"\{.*\}", text, flags=re.DOTALL)
    return m.group(0) if m else None


def ensure_schema(obj: Dict[str, Any]) -> Dict[str, Any]:
    for key in REQUIRED_KEYS:
        if key not in obj:
            obj[key] = [] if key in ("key_drivers", "actions", "risks") else ""

    for key in ("key_drivers", "actions", "risks"):
        if not isinstance(obj[key], list):
            obj[key] = [str(obj[key])]
        obj[key] = [str(item).strip() for item in obj[key] if str(item).strip()]

    obj["title"] = str(obj["title"]).strip()
    obj["summary"] = str(obj["summary"]).strip()
    return obj


def safe_load_json(text: str) -> Dict[str, Any]:
    try:
        return json.loads(text)
    except Exception:
        pass

    blob = extract_json_object(text)
    if blob:
        try:
            return json.loads(blob)
        except Exception:
            pass

    raise ValueError("Could not parse JSON")
