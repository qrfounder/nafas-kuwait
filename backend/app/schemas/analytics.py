from pydantic import BaseModel, Field


class TrackEventIn(BaseModel):
    visitor_id: str = Field(..., max_length=64)
    session_id: str = Field(..., max_length=64)
    event_type: str = Field(..., max_length=48)
    path: str | None = Field(None, max_length=512)
    product_slug: str | None = Field(None, max_length=64)
    value: float | None = None
    referrer: str | None = Field(None, max_length=512)
    utm_source: str | None = Field(None, max_length=128)
    utm_medium: str | None = Field(None, max_length=128)
    utm_campaign: str | None = Field(None, max_length=128)
    utm_content: str | None = Field(None, max_length=128)
    metadata: dict | None = None


class TrackEventOut(BaseModel):
    ok: bool = True


class GeoRow(BaseModel):
    country: str | None
    city: str | None
    visitors: int
    events: int
    purchases: int


class DailyRow(BaseModel):
    date: str
    visitors: int
    page_views: int
    add_to_cart: int
    checkout_visit: int
    checkout_form_start: int
    purchases: int


class FunnelStats(BaseModel):
    page_view: int = 0
    view_content: int = 0
    add_to_cart: int = 0
    cart_view: int = 0
    checkout_visit: int = 0
    checkout_form_start: int = 0
    upsell_view: int = 0
    upsell_accept: int = 0
    upsell_decline: int = 0
    purchase: int = 0


class VisitorFunnelRow(BaseModel):
    visitor_id: str
    country: str | None
    city: str | None
    first_seen: str
    last_seen: str
    last_path: str | None
    utm_source: str | None
    page_view: bool
    view_content: bool
    add_to_cart: bool
    cart_view: bool
    checkout_visit: bool
    checkout_form_start: bool
    upsell_status: str | None  # accepted | declined | shown
    purchase: bool


class VisitorsReportOut(BaseModel):
    range_from: str
    range_to: str
    preset: str
    total: int
    visitors: list[VisitorFunnelRow]


class RecentEventRow(BaseModel):
    id: str
    created_at: str
    event_type: str
    path: str | None
    product_slug: str | None
    visitor_id: str
    ip_address: str | None
    country: str | None
    city: str | None
    value: float | None


class AnalyticsReportOut(BaseModel):
    range_from: str
    range_to: str
    preset: str
    unique_visitors: int
    unique_sessions: int
    total_events: int
    funnel: FunnelStats
    by_country: list[GeoRow]
    by_city: list[GeoRow]
    daily: list[DailyRow]
    recent_events: list[RecentEventRow]
