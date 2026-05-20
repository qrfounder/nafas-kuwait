import logging

import httpx
from fastapi import Request

logger = logging.getLogger(__name__)

_PRIVATE_IP_PREFIXES = ("127.", "10.", "192.168.", "172.16.", "::1", "fc00:")


def client_ip(request: Request) -> str | None:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return None


def _is_private(ip: str) -> bool:
    return any(ip.startswith(p) for p in _PRIVATE_IP_PREFIXES)


async def resolve_geo(request: Request, ip: str | None) -> tuple[str | None, str | None]:
    country = request.headers.get("cf-ipcountry") or request.headers.get("CF-IPCountry")
    city = request.headers.get("cf-ipcity") or request.headers.get("CF-IPCity")
    if country:
        return country.upper() if len(country) == 2 else country, city

    if not ip or _is_private(ip):
        return None, None

    try:
        async with httpx.AsyncClient(timeout=2.5) as client:
            res = await client.get(
                f"http://ip-api.com/json/{ip}",
                params={"fields": "status,country,city"},
            )
            data = res.json()
            if data.get("status") == "success":
                return data.get("country"), data.get("city")
    except Exception as e:
        logger.debug("geo lookup failed for %s: %s", ip, e)
    return None, None
