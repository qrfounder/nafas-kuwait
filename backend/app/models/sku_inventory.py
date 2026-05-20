from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SkuInventory(Base):
    __tablename__ = "sku_inventory"

    sku: Mapped[str] = mapped_column(String(64), primary_key=True)
    label_ar: Mapped[str] = mapped_column(String(256))
    hint_ar: Mapped[str | None] = mapped_column(String(512), nullable=True)
    price: Mapped[float] = mapped_column(Float)
    anchor: Mapped[float] = mapped_column(Float)
    quantity: Mapped[int] = mapped_column(Integer, default=0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
