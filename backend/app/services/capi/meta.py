import logging
import time

import httpx

from app.config import settings
from app.services.pii_hash import hash_name_meta, hash_phone_meta

logger = logging.getLogger(__name__)


async def send_meta_purchase(
    *,
    event_id: str,
    value: float,
    currency: str,
    phone_digits: str,
    customer_name: str,
    fbp: str | None,
    fbc: str | None,
    event_source_url: str,
) -> bool:
    if not settings.meta_pixel_id or not settings.meta_capi_access_token:
        return False
    url = f"https://graph.facebook.com/v21.0/{settings.meta_pixel_id}/events"
    user_data: dict = {"ph": [hash_phone_meta(phone_digits)]}
    if customer_name:
        fn = hash_name_meta(customer_name)
        if fn:
            user_data["fn"] = [fn]
    if fbp:
        user_data["fbp"] = fbp
    if fbc:
        user_data["fbc"] = fbc
    payload = {
        "data": [
            {
                "event_name": "Purchase",
                "event_time": int(time.time()),
                "event_id": event_id,
                "action_source": "website",
                "event_source_url": event_source_url,
                "user_data": user_data,
                "custom_data": {"currency": currency, "value": value},
            }
        ],
        "access_token": settings.meta_capi_access_token,
    }
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.post(url, json=payload)
            r.raise_for_status()
        return True
    except Exception:
        logger.exception("Meta CAPI Purchase failed")
        return False
