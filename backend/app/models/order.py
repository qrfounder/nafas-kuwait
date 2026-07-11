import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    customer_name: Mapped[str] = mapped_column(String(200))
    customer_phone: Mapped[str] = mapped_column(String(20), index=True)
    customer_email: Mapped[str | None] = mapped_column(String(254), nullable=True)

    governorate: Mapped[str | None] = mapped_column(String(64), nullable=True)
    area: Mapped[str | None] = mapped_column(String(128), nullable=True)
    block: Mapped[str | None] = mapped_column(String(32), nullable=True)
    street: Mapped[str | None] = mapped_column(String(128), nullable=True)
    building: Mapped[str | None] = mapped_column(String(64), nullable=True)
    delivery_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    product_slug: Mapped[str] = mapped_column(String(64))
    offer_tier: Mapped[int] = mapped_column(Integer)

    subtotal_usd: Mapped[float] = mapped_column(Float)
    total_usd: Mapped[float] = mapped_column(Float)

    upsell_accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    upsell_sku: Mapped[str | None] = mapped_column(String(64), nullable=True)
    upsell_price_usd: Mapped[float | None] = mapped_column(Float, nullable=True)

    items_json: Mapped[str] = mapped_column(Text)
    currency_display: Mapped[str] = mapped_column(String(8), default="USD")
    source: Mapped[str | None] = mapped_column(String(64), nullable=True)
    utm_source: Mapped[str | None] = mapped_column(String(128), nullable=True)
    utm_campaign: Mapped[str | None] = mapped_column(String(128), nullable=True)

    event_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    fbp: Mapped[str | None] = mapped_column(String(256), nullable=True)
    fbc: Mapped[str | None] = mapped_column(String(256), nullable=True)
    ttclid: Mapped[str | None] = mapped_column(String(256), nullable=True)

    status: Mapped[str] = mapped_column(String(32), default="new")
    payment_status: Mapped[str] = mapped_column(String(32), default="pending")  # pending|paid|failed|refunded
    stripe_session_id: Mapped[str | None] = mapped_column(String(256), nullable=True, index=True)

    lines: Mapped[list["OrderLine"]] = relationship(back_populates="order", cascade="all, delete-orphan")


class OrderLine(Base):
    __tablename__ = "order_lines"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"))
    sku: Mapped[str] = mapped_column(String(64))
    title_ar: Mapped[str] = mapped_column(String(256))
    qty: Mapped[int] = mapped_column(Integer, default=1)
    price_usd: Mapped[float] = mapped_column(Float)
    line_type: Mapped[str] = mapped_column(String(32), default="product")

    order: Mapped["Order"] = relationship(back_populates="lines")
