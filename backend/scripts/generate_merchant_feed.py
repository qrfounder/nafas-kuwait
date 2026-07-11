#!/usr/bin/env python3
"""Generate frontend/public/feeds/google-merchant.xml from catalog (no DB)."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.config import settings  # noqa: E402
from app.data.products import PRODUCTS  # noqa: E402
from app.services.merchant_feed import (  # noqa: E402
    build_google_merchant_xml,
    catalog_items_from_products,
)


def main() -> None:
    shop = settings.shop_public_url.rstrip("/")
    items = catalog_items_from_products(
        PRODUCTS,
        shop_base=shop,
        shipping_usd=float(settings.us_shipping_usd),
    )
    xml = build_google_merchant_xml(items, shop_base=shop)
    out = ROOT.parent / "frontend" / "public" / "feeds" / "google-merchant.xml"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(xml, encoding="utf-8")
    print(f"Wrote {out} ({len(items)} products)")


if __name__ == "__main__":
    main()
