from pydantic import BaseModel, Field


class CartLineIn(BaseModel):
    sku: str
    title_ar: str
    qty: int = 1
    price_usd: float
    line_type: str = "product"


class CreateOrderIn(BaseModel):
    customer_name: str = Field(min_length=2, max_length=200)
    customer_phone: str
    governorate: str = Field(min_length=2, max_length=64)
    area: str = Field(min_length=2, max_length=128)
    block: str = Field(min_length=1, max_length=32)
    street: str = Field(min_length=2, max_length=128)
    building: str | None = Field(default=None, max_length=64)
    delivery_notes: str | None = Field(default=None, max_length=500)
    product_slug: str
    offer_tier: int = Field(ge=1, le=3)
    lines: list[CartLineIn]
    subtotal_usd: float
    total_usd: float
    event_id: str | None = None
    fbp: str | None = None
    fbc: str | None = None
    ttclid: str | None = None
    source: str | None = None
    utm_source: str | None = None
    utm_campaign: str | None = None


class UpsellIn(BaseModel):
    upsell_sku: str
    upsell_price_usd: float
    event_id: str | None = None


class OrderOut(BaseModel):
    order_id: str
    order_number: str
    total_usd: float
    post_upsell: dict | None = None

    class Config:
        from_attributes = True
