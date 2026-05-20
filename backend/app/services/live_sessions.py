"""In-memory live visitor sessions (Shopify Live View style)."""

from dataclasses import dataclass, field
from datetime import datetime, timedelta

from app.services.analytics_range import utc_now

ACTIVE_TTL = timedelta(seconds=90)
PURCHASED_TTL = timedelta(minutes=8)

STAGES = ("browsing", "cart", "checkout", "purchased")


@dataclass
class LiveSession:
    session_id: str
    visitor_id: str
    path: str
    stage: str
    country: str | None
    city: str | None
    lat: float | None
    lng: float | None
    ip_address: str | None
    is_returning: bool
    utm_source: str | None
    product_slug: str | None
    first_seen: datetime = field(default_factory=utc_now)
    last_seen: datetime = field(default_factory=utc_now)


_sessions: dict[str, LiveSession] = {}


def upsert_heartbeat(
    *,
    session_id: str,
    visitor_id: str,
    path: str,
    stage: str,
    country: str | None,
    city: str | None,
    lat: float | None,
    lng: float | None,
    ip_address: str | None,
    is_returning: bool,
    utm_source: str | None = None,
    product_slug: str | None = None,
) -> None:
    stage = stage if stage in STAGES else "browsing"
    now = utc_now()
    existing = _sessions.get(session_id)
    if existing:
        existing.last_seen = now
        existing.path = path
        existing.stage = stage
        existing.country = country or existing.country
        existing.city = city or existing.city
        existing.lat = lat if lat is not None else existing.lat
        existing.lng = lng if lng is not None else existing.lng
        existing.is_returning = is_returning
        existing.utm_source = utm_source or existing.utm_source
        existing.product_slug = product_slug or existing.product_slug
        return

    _sessions[session_id] = LiveSession(
        session_id=session_id[:64],
        visitor_id=visitor_id[:64],
        path=path[:512],
        stage=stage,
        country=country,
        city=city,
        lat=lat,
        lng=lng,
        ip_address=ip_address,
        is_returning=is_returning,
        utm_source=utm_source,
        product_slug=product_slug,
        first_seen=now,
        last_seen=now,
    )


def _prune() -> None:
    now = utc_now()
    dead: list[str] = []
    for sid, s in _sessions.items():
        ttl = PURCHASED_TTL if s.stage == "purchased" else ACTIVE_TTL
        if now - s.last_seen > ttl:
            dead.append(sid)
    for sid in dead:
        del _sessions[sid]


def active_sessions() -> list[LiveSession]:
    _prune()
    now = utc_now()
    out: list[LiveSession] = []
    for s in _sessions.values():
        ttl = PURCHASED_TTL if s.stage == "purchased" else ACTIVE_TTL
        if now - s.last_seen <= ttl:
            out.append(s)
    out.sort(key=lambda x: x.last_seen, reverse=True)
    return out


def funnel_counts() -> dict[str, int]:
    sessions = active_sessions()
    counts = {st: 0 for st in STAGES}
    for s in sessions:
        counts[s.stage] = counts.get(s.stage, 0) + 1
    return counts


def location_breakdown(limit: int = 12) -> list[dict]:
    sessions = active_sessions()
    agg: dict[str, dict] = {}
    for s in sessions:
        key = f"{s.city or 'Unknown'}, {s.country or '?'}"
        if key not in agg:
            agg[key] = {"city": s.city, "country": s.country, "count": 0, "lat": s.lat, "lng": s.lng}
        agg[key]["count"] += 1
    rows = sorted(agg.values(), key=lambda x: x["count"], reverse=True)
    return rows[:limit]


def globe_markers() -> list[dict]:
    sessions = active_sessions()
    markers: list[dict] = []
    for s in sessions:
        if s.lat is None or s.lng is None:
            continue
        markers.append(
            {
                "lat": s.lat,
                "lng": s.lng,
                "stage": s.stage,
                "city": s.city,
                "country": s.country,
            }
        )
    return markers
