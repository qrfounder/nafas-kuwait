import logging
import time

import httpx

from app.config import settings
from app.services.pii_hash import hash_phone_tiktok

logger = logging.getLogger(__name__)


async def send_tiktok_purchase(
    *,
    event_id: str,
    value: float,
    currency: str,
    phone_digits: str,
    event_source_url: str,
) -> bool:
    if not settings.tiktok_pixel_id or not settings.tiktok_access_token:
        return False
    url = "https://business-api.tiktok.com/open_api/v1.3/event/track/"
    payload = {
        "event_source": "web",
        "event_source_id": settings.tiktok_pixel_id,
        "data": [
            {
                "event": "CompletePayment",
                "event_time": int(time.time()),
                "event_id": event_id,
                "user": {"phone": hash_phone_tiktok(phone_digits)},
                "properties": {
                    "currency": currency,
                    "value": value,
                    "content_type": "product",
                },
                "page": {"url": event_source_url},
            }
        ],
    }
    headers = {"Access-Token": settings.tiktok_access_token, "Content-Type": "application/json"}
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.post(url, json=payload, headers=headers)
            r.raise_for_status()
        return True
    except Exception:
        logger.exception("TikTok Events API failed")
        return False
