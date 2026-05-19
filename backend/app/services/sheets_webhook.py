import json
import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


async def send_order_to_sheet(payload: dict) -> bool:
    url = settings.google_sheets_webhook_url
    if not url:
        logger.warning("GOOGLE_SHEETS_WEBHOOK_URL not set; skipping sheet sync")
        return False
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
        return True
    except Exception as e:
        logger.exception("Sheet webhook failed: %s", e)
        return False


def order_to_sheet_row(order) -> dict:
    return {
        "order_id": order.order_number,
        "created_at": order.created_at.isoformat() + "Z",
        "name": order.customer_name,
        "phone": order.customer_phone,
        "governorate": getattr(order, "governorate", None) or "",
        "area": getattr(order, "area", None) or "",
        "block": getattr(order, "block", None) or "",
        "street": getattr(order, "street", None) or "",
        "building": getattr(order, "building", None) or "",
        "delivery_notes": getattr(order, "delivery_notes", None) or "",
        "product": order.product_slug,
        "tier": order.offer_tier,
        "items_json": order.items_json,
        "subtotal_usd": order.subtotal_usd,
        "upsell_sku": order.upsell_sku or "",
        "upsell_price_usd": order.upsell_price_usd or 0,
        "total_usd": order.total_usd,
        "utm_source": order.utm_source or "",
        "utm_campaign": order.utm_campaign or "",
        "event_id": order.event_id or "",
        "status": order.status,
    }
