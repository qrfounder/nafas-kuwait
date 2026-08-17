import re

from pydantic import BaseModel, EmailStr, Field, field_validator


class CartLineIn(BaseModel):
    sku: str
    title_ar: str
    qty: int = 1
    price_usd: float
    line_type: str = "product"


_ZIP_RE = re.compile(r"^\d{5}(-\d{4})?$")
_STATE_RE = re.compile(r"^[A-Za-z]{2}$")


class CreateOrderIn(BaseModel):
    customer_name: str = Field(min_length=2, max_length=200)
    customer_email: EmailStr
    customer_phone: str
    # US address mapping: governorate=state, area=city, street=line1, building=apt, block=ZIP
    governorate: str = Field(min_length=2, max_length=64)  # US state (2-letter preferred)
    area: str = Field(min_length=2, max_length=128)  # city
    street: str = Field(min_length=3, max_length=128)  # address line 1
    building: str | None = Field(default=None, max_length=64)  # apt/suite
    block: str = Field(min_length=5, max_length=32)  # ZIP
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

    @field_validator("governorate")
    @classmethod
    def normalize_state(cls, v: str) -> str:
        s = v.strip()
        if _STATE_RE.match(s):
            return s.upper()
        if not s:
            raise ValueError("US state is required")
        return s

    @field_validator("block")
    @classmethod
    def validate_zip(cls, v: str) -> str:
        z = v.strip()
        if not _ZIP_RE.match(z):
            raise ValueError("Enter a valid US ZIP code (e.g. 90210 or 90210-1234)")
        return z

    @field_validator("area", "street")
    @classmethod
    def strip_required(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("This field is required")
        return s


COD_PACKS = {1: 179.0, 3: 280.0, 5: 340.0}


class CodOrderIn(BaseModel):
    customer_name: str = Field(min_length=2, max_length=200)
    customer_phone: str
    city: str = Field(min_length=2, max_length=128)
    qty: int
    event_id: str | None = None
    fbp: str | None = None
    fbc: str | None = None
    ttclid: str | None = None
    source: str | None = None
    utm_source: str | None = None
    utm_campaign: str | None = None

    @field_validator("qty")
    @classmethod
    def pack_qty(cls, v: int) -> int:
        if v not in COD_PACKS:
            raise ValueError("اختر عرض 1 أو 3 أو 5 علب")
        return v

    @field_validator("city")
    @classmethod
    def strip_city(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("اختَر المدينة")
        return s


class UpsellIn(BaseModel):
    upsell_sku: str
    upsell_price_usd: float
    event_id: str | None = None


class OrderOut(BaseModel):
    order_id: str
    order_number: str
    total_usd: float
    post_upsell: dict | None = None
    checkout_url: str | None = None

    class Config:
        from_attributes = True
