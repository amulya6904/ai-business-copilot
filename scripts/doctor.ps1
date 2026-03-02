param(
    [string]$ApiBaseUrl = "http://127.0.0.1:8000"
)

$ErrorActionPreference = "Stop"

if (Test-Path ".\.venv\Scripts\python.exe") {
    $Python = ".\.venv\Scripts\python.exe"
} else {
    $Python = "python"
}

Write-Host "== API health ==" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Method Get -Uri "$ApiBaseUrl/health"
    $health | ConvertTo-Json -Depth 6
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n== DB connection test ==" -ForegroundColor Cyan
$dbScript = @'
import json
from core.db import db_ping

ok, error = db_ping()
print(json.dumps({"ok": ok, "error": error}))
'@
$dbScript | & $Python -

Write-Host "`n== Host port sanity ==" -ForegroundColor Cyan
$portScript = @'
import json
from core.settings import get_settings

settings = get_settings()
print(json.dumps({
    "db_host": settings.db_host,
    "db_port": settings.db_port,
    "note": "Host-run FastAPI should usually use DB_PORT=15432 when talking to the Dockerized Postgres container.",
}))
'@
$portScript | & $Python -

Write-Host "`n== Ollama tags ==" -ForegroundColor Cyan
$ollamaScript = @'
import json
import requests
from core.settings import get_settings

settings = get_settings()
payload = {
    "base_url": settings.ollama_base_url,
    "model_required": settings.ollama_model,
}

try:
    response = requests.get(f"{settings.ollama_base_url}/api/tags", timeout=5)
    response.raise_for_status()
    models = [model.get("name") for model in response.json().get("models", [])]
    payload["ok"] = True
    payload["models"] = models
    payload["model_present"] = settings.ollama_model in models
except Exception as exc:
    payload["ok"] = False
    payload["error"] = str(exc)

print(json.dumps(payload))
'@
$ollamaScript | & $Python -
