import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class StoreSettings(Base):
    """Singleton row (id=1): pixels + shop URL for macros."""

    __tablename__ = "store_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    shop_url: Mapped[str] = mapped_column(String(256), default="https://naffas.shop")
    meta_pixel_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    tiktok_pixel_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    snap_pixel_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Redirect(Base):
    __tablename__ = "redirects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    from_path: Mapped[str] = mapped_column(String(512), unique=True, index=True)
    to_path: Mapped[str] = mapped_column(String(1024))
    status_code: Mapped[int] = mapped_column(Integer, default=302)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    note: Mapped[str | None] = mapped_column(String(256), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ProductOverride(Base):
    """Per-slug overrides merged onto catalog defaults."""

    __tablename__ = "product_overrides"

    slug: Mapped[str] = mapped_column(String(64), primary_key=True)
    title_ar: Mapped[str | None] = mapped_column(String(256), nullable=True)
    subtitle_ar: Mapped[str | None] = mapped_column(String(512), nullable=True)
    base_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    anchor_single: Mapped[float | None] = mapped_column(Float, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    tiers_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
