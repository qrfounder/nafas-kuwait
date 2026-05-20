from pydantic import BaseModel, Field


class HeartbeatIn(BaseModel):
    visitor_id: str = Field(..., max_length=64)
    session_id: str = Field(..., max_length=64)
    path: str = Field(default="/", max_length=512)
    stage: str = Field(default="browsing", max_length=32)
    is_returning: bool = False
    utm_source: str | None = Field(default=None, max_length=128)
    product_slug: str | None = Field(default=None, max_length=64)


class LiveVisitorRow(BaseModel):
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
    last_seen: str
    seconds_ago: int


class LiveMarker(BaseModel):
    lat: float
    lng: float
    stage: str
    city: str | None
    country: str | None


class LiveLocationRow(BaseModel):
    city: str | None
    country: str | None
    count: int


class HourlyPoint(BaseModel):
    hour: str
    sessions: int
    orders: int


class LiveSnapshotOut(BaseModel):
    updated_at: str
    visitors_now: int
    funnel: dict[str, int]
    visitors: list[LiveVisitorRow]
    markers: list[LiveMarker]
    locations: list[LiveLocationRow]
    today_orders: int
    today_sessions: int
    today_sales_usd: float
    returning_now: int
    new_now: int
    hourly_sessions: list[HourlyPoint]
    hourly_orders: list[HourlyPoint]
