#!/bin/sh
set -e

echo "Waiting for Postgres..."
python - <<'PY'
import os, sys, time
from sqlalchemy import create_engine
from app.config import settings

url = settings.database_url
if not os.environ.get("DATABASE_URL"):
    print("DATABASE_URL is not set on this service", flush=True)
    sys.exit(1)

last = None
for i in range(30):
    try:
        create_engine(url).connect().close()
        print("Postgres is ready", flush=True)
        break
    except Exception as e:
        last = e
        print(f"Postgres not ready ({i + 1}/30): {e}", flush=True)
        time.sleep(2)
else:
    print(f"Giving up. Last error: {last}", flush=True)
    sys.exit(1)
PY

echo "Running migrations..."
alembic upgrade head
echo "Starting API on port 8000..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
