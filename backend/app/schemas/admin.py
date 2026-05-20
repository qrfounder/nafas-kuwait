from datetime import datetime

from pydantic import BaseModel


class AdminOrderRow(BaseModel):
    order_number: str
    created_at: datetime
    customer_name: str
    customer_phone: str
    governorate: str | None
    area: str | None
    product_slug: str
    offer_tier: int
    total_usd: float
    status: str
    utm_source: str | None
    utm_campaign: str | None
    source: str | None
    upsell_accepted: bool

    class Config:
        from_attributes = True


class AdminOrdersSummary(BaseModel):
    total: int
    last_24h: int
    by_status: dict[str, int]


class AdminLoginIn(BaseModel):
    username: str
    password: str


class AdminLoginOut(BaseModel):
    session_token: str
