import json
import logging
from collections import defaultdict
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import distinct, func
from sqlalchemy.orm import Session

from app.api.admin import _require_admin_key
from app.database import get_db
from app.models.analytics import AnalyticsEvent
from app.schemas.analytics import (
    AnalyticsReportOut,
    DailyRow,
    FunnelStats,
    GeoRow,
    RecentEventRow,
    TrackEventIn,
    TrackEventOut,
)
from app.services.analytics_range import parse_range, utc_now
from app.services.geo import client_ip, resolve_geo, resolve_geo_full
from app.services.live_sessions import upsert_heartbeat

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])
admin_router = APIRouter(prefix="/api/admin/analytics", tags=["admin-analytics"])

ALLOWED_EVENTS = {
    "page_view",
    "view_content",
    "add_to_cart",
    "checkout_visit",
    "checkout_form_start",
    "purchase",
}

_rate: dict[str, list[float]] = defaultdict(list)
_RATE_WINDOW = 3600
_RATE_MAX = 200


def _rate_ok(ip: str | None) -> bool:
    if not ip:
        return True
    now = utc_now().timestamp()
    bucket = _rate[ip]
    bucket[:] = [t for t in bucket if now - t < _RATE_WINDOW]
    if len(bucket) >= _RATE_MAX:
        return False
    bucket.append(now)
    return True


@router.post("/track", response_model=TrackEventOut)
async def track_event(body: TrackEventIn, request: Request, db: Session = Depends(get_db)):
    if body.event_type not in ALLOWED_EVENTS:
        raise HTTPException(400, "Invalid event_type")

    ip = client_ip(request)
    if not _rate_ok(ip):
        return TrackEventOut(ok=True)

    geo = await resolve_geo_full(request, ip)
    country, city = geo.country, geo.city
    ua = request.headers.get("user-agent")
    if ua and len(ua) > 500:
        ua = ua[:500]

    meta = json.dumps(body.metadata) if body.metadata else None

    row = AnalyticsEvent(
        visitor_id=body.visitor_id[:64],
        session_id=body.session_id[:64],
        event_type=body.event_type,
        path=body.path,
        product_slug=body.product_slug,
        value=body.value,
        ip_address=ip,
        country=country,
        city=city,
        user_agent=ua,
        referrer=body.referrer,
        utm_source=body.utm_source,
        utm_medium=body.utm_medium,
        utm_campaign=body.utm_campaign,
        utm_content=body.utm_content,
        metadata_json=meta,
    )
    db.add(row)
    db.commit()

    stage = "browsing"
    if body.event_type == "add_to_cart":
        stage = "cart"
    elif body.event_type in ("checkout_visit", "checkout_form_start"):
        stage = "checkout"
    elif body.event_type == "purchase":
        stage = "purchased"

    upsert_heartbeat(
        session_id=body.session_id,
        visitor_id=body.visitor_id,
        path=body.path or "/",
        stage=stage,
        country=country,
        city=city,
        lat=geo.lat,
        lng=geo.lng,
        ip_address=ip,
        is_returning=False,
        utm_source=body.utm_source,
        product_slug=body.product_slug,
    )

    return TrackEventOut(ok=True)


def _distinct_visitors(db: Session, start, end, event_type: str | None = None) -> int:
    q = db.query(func.count(distinct(AnalyticsEvent.visitor_id))).filter(
        AnalyticsEvent.created_at >= start,
        AnalyticsEvent.created_at <= end,
    )
    if event_type:
        q = q.filter(AnalyticsEvent.event_type == event_type)
    return int(q.scalar() or 0)


@admin_router.get("/report", response_model=AnalyticsReportOut)
def analytics_report(
    preset: str = Query("week"),
    from_date: str | None = Query(None, alias="from"),
    to_date: str | None = Query(None, alias="to"),
    _: None = Depends(_require_admin_key),
    db: Session = Depends(get_db),
):
    start, end, label = parse_range(preset, from_date, to_date)

    funnel = FunnelStats()
    for et in ALLOWED_EVENTS:
        count = _distinct_visitors(db, start, end, et)
        setattr(funnel, et, count)

    unique_visitors = _distinct_visitors(db, start, end)
    unique_sessions = int(
        db.query(func.count(distinct(AnalyticsEvent.session_id)))
        .filter(AnalyticsEvent.created_at >= start, AnalyticsEvent.created_at <= end)
        .scalar()
        or 0
    )
    total_events = int(
        db.query(func.count(AnalyticsEvent.id))
        .filter(AnalyticsEvent.created_at >= start, AnalyticsEvent.created_at <= end)
        .scalar()
        or 0
    )

    # By country
    country_rows = (
        db.query(
            AnalyticsEvent.country,
            func.count(distinct(AnalyticsEvent.visitor_id)),
            func.count(AnalyticsEvent.id),
        )
        .filter(AnalyticsEvent.created_at >= start, AnalyticsEvent.created_at <= end)
        .group_by(AnalyticsEvent.country)
        .all()
    )
    purchase_by_country = dict(
        db.query(AnalyticsEvent.country, func.count(distinct(AnalyticsEvent.visitor_id)))
        .filter(
            AnalyticsEvent.created_at >= start,
            AnalyticsEvent.created_at <= end,
            AnalyticsEvent.event_type == "purchase",
        )
        .group_by(AnalyticsEvent.country)
        .all()
    )
    by_country = [
        GeoRow(
            country=r[0] or "Unknown",
            city=None,
            visitors=int(r[1] or 0),
            events=int(r[2] or 0),
            purchases=int(purchase_by_country.get(r[0], 0)),
        )
        for r in country_rows
    ]
    by_country.sort(key=lambda x: x.visitors, reverse=True)

    # By city (top 25)
    city_rows = (
        db.query(
            AnalyticsEvent.country,
            AnalyticsEvent.city,
            func.count(distinct(AnalyticsEvent.visitor_id)),
            func.count(AnalyticsEvent.id),
        )
        .filter(
            AnalyticsEvent.created_at >= start,
            AnalyticsEvent.created_at <= end,
            AnalyticsEvent.city.isnot(None),
        )
        .group_by(AnalyticsEvent.country, AnalyticsEvent.city)
        .order_by(func.count(distinct(AnalyticsEvent.visitor_id)).desc())
        .limit(25)
        .all()
    )
    purchase_by_city = {
        (c, ci): v
        for c, ci, v in db.query(
            AnalyticsEvent.country,
            AnalyticsEvent.city,
            func.count(distinct(AnalyticsEvent.visitor_id)),
        )
        .filter(
            AnalyticsEvent.created_at >= start,
            AnalyticsEvent.created_at <= end,
            AnalyticsEvent.event_type == "purchase",
            AnalyticsEvent.city.isnot(None),
        )
        .group_by(AnalyticsEvent.country, AnalyticsEvent.city)
        .all()
    }
    by_city = [
        GeoRow(
            country=r[0],
            city=r[1],
            visitors=int(r[2] or 0),
            events=int(r[3] or 0),
            purchases=int(purchase_by_city.get((r[0], r[1]), 0)),
        )
        for r in city_rows
    ]

    # Daily breakdown
    day_span = max(1, (end - start).days + 1)
    daily: list[DailyRow] = []
    for i in range(min(day_span, 366)):
        d_start = (start + timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        d_end = d_start + timedelta(days=1) - timedelta(microseconds=1)
        if d_start > end:
            break
        if d_end > end:
            d_end = end

        def _count_et(et: str) -> int:
            return int(
                db.query(func.count(AnalyticsEvent.id))
                .filter(
                    AnalyticsEvent.created_at >= d_start,
                    AnalyticsEvent.created_at <= d_end,
                    AnalyticsEvent.event_type == et,
                )
                .scalar()
                or 0
            )

        daily.append(
            DailyRow(
                date=d_start.strftime("%Y-%m-%d"),
                visitors=_distinct_visitors(db, d_start, d_end),
                page_views=_count_et("page_view"),
                add_to_cart=_count_et("add_to_cart"),
                checkout_visit=_count_et("checkout_visit"),
                checkout_form_start=_count_et("checkout_form_start"),
                purchases=_count_et("purchase"),
            )
        )

    recent = (
        db.query(AnalyticsEvent)
        .filter(AnalyticsEvent.created_at >= start, AnalyticsEvent.created_at <= end)
        .order_by(AnalyticsEvent.created_at.desc())
        .limit(100)
        .all()
    )
    recent_events = [
        RecentEventRow(
            id=str(e.id),
            created_at=e.created_at.isoformat() if e.created_at else "",
            event_type=e.event_type,
            path=e.path,
            product_slug=e.product_slug,
            visitor_id=e.visitor_id,
            ip_address=e.ip_address,
            country=e.country,
            city=e.city,
            value=e.value,
        )
        for e in recent
    ]

    return AnalyticsReportOut(
        range_from=start.isoformat(),
        range_to=end.isoformat(),
        preset=label,
        unique_visitors=unique_visitors,
        unique_sessions=unique_sessions,
        total_events=total_events,
        funnel=funnel,
        by_country=by_country[:30],
        by_city=by_city,
        daily=daily,
        recent_events=recent_events,
    )
