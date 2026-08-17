from app.services.capi.meta import send_meta_purchase
from app.services.capi.snapchat import send_snap_purchase
from app.services.capi.tiktok import send_tiktok_purchase


async def fire_purchase_events(
    *,
    event_id: str,
    value: float,
    phone_digits: str,
    customer_name: str,
    fbp: str | None,
    fbc: str | None,
    source_url: str,
    currency: str = "USD",
) -> None:
    await send_meta_purchase(
        event_id=event_id,
        value=value,
        currency=currency,
        phone_digits=phone_digits,
        customer_name=customer_name,
        fbp=fbp,
        fbc=fbc,
        event_source_url=source_url,
    )
    await send_tiktok_purchase(
        event_id=event_id,
        value=value,
        currency=currency,
        phone_digits=phone_digits,
        event_source_url=source_url,
    )
    await send_snap_purchase(
        event_id=event_id,
        value=value,
        currency=currency,
        phone_digits=phone_digits,
        event_source_url=source_url,
    )
