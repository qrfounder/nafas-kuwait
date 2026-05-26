"""Signed Mojourney admin tokens — survive API restarts (unlike in-memory sessions)."""

from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta

from app.config import settings

SESSION_TTL = timedelta(hours=12)


def _signing_secret() -> bytes:
    material = settings.admin_api_key or settings.mojourney_admin_password or ""
    if not material:
        material = "nafas-mojourney-dev-only"
    return material.encode("utf-8")


def issue_session_token(username: str) -> str:
    exp = int((datetime.utcnow() + SESSION_TTL).timestamp())
    body = f"{username.strip()}.{exp}"
    sig = hmac.new(_signing_secret(), body.encode("utf-8"), hashlib.sha256).hexdigest()[:32]
    return f"mj.{body}.{sig}"


def verify_session_token(token: str) -> bool:
    if not token.startswith("mj."):
        return False
    try:
        rest = token[3:]
        body, sig = rest.rsplit(".", 1)
        username, exp_s = body.split(".", 1)
        if not username or not exp_s:
            return False
        exp = int(exp_s)
        if exp < int(datetime.utcnow().timestamp()):
            return False
        expected = hmac.new(_signing_secret(), body.encode("utf-8"), hashlib.sha256).hexdigest()[:32]
        return secrets.compare_digest(sig, expected)
    except (ValueError, TypeError):
        return False
