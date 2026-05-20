from pydantic import BaseModel, Field


class PixelSettingsIn(BaseModel):
    shop_url: str = Field(max_length=256)
    meta_pixel_id: str = ""
    tiktok_pixel_id: str = ""
    snap_pixel_id: str = ""


class PixelSettingsOut(PixelSettingsIn):
    updated_at: str | None = None


class RedirectIn(BaseModel):
    from_path: str = Field(min_length=1, max_length=512)
    to_path: str = Field(min_length=1, max_length=1024)
    status_code: int = Field(default=302, ge=301, le=308)
    enabled: bool = True
    note: str | None = Field(default=None, max_length=256)


class RedirectOut(RedirectIn):
    id: str
    to_path_resolved: str


class ProductOverrideIn(BaseModel):
    title_ar: str | None = None
    subtitle_ar: str | None = None
    base_price: float | None = None
    anchor_single: float | None = None
    active: bool = True
    tiers_json: str | None = None


class AdminProductOut(BaseModel):
    slug: str
    title_ar: str
    subtitle_ar: str
    base_price: float
    anchor_single: float
    active: bool
    tiers: list
    product_url: str
    has_override: bool
    post_upsell: dict | None = None
    includes: list[str] = []


class SkuInventoryIn(BaseModel):
    label_ar: str = Field(min_length=1, max_length=256)
    hint_ar: str | None = Field(default=None, max_length=512)
    price: float = Field(ge=0)
    anchor: float = Field(ge=0)
    quantity: int = Field(ge=0, le=99999)
    active: bool = True


class AdminSkuOut(SkuInventoryIn):
    sku: str
    image_url: str
    has_override: bool = False
