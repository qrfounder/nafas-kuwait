from sqlalchemy.orm import Session

from app.data.products import (
    DEFAULT_SKU_QUANTITY,
    SINGLE_SKU_PRICES,
    SKU_HINTS,
    SKU_LABELS,
)
from app.models.sku_inventory import SkuInventory


def _default_row(sku: str) -> SkuInventory:
    prices = SINGLE_SKU_PRICES.get(sku, {"price": 0, "anchor": 0})
    return SkuInventory(
        sku=sku,
        label_ar=SKU_LABELS.get(sku, sku),
        hint_ar=SKU_HINTS.get(sku),
        price=float(prices["price"]),
        anchor=float(prices["anchor"]),
        quantity=DEFAULT_SKU_QUANTITY,
        active=True,
    )


def ensure_sku_rows(db: Session) -> None:
    existing = {r.sku for r in db.query(SkuInventory.sku).all()}
    for sku in SKU_LABELS:
        if sku not in existing:
            db.add(_default_row(sku))
    db.commit()


def list_skus_merged(db: Session, shop_url: str) -> list[dict]:
    ensure_sku_rows(db)
    base = shop_url.rstrip("/")
    rows = {r.sku: r for r in db.query(SkuInventory).order_by(SkuInventory.sku).all()}
    out: list[dict] = []
    for sku in SKU_LABELS:
        row = rows.get(sku) or _default_row(sku)
        label = row.label_ar
        hint = row.hint_ar or ""
        # Prefer English catalog if DB still has Arabic Kuwait copy
        if any("\u0600" <= ch <= "\u06FF" for ch in (label or "")):
            label = SKU_LABELS.get(sku, sku)
        if any("\u0600" <= ch <= "\u06FF" for ch in (hint or "")):
            hint = SKU_HINTS.get(sku, "")
        out.append(
            {
                "sku": sku,
                "label_ar": label,
                "hint_ar": hint,
                "price": row.price,
                "anchor": row.anchor,
                "quantity": row.quantity,
                "active": row.active,
                "image_url": f"{base}/products/{sku}.webp",
                "has_override": sku in rows,
            }
        )
    return out


def get_sku_merged(db: Session, sku: str) -> dict | None:
    if sku not in SKU_LABELS:
        return None
    ensure_sku_rows(db)
    row = db.query(SkuInventory).filter(SkuInventory.sku == sku).first()
    if not row:
        row = _default_row(sku)
    return {
        "sku": sku,
        "label_ar": row.label_ar,
        "hint_ar": row.hint_ar or "",
        "price": row.price,
        "anchor": row.anchor,
        "quantity": row.quantity,
        "active": row.active,
    }
