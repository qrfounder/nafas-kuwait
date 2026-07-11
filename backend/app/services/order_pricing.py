"""Authoritative order pricing. Never trust client-supplied USD amounts."""

from __future__ import annotations

from dataclasses import dataclass

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.data.products import CROSS_SELLS, SINGLE_SKU_PRICES, SKU_LABELS
from app.schemas.orders import CartLineIn, CreateOrderIn
from app.services.sku_catalog import get_sku_merged
from app.services.store_catalog import get_product_merged

CHECKOUT_EXTRAS: dict[str, dict] = {
    "priority_delivery": {
        "title_ar": "Priority fulfillment",
        "price": 7.0,
    },
    "delivery_protection": {
        "title_ar": "Faster damage follow-up",
        "price": 5.0,
    },
}


def _money(value: float) -> float:
    return round(float(value) + 1e-9, 2)


@dataclass
class PricedLine:
    sku: str
    title_ar: str
    qty: int
    """Unit price in USD (Stripe unit_amount)."""
    unit_price_usd: float
    line_type: str

    @property
    def line_total_usd(self) -> float:
        return _money(self.unit_price_usd * self.qty)


def shipping_usd(subtotal: float) -> float:
    if subtotal >= settings.free_shipping_threshold_usd:
        return 0.0
    return _money(settings.us_shipping_usd)


def price_order(db: Session, body: CreateOrderIn) -> tuple[list[PricedLine], float, float]:
    """Return (lines, subtotal, total_with_shipping) from catalog prices only."""
    product = get_product_merged(db, body.product_slug)
    if not product:
        raise HTTPException(400, "Product not found")
    if not body.lines:
        raise HTTPException(400, "Cart is empty")

    priced: list[PricedLine] = []
    primary_count = 0

    for line in body.lines:
        lt = (line.line_type or "product").strip().lower()
        if lt == "product":
            primary_count += 1
            priced.append(_price_bundle(product, body.offer_tier))
        elif lt == "single":
            primary_count += 1
            priced.append(_price_single(db, line))
        elif lt == "cross_sell":
            priced.append(_price_cross_sell(db, line.sku))
        elif lt == "checkout_extra":
            priced.append(_price_checkout_extra(line.sku))
        else:
            raise HTTPException(400, f"Unknown line type: {line.line_type}")

    if primary_count != 1:
        raise HTTPException(400, "Cart must include exactly one kit or single-piece line")

    subtotal = _money(sum(p.line_total_usd for p in priced))
    ship = shipping_usd(subtotal)
    total = _money(subtotal + ship)
    return priced, subtotal, total


def _price_bundle(product: dict, offer_tier: int) -> PricedLine:
    tier = next((t for t in product.get("tiers") or [] if int(t["tier"]) == int(offer_tier)), None)
    if not tier:
        raise HTTPException(400, "Invalid offer tier")
    # Package price as a single Stripe line (avoids qty × package double-charge).
    return PricedLine(
        sku=product["slug"],
        title_ar=f"{product['title_ar']}, {tier['label_ar']}",
        qty=1,
        unit_price_usd=_money(tier["price"]),
        line_type="product",
    )


def _price_single(db: Session, line: CartLineIn) -> PricedLine:
    sku = line.sku.strip()
    row = get_sku_merged(db, sku)
    catalog = SINGLE_SKU_PRICES.get(sku)
    if not row and not catalog:
        raise HTTPException(400, f"Unknown SKU: {sku}")
    unit = float(row["price"]) if row else float(catalog["price"])  # type: ignore[index]
    if unit <= 0:
        raise HTTPException(400, f"SKU not for sale: {sku}")
    qty = max(1, min(3, int(line.qty or 1)))
    label = (row or {}).get("label_ar") if row else None
    title = label or SKU_LABELS.get(sku, sku)
    if qty > 1:
        title = f"{title} ({qty} pieces)"
    return PricedLine(
        sku=sku,
        title_ar=title,
        qty=qty,
        unit_price_usd=_money(unit),
        line_type="single",
    )


def _price_cross_sell(db: Session, sku: str) -> PricedLine:
    sku = sku.strip()
    cross = CROSS_SELLS.get(sku)
    row = get_sku_merged(db, sku)
    if cross:
        unit = float(cross["price"])
        title = cross.get("title_ar") or SKU_LABELS.get(sku, sku)
    elif row:
        unit = float(row["price"])
        title = row.get("label_ar") or SKU_LABELS.get(sku, sku)
    elif sku in SINGLE_SKU_PRICES:
        unit = float(SINGLE_SKU_PRICES[sku]["price"])
        title = SKU_LABELS.get(sku, sku)
    else:
        raise HTTPException(400, f"Unknown add-on SKU: {sku}")
    return PricedLine(
        sku=sku,
        title_ar=title,
        qty=1,
        unit_price_usd=_money(unit),
        line_type="cross_sell",
    )


def _price_checkout_extra(sku: str) -> PricedLine:
    extra = CHECKOUT_EXTRAS.get(sku.strip())
    if not extra:
        raise HTTPException(400, f"Unknown checkout option: {sku}")
    return PricedLine(
        sku=sku.strip(),
        title_ar=extra["title_ar"],
        qty=1,
        unit_price_usd=_money(extra["price"]),
        line_type="checkout_extra",
    )
