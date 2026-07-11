import logging
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.order import Order
from app.schemas.admin import AdminLoginIn, AdminLoginOut, AdminOrderRow, AdminOrdersSummary
from app.services.admin_session import issue_session_token, verify_session_token

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["admin"])

SESSION_TTL = timedelta(hours=12)
_sessions: dict[str, datetime] = {}  # legacy random tokens until clients refresh


def _prune_sessions() -> None:
    now = datetime.utcnow()
    for k, exp in list(_sessions.items()):
        if exp <= now:
            del _sessions[k]


def _admin_auth_configured() -> bool:
    return bool(settings.mojourney_admin_password) or bool(settings.admin_api_key)


def _require_admin_key(x_admin_key: str | None = Header(None, alias="X-Admin-Key")) -> None:
    if not _admin_auth_configured():
        raise HTTPException(
            status_code=503,
            detail="Mojourney is disabled: set MOJOURNEY_ADMIN_PASSWORD or ADMIN_API_KEY.",
        )
    if not x_admin_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    _prune_sessions()
    exp = _sessions.get(x_admin_key)
    if exp and exp > datetime.utcnow():
        return

    if settings.admin_api_key:
        try:
            if secrets.compare_digest(x_admin_key, settings.admin_api_key):
                return
        except (TypeError, ValueError):
            pass

    if verify_session_token(x_admin_key):
        return

    raise HTTPException(status_code=401, detail="Unauthorized")


@router.get("/ping")
def admin_ping():
    """No key required — confirms the admin router is up."""
    return {
        "ok": True,
        "admin_configured": _admin_auth_configured(),
        "password_login": bool(settings.mojourney_admin_password),
    }


@router.post("/login", response_model=AdminLoginOut)
def admin_login(body: AdminLoginIn):
    if not settings.mojourney_admin_password:
        raise HTTPException(
            status_code=503,
            detail="Password login disabled. Set MOJOURNEY_ADMIN_PASSWORD or use ADMIN_API_KEY.",
        )
    _prune_sessions()
    user_ok = body.username.strip() == settings.mojourney_admin_user
    try:
        pass_ok = secrets.compare_digest(body.password, settings.mojourney_admin_password)
    except (TypeError, ValueError):
        pass_ok = False
    if not user_ok or not pass_ok:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = issue_session_token(body.username.strip())
    logger.info("Mojourney login ok for user=%s", body.username.strip())
    return AdminLoginOut(session_token=token)


@router.post("/logout")
def admin_logout(x_admin_key: str | None = Header(None, alias="X-Admin-Key")):
    if x_admin_key and x_admin_key in _sessions:
        del _sessions[x_admin_key]
    return {"ok": True}


@router.get("/summary", response_model=AdminOrdersSummary)
def admin_summary(_: None = Depends(_require_admin_key), db: Session = Depends(get_db)):
    total = db.query(func.count(Order.id)).scalar() or 0
    since = datetime.utcnow() - timedelta(hours=24)
    last_24h = db.query(func.count(Order.id)).filter(Order.created_at >= since).scalar() or 0

    rows = db.query(Order.status, func.count(Order.id)).group_by(Order.status).all()
    by_status = {str(s): int(c) for s, c in rows}

    return AdminOrdersSummary(total=int(total), last_24h=int(last_24h), by_status=by_status)


@router.get("/orders", response_model=list[AdminOrderRow])
def admin_orders(
    _: None = Depends(_require_admin_key),
    db: Session = Depends(get_db),
    limit: int = 100,
    offset: int = 0,
):
    limit = min(max(limit, 1), 500)
    offset = max(offset, 0)
    q = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    orders = q.all()
    logger.info("Admin orders list: %s rows", len(orders))
    return [AdminOrderRow.model_validate(o) for o in orders]
