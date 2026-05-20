from datetime import timedelta

from fastapi import APIRouter, Depends, Request
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.admin import _require_admin_key
from app.database import get_db
from app.models.analytics import AnalyticsEvent
from app.models.order import Order
from app.schemas.live import HeartbeatIn, LiveLocationRow, LiveMarker, LiveSnapshotOut, LiveVisitorRow
from app.services.analytics_range import utc_now
from app.services.geo import client_ip, resolve_geo_full
from app.services.live_sessions import (
    active_sessions,
    funnel_counts,
    globe_markers,
    location_breakdown,
    upsert_heartbeat,
)

router = APIRouter(prefix="/api", tags=["live"])

admin_router = APIRouter(prefix="/api/admin/live", tags=["admin-live"])


@router.post("/analytics/heartbeat")
async def heartbeat(body: HeartbeatIn, request: Request):
    ip = client_ip(request)
    geo = await resolve_geo_full(request, ip)
    upsert_heartbeat(
        session_id=body.session_id,
        visitor_id=body.visitor_id,
        path=body.path,
        stage=body.stage,
        country=geo.country,
        city=geo.city,
        lat=geo.lat,
        lng=geo.lng,
        ip_address=ip,
        is_returning=body.is_returning,
        utm_source=body.utm_source,
        product_slug=body.product_slug,
    )
    return {"ok": True}


def _hourly_series(db: Session, start, end) -> tuple[list[dict], list[dict]]:
    """Last 24 hour buckets for mini charts."""
    sessions_rows = (
        db.query(
            func.date_trunc("hour", AnalyticsEvent.created_at).label("h"),
            func.count(func.distinct(AnalyticsEvent.session_id)).label("n"),
        )
        .filter(AnalyticsEvent.created_at >= start, AnalyticsEvent.created_at <= end)
        .group_by("h")
        .order_by("h")
        .all()
    )
    orders_rows = (
        db.query(
            func.date_trunc("hour", Order.created_at).label("h"),
            func.count(Order.id).label("n"),
        )
        .filter(Order.created_at >= start, Order.created_at <= end)
        .group_by("h")
        .order_by("h")
        .all()
    )

    def to_map(rows):
        m = {}
        for h, n in rows:
            if h is None:
                continue
            key = h.strftime("%Y-%m-%dT%H:00")
            m[key] = int(n or 0)
        return m

    sm = to_map(sessions_rows)
    om = to_map(orders_rows)
    now = utc_now()
    session_points = []
    order_points = []
    for i in range(24):
        t = now - timedelta(hours=23 - i)
        key = t.replace(minute=0, second=0, microsecond=0).strftime("%Y-%m-%dT%H:00")
        session_points.append({"hour": key, "sessions": sm.get(key, 0), "orders": 0})
        order_points.append({"hour": key, "sessions": 0, "orders": om.get(key, 0)})
    merged = []
    for i in range(24):
        merged.append(
            {
                "hour": session_points[i]["hour"],
                "sessions": session_points[i]["sessions"],
                "orders": order_points[i]["orders"],
            }
        )
    return merged, merged


@admin_router.get("/snapshot", response_model=LiveSnapshotOut)
def live_snapshot(_: None = Depends(_require_admin_key), db: Session = Depends(get_db)):
    now = utc_now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    sessions = active_sessions()
    funnel = funnel_counts()

    today_orders = int(
        db.query(func.count(Order.id)).filter(Order.created_at >= today_start).scalar() or 0
    )
    today_sales = float(
        db.query(func.coalesce(func.sum(Order.total_usd), 0))
        .filter(Order.created_at >= today_start)
        .scalar()
        or 0
    )
    today_sessions = int(
        db.query(func.count(func.distinct(AnalyticsEvent.session_id)))
        .filter(AnalyticsEvent.created_at >= today_start)
        .scalar()
        or 0
    )

    returning_now = sum(1 for s in sessions if s.is_returning)
    new_now = len(sessions) - returning_now

    visitors: list[LiveVisitorRow] = []
    for s in sessions:
        sec = int((now - s.last_seen).total_seconds())
        visitors.append(
            LiveVisitorRow(
                session_id=s.session_id,
                visitor_id=s.visitor_id,
                path=s.path,
                stage=s.stage,
                country=s.country,
                city=s.city,
                lat=s.lat,
                lng=s.lng,
                ip_address=s.ip_address,
                is_returning=s.is_returning,
                utm_source=s.utm_source,
                product_slug=s.product_slug,
                last_seen=s.last_seen.isoformat(),
                seconds_ago=sec,
            )
        )

    markers = [LiveMarker(**m) for m in globe_markers()]
    locations = [LiveLocationRow(**row) for row in location_breakdown()]

    chart_start = now - timedelta(hours=24)
    hourly, _ = _hourly_series(db, chart_start, now)

    return LiveSnapshotOut(
        updated_at=now.isoformat(),
        visitors_now=len(sessions),
        funnel=funnel,
        visitors=visitors,
        markers=markers,
        locations=locations,
        today_orders=today_orders,
        today_sessions=today_sessions,
        today_sales_usd=today_sales,
        returning_now=returning_now,
        new_now=new_now,
        hourly_sessions=hourly,
        hourly_orders=hourly,
    )
