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
    checkout_visit: int = 0
    checkout_form_start: int = 0
    purchase: int = 0


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
