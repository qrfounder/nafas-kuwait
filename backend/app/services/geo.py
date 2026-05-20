import logging
from dataclasses import dataclass

import httpx
from fastapi import Request

logger = logging.getLogger(__name__)

_PRIVATE_IP_PREFIXES = ("127.", "10.", "192.168.", "172.16.", "::1", "fc00:")

# Fallback centroids when IP lookup has no coordinates
COUNTRY_CENTROIDS: dict[str, tuple[float, float]] = {
    "Kuwait": (29.3759, 47.9774),
    "KW": (29.3759, 47.9774),
    "Saudi Arabia": (23.8859, 45.0792),
    "SA": (23.8859, 45.0792),
    "United Arab Emirates": (23.4241, 53.8478),
    "AE": (23.4241, 53.8478),
    "Qatar": (25.3548, 51.1839),
    "QA": (25.3548, 51.1839),
    "Bahrain": (26.0667, 50.5577),
    "BH": (26.0667, 50.5577),
    "Oman": (21.4735, 55.9754),
    "OM": (21.4735, 55.9754),
    "Egypt": (26.8206, 30.8025),
    "EG": (26.8206, 30.8025),
    "United States": (37.0902, -95.7129),
    "US": (37.0902, -95.7129),
    "United Kingdom": (55.3781, -3.436),
    "GB": (55.3781, -3.436),
}


@dataclass
class GeoInfo:
    country: str | None
    city: str | None
    lat: float | None
    lng: float | None


def client_ip(request: Request) -> str | None:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return None


def _is_private(ip: str) -> bool:
    return any(ip.startswith(p) for p in _PRIVATE_IP_PREFIXES)


def _centroid(country: str | None) -> tuple[float | None, float | None]:
    if not country:
        return None, None
    c = COUNTRY_CENTROIDS.get(country) or COUNTRY_CENTROIDS.get(country.upper())
    return c if c else (None, None)


async def resolve_geo(request: Request, ip: str | None) -> tuple[str | None, str | None]:
    g = await resolve_geo_full(request, ip)
    return g.country, g.city


async def resolve_geo_full(request: Request, ip: str | None) -> GeoInfo:
    country = request.headers.get("cf-ipcountry") or request.headers.get("CF-IPCountry")
    city = request.headers.get("cf-ipcity") or request.headers.get("CF-IPCity")
    lat_s = request.headers.get("cf-iplatitude") or request.headers.get("CF-IPLatitude")
    lng_s = request.headers.get("cf-iplongitude") or request.headers.get("CF-IPLongitude")

    lat = float(lat_s) if lat_s else None
    lng = float(lng_s) if lng_s else None

    if country:
        if lat is None or lng is None:
            lat, lng = _centroid(country)
        return GeoInfo(
            country=country.upper() if len(country) == 2 else country,
            city=city,
            lat=lat,
            lng=lng,
        )

    if not ip or _is_private(ip):
        return GeoInfo(None, None, None, None)

    try:
        async with httpx.AsyncClient(timeout=2.5) as client:
            res = await client.get(
                f"http://ip-api.com/json/{ip}",
                params={"fields": "status,country,city,lat,lon"},
            )
            data = res.json()
            if data.get("status") == "success":
                country = data.get("country")
                lat = data.get("lat")
                lng = data.get("lon")
                if lat is None or lng is None:
                    lat, lng = _centroid(country)
                return GeoInfo(country=country, city=data.get("city"), lat=lat, lng=lng)
    except Exception as e:
        logger.debug("geo lookup failed for %s: %s", ip, e)

    return GeoInfo(None, None, None, None)
