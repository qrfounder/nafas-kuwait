import logging

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.order import Order
from app.services.capi import fire_purchase_events
from app.services.sheets_webhook import order_to_sheet_row, send_order_to_sheet

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/stripe", tags=["stripe"])


async def _mark_paid_and_notify(order: Order, session_id: str | None) -> None:
    if order.payment_status == "paid":
        logger.info("Order %s already paid; skipping notify", order.order_number)
        return

    order.payment_status = "paid"
    order.status = "paid"
    if session_id and not order.stripe_session_id:
        order.stripe_session_id = session_id

    source_url = f"{settings.frontend_origin.rstrip('/')}/thank-you?order={order.order_number}"
    event_id = order.event_id or order.order_number
    await fire_purchase_events(
        event_id=event_id,
        value=order.total_usd,
        phone_digits=order.customer_phone,
        customer_name=order.customer_name,
        fbp=order.fbp,
        fbc=order.fbc,
        source_url=source_url,
    )
    await send_order_to_sheet(order_to_sheet_row(order))


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    if settings.stripe_webhook_secret:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.stripe_webhook_secret
            )
        except ValueError as e:
            raise HTTPException(400, "Invalid payload") from e
        except stripe.SignatureVerificationError as e:
            raise HTTPException(400, "Invalid signature") from e
    else:
        import json

        logger.warning("STRIPE_WEBHOOK_SECRET unset — accepting unsigned webhook (dev only)")
        try:
            event = json.loads(payload)
        except Exception as e:
            raise HTTPException(400, "Invalid JSON") from e

    event_type = event["type"] if isinstance(event, dict) else event.type
    data_object = event["data"]["object"] if isinstance(event, dict) else event.data.object

    if event_type == "checkout.session.completed":
        session = data_object
        session_id = session.get("id") if isinstance(session, dict) else session.id
        metadata = session.get("metadata") if isinstance(session, dict) else (session.metadata or {})
        order_number = None
        if metadata is not None:
            try:
                order_number = metadata["order_number"]
            except Exception:
                order_number = getattr(metadata, "order_number", None) or None
        if not order_number:
            order_number = (
                session.get("client_reference_id")
                if isinstance(session, dict)
                else getattr(session, "client_reference_id", None)
            )

        order = None
        if order_number:
            order = db.query(Order).filter(Order.order_number == order_number).first()
        if not order and session_id:
            order = db.query(Order).filter(Order.stripe_session_id == session_id).first()

        if not order:
            logger.error("Stripe webhook: order not found for session %s", session_id)
            raise HTTPException(404, "Order not found")

        await _mark_paid_and_notify(order, session_id)
        db.commit()

    return {"received": True}
