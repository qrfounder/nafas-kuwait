import logging
import time

import httpx

from app.config import settings
from app.services.pii_hash import hash_phone_meta

logger = logging.getLogger(__name__)


async def send_snap_purchase(
    *,
    event_id: str,
    value: float,
    currency: str,
    phone_digits: str,
    event_source_url: str,
) -> bool:
    if not settings.snap_pixel_id or not settings.snap_capi_token:
        return False
    url = f"https://tr.snapchat.com/v2/conversion"
    payload = {
        "pixel_id": settings.snap_pixel_id,
        "timestamp": int(time.time() * 1000),
        "event_type": "PURCHASE",
        "event_conversion_type": "WEB",
        "client_dedup_id": event_id,
        "transaction_id": event_id,
        "price": value,
        "currency": currency,
        "page_url": event_source_url,
        "user_data": {"phone_number": hash_phone_meta(phone_digits)},
    }
    headers = {"Authorization": f"Bearer {settings.snap_capi_token}", "Content-Type": "application/json"}
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.post(url, json=payload, headers=headers)
            r.raise_for_status()
        return True
    except Exception:
        logger.exception("Snap CAPI failed")
        return False
