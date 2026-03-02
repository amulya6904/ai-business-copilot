import json

from core.llm.ollama_client import ollama_chat
from core.llm.json_utils import ensure_schema, safe_load_json


SYSTEM = """You are a business insights analyst.
Return ONLY valid JSON matching this schema:
{
  "title": "...",
  "summary": "...",
  "key_drivers": ["..."],
  "actions": ["..."],
  "risks": ["..."]
}
No extra keys. No markdown. No explanation.
"""
REPAIR_SYSTEM = """You are a JSON repair tool.
You will be given text that should contain a JSON object.
Return ONLY a valid JSON object with keys:
title, summary, key_drivers (list[str]), actions (list[str]), risks (list[str]).
No extra text.
"""


def write_insight(delta: dict) -> dict:
    prompt = f"Delta:\n{json.dumps(delta, indent=2)}\n\nReturn the insight JSON now."
    try:
        text = ollama_chat(SYSTEM, prompt)
        try:
            obj = safe_load_json(text)
            return ensure_schema(obj)
        except Exception:
            repaired = ollama_chat(REPAIR_SYSTEM, text)
            obj = safe_load_json(repaired)
            return ensure_schema(obj)
    except Exception:
        return {
            "title": delta.get("title", "Insight"),
            "summary": delta.get("summary", ""),
            "key_drivers": delta.get("drivers", []) if "drivers" in delta else [],
            "actions": [],
            "risks": [],
        }
