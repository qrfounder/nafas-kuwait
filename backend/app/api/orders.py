import json
import logging
import uuid
from datetime import datetime

import stripe
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.order import Order, OrderLine
from app.schemas.orders import CreateOrderIn, OrderOut, UpsellIn
from app.services.order_pricing import PricedLine, price_order
from app.services.phone_us import validate_us_phone
from app.services.store_catalog import get_product_merged

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/orders", tags=["orders"])


def _order_number() -> str:
    return f"NF-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"


def _create_checkout_session(
    order: Order,
    email: str,
    priced_lines: list[PricedLine],
    shipping: float,
) -> stripe.checkout.Session:
    stripe.api_key = settings.stripe_secret_key
    origin = settings.frontend_origin.rstrip("/")
    line_items: list[dict] = []

    for line in priced_lines:
        unit_amount = int(round(line.unit_price_usd * 100))
        if unit_amount < 0:
            raise HTTPException(400, "Invalid line price")
        line_items.append(
            {
                "quantity": max(1, line.qty),
                "price_data": {
                    "currency": "usd",
                    "unit_amount": unit_amount,
                    "product_data": {
                        "name": (line.title_ar[:120] or line.sku),
                    },
                },
            }
        )

    if shipping > 0:
        line_items.append(
            {
                "quantity": 1,
                "price_data": {
                    "currency": "usd",
                    "unit_amount": int(round(shipping * 100)),
                    "product_data": {"name": "US shipping"},
                },
            }
        )

    return stripe.checkout.Session.create(
        mode="payment",
        line_items=line_items,
        customer_email=email,
        client_reference_id=order.order_number,
        metadata={
            "order_number": order.order_number,
            "order_id": str(order.id),
        },
        success_url=(
            f"{origin}/thank-you?order={order.order_number}"
            "&session_id={CHECKOUT_SESSION_ID}"
        ),
        cancel_url=f"{origin}/collection?checkout=cancelled",
    )


@router.post("", response_model=OrderOut)
async def create_order(body: CreateOrderIn, db: Session = Depends(get_db)):
    if not settings.stripe_secret_key:
        raise HTTPException(
            503,
            "Stripe payments are not configured. Set STRIPE_SECRET_KEY and try again.",
        )

    product = get_product_merged(db, body.product_slug)
    if not product:
        raise HTTPException(400, "Product not found")

    ok, phone, err = validate_us_phone(body.customer_phone)
    if not ok:
        raise HTTPException(400, err)

    priced_lines, subtotal, total = price_order(db, body)
    shipping = round(total - subtotal, 2)

    event_id = body.event_id or str(uuid.uuid4())
    order_num = _order_number()
    items_json = json.dumps(
        [
            {
                "sku": p.sku,
                "title_ar": p.title_ar,
                "qty": p.qty,
                "price_usd": p.line_total_usd,
                "unit_price_usd": p.unit_price_usd,
                "line_type": p.line_type,
            }
            for p in priced_lines
        ],
        ensure_ascii=False,
    )

    order = Order(
        order_number=order_num,
        customer_name=body.customer_name.strip(),
        customer_email=str(body.customer_email).strip().lower(),
        customer_phone=phone,
        governorate=body.governorate.strip(),
        area=body.area.strip(),
        block=body.block.strip(),
        street=body.street.strip(),
        building=(body.building or "").strip() or None,
        delivery_notes=(body.delivery_notes or "").strip() or None,
        product_slug=body.product_slug,
        offer_tier=body.offer_tier,
        subtotal_usd=subtotal,
        total_usd=total,
        items_json=items_json,
        event_id=event_id,
        fbp=body.fbp,
        fbc=body.fbc,
        ttclid=body.ttclid,
        source=body.source,
        utm_source=body.utm_source,
        utm_campaign=body.utm_campaign,
        status="pending_payment",
        payment_status="pending",
    )
    db.add(order)
    for line in priced_lines:
        db.add(
            OrderLine(
                order=order,
                sku=line.sku,
                title_ar=line.title_ar,
                qty=line.qty,
                # Store unit price; line total = unit × qty
                price_usd=line.unit_price_usd,
                line_type=line.line_type,
            )
        )
    db.flush()

    try:
        session = _create_checkout_session(
            order,
            str(body.customer_email).strip().lower(),
            priced_lines,
            shipping,
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Stripe Checkout Session failed: %s", e)
        raise HTTPException(502, "Could not start Stripe checkout. Please try again.") from e

    order.stripe_session_id = session.id
    db.commit()
    db.refresh(order)

    return OrderOut(
        order_id=str(order.id),
        order_number=order_num,
        total_usd=order.total_usd,
        post_upsell=product.get("post_upsell"),
        checkout_url=session.url,
    )


@router.patch("/{order_number}/upsell", response_model=OrderOut)
async def accept_upsell(order_number: str, body: UpsellIn, db: Session = Depends(get_db)):
    """Disabled: unpaid post-checkout upsells violate paid-order integrity."""
    _ = order_number, body, db
    raise HTTPException(
        410,
        "Post-checkout upsells are disabled. Add items before Stripe checkout.",
    )
