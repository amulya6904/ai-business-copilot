param(
    [string]$Network = "copilot_net",
    [string]$DbUrl = "postgresql+psycopg2://copilot:copilot@copilot_postgres:5432/ecommerce"
)

$py = @"
from sqlalchemy import create_engine, text
e = create_engine("$DbUrl")
with e.connect() as conn:
    print(conn.execute(text("SELECT 1")).scalar())
"@

$py | docker run --rm -i --network $Network `
  -v "${PWD}:/app" -w /app python:3.12-slim `
  bash -lc "pip install -q sqlalchemy psycopg2-binary python-dotenv && python -"
