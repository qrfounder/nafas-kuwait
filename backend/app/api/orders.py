import json
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.data.products import CROSS_SELLS, PRODUCTS
from app.database import get_db
from app.models.order import Order, OrderLine
from app.schemas.orders import CreateOrderIn, OrderOut, UpsellIn
from app.services.capi import fire_purchase_events
from app.services.phone_kw import validate_kuwait_phone
from app.services.sheets_webhook import order_to_sheet_row, send_order_to_sheet

router = APIRouter(prefix="/api/orders", tags=["orders"])


def _order_number() -> str:
    return f"NF-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"


@router.post("", response_model=OrderOut)
async def create_order(body: CreateOrderIn, db: Session = Depends(get_db)):
    if body.product_slug not in PRODUCTS:
        raise HTTPException(400, "منتج غير موجود")
    ok, phone, err = validate_kuwait_phone(body.customer_phone)
    if not ok:
        raise HTTPException(400, err)

    event_id = body.event_id or str(uuid.uuid4())
    order_num = _order_number()
    items_json = json.dumps([l.model_dump() for l in body.lines], ensure_ascii=False)

    order = Order(
        order_number=order_num,
        customer_name=body.customer_name.strip(),
        customer_phone=phone,
        governorate=body.governorate.strip(),
        area=body.area.strip(),
        block=body.block.strip(),
        street=body.street.strip(),
        building=(body.building or "").strip() or None,
        delivery_notes=(body.delivery_notes or "").strip() or None,
        product_slug=body.product_slug,
        offer_tier=body.offer_tier,
        subtotal_usd=body.subtotal_usd,
        total_usd=body.total_usd,
        items_json=items_json,
        event_id=event_id,
        fbp=body.fbp,
        fbc=body.fbc,
        ttclid=body.ttclid,
        source=body.source,
        utm_source=body.utm_source,
        utm_campaign=body.utm_campaign,
        status="new",
    )
    db.add(order)
    for line in body.lines:
        db.add(
            OrderLine(
                order=order,
                sku=line.sku,
                title_ar=line.title_ar,
                qty=line.qty,
                price_usd=line.price_usd,
                line_type=line.line_type,
            )
        )
    db.commit()
    db.refresh(order)

    source_url = f"{settings.frontend_origin}/thank-you?order={order_num}"
    await fire_purchase_events(
        event_id=event_id,
        value=body.total_usd,
        phone_digits=phone,
        customer_name=body.customer_name,
        fbp=body.fbp,
        fbc=body.fbc,
        source_url=source_url,
    )
    await send_order_to_sheet(order_to_sheet_row(order))

    product = PRODUCTS[body.product_slug]
    return OrderOut(
        order_id=str(order.id),
        order_number=order_num,
        total_usd=order.total_usd,
        post_upsell=product.get("post_upsell"),
    )


@router.patch("/{order_number}/upsell", response_model=OrderOut)
async def accept_upsell(order_number: str, body: UpsellIn, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(404, "الطلب غير موجود")
    if order.upsell_accepted:
        raise HTTPException(400, "تمت إضافة العرض مسبقاً")

    order.upsell_accepted = True
    order.upsell_sku = body.upsell_sku
    order.upsell_price_usd = body.upsell_price_usd
    order.total_usd = order.subtotal_usd + body.upsell_price_usd

    upsell_title = CROSS_SELLS.get(body.upsell_sku, {}).get("title_ar", body.upsell_sku)
    for p in PRODUCTS.values():
        if p.get("post_upsell", {}).get("sku") == body.upsell_sku:
            upsell_title = p["post_upsell"]["title_ar"]
            break
    db.add(
        OrderLine(
            order_id=order.id,
            sku=body.upsell_sku,
            title_ar=upsell_title,
            qty=1,
            price_usd=body.upsell_price_usd,
            line_type="upsell",
        )
    )
    db.commit()
    db.refresh(order)

    event_id = body.event_id or str(uuid.uuid4())
    source_url = f"{settings.frontend_origin}/thank-you?order={order_number}"
    await fire_purchase_events(
        event_id=event_id,
        value=body.upsell_price_usd,
        phone_digits=order.customer_phone,
        customer_name=order.customer_name,
        fbp=order.fbp,
        fbc=order.fbc,
        source_url=source_url,
    )
    await send_order_to_sheet(order_to_sheet_row(order))

    return OrderOut(
        order_id=str(order.id),
        order_number=order.order_number,
        total_usd=order.total_usd,
        post_upsell=None,
    )
