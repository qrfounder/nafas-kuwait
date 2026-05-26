"""Per-visitor funnel rollups for Mojourney analytics."""

from __future__ import annotations

from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.models.analytics import AnalyticsEvent
from app.schemas.analytics import VisitorFunnelRow

FUNNEL_EVENT_TYPES = (
    "page_view",
    "view_content",
    "add_to_cart",
    "cart_view",
    "checkout_visit",
    "checkout_form_start",
    "upsell_view",
    "upsell_accept",
    "upsell_decline",
    "purchase",
)


def _flag(event_type: str):
    return func.max(case((AnalyticsEvent.event_type == event_type, 1), else_=0))


def build_visitors_report(
    db: Session,
    start,
    end,
    *,
    limit: int = 500,
    offset: int = 0,
) -> tuple[int, list[VisitorFunnelRow]]:
    base = db.query(AnalyticsEvent).filter(
        AnalyticsEvent.created_at >= start,
        AnalyticsEvent.created_at <= end,
    )

    total = int(
        db.query(func.count(func.distinct(AnalyticsEvent.visitor_id)))
        .filter(AnalyticsEvent.created_at >= start, AnalyticsEvent.created_at <= end)
        .scalar()
        or 0
    )

    agg = (
        base.with_entities(
            AnalyticsEvent.visitor_id,
            func.min(AnalyticsEvent.created_at).label("first_seen"),
            func.max(AnalyticsEvent.created_at).label("last_seen"),
            _flag("page_view").label("page_view"),
            _flag("view_content").label("view_content"),
            _flag("add_to_cart").label("add_to_cart"),
            _flag("cart_view").label("cart_view"),
            _flag("checkout_visit").label("checkout_visit"),
            _flag("checkout_form_start").label("checkout_form_start"),
            _flag("upsell_view").label("upsell_view"),
            _flag("upsell_accept").label("upsell_accept"),
            _flag("upsell_decline").label("upsell_decline"),
            _flag("purchase").label("purchase"),
        )
        .group_by(AnalyticsEvent.visitor_id)
        .order_by(func.max(AnalyticsEvent.created_at).desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    if not agg:
        return total, []

    visitor_ids = [r.visitor_id for r in agg]

    # Latest geo + path + UTM per visitor (most recent event in range)
    latest_rows = (
        db.query(AnalyticsEvent)
        .filter(
            AnalyticsEvent.created_at >= start,
            AnalyticsEvent.created_at <= end,
            AnalyticsEvent.visitor_id.in_(visitor_ids),
        )
        .order_by(AnalyticsEvent.visitor_id, AnalyticsEvent.created_at.desc())
        .all()
    )
    latest_by_visitor: dict[str, AnalyticsEvent] = {}
    for ev in latest_rows:
        if ev.visitor_id not in latest_by_visitor:
            latest_by_visitor[ev.visitor_id] = ev

    out: list[VisitorFunnelRow] = []
    for r in agg:
        last = latest_by_visitor.get(r.visitor_id)
        upsell_status: str | None = None
        if int(r.upsell_accept or 0):
            upsell_status = "accepted"
        elif int(r.upsell_decline or 0):
            upsell_status = "declined"
        elif int(r.upsell_view or 0):
            upsell_status = "shown"

        out.append(
            VisitorFunnelRow(
                visitor_id=r.visitor_id,
                country=last.country if last else None,
                city=last.city if last else None,
                first_seen=r.first_seen.isoformat() if r.first_seen else "",
                last_seen=r.last_seen.isoformat() if r.last_seen else "",
                last_path=last.path if last else None,
                utm_source=last.utm_source if last else None,
                page_view=bool(int(r.page_view or 0)),
                view_content=bool(int(r.view_content or 0)),
                add_to_cart=bool(int(r.add_to_cart or 0)),
                cart_view=bool(int(r.cart_view or 0)),
                checkout_visit=bool(int(r.checkout_visit or 0)),
                checkout_form_start=bool(int(r.checkout_form_start or 0)),
                upsell_status=upsell_status,
                purchase=bool(int(r.purchase or 0)),
            )
        )

    return total, out
