#!/bin/sh
set -e

echo "Waiting for Postgres..."
python - <<'PY'
import os
import sys
import time

from sqlalchemy import create_engine
from sqlalchemy.engine.url import make_url

from app.config import settings

url = settings.database_url
if not url:
    print(
        "No database settings. On the API service set either DATABASE_URL "
        "or POSTGRES_USER + POSTGRES_PASSWORD + POSTGRES_DB (+ POSTGRES_HOST).",
        flush=True,
    )
    sys.exit(1)

parsed = make_url(url)
source = "POSTGRES_*" if os.environ.get("POSTGRES_PASSWORD") else "DATABASE_URL"
print(
    "Postgres target: "
    f"source={source} user={parsed.username!r} host={parsed.host!r} "
    f"port={parsed.port} db={parsed.database!r} "
    f"password_len={len(parsed.password or '')}",
    flush=True,
)

last = None
for i in range(30):
    try:
        create_engine(url).connect().close()
        print("Postgres is ready", flush=True)
        break
    except Exception as e:
        last = e
        print(f"Postgres not ready ({i + 1}/30): {e}", flush=True)
        msg = str(e).lower()
        if "password authentication failed" in msg:
            print(
                "Password rejected. Copy Internal connection URL from the "
                "Postgres Credentials tab, or set POSTGRES_USER / "
                "POSTGRES_PASSWORD / POSTGRES_DB / POSTGRES_HOST to match it. "
                "If you recreated a service named db, EasyPanel may have reused "
                "the old data directory. Create a new service name such as pg.",
                flush=True,
            )
        time.sleep(2)
else:
    print(f"Giving up. Last error: {last}", flush=True)
    sys.exit(1)
PY

echo "Running migrations..."
alembic upgrade head
echo "Starting API on port 8000..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
