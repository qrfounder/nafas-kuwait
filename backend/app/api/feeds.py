"""Google / Bing Merchant Center product feed."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.services.merchant_feed import (
    build_google_merchant_tsv,
    build_google_merchant_xml,
    catalog_items_from_products,
)
from app.services.store_catalog import list_products_merged

router = APIRouter(prefix="/api/feeds", tags=["feeds"])


def _shop_base() -> str:
    return settings.shop_public_url.rstrip("/")


def iter_feed_products(db: Session) -> list[dict]:
    products = list_products_merged(db, include_ad_landing=False)
    as_dict = {p["slug"]: p for p in products}
    return catalog_items_from_products(
        as_dict,
        shop_base=_shop_base(),
        shipping_usd=float(settings.us_shipping_usd),
        exclude_slugs={"test"},
    )


@router.get("/google-merchant.xml")
def google_merchant_xml(db: Session = Depends(get_db)):
    items = iter_feed_products(db)
    xml = build_google_merchant_xml(items, shop_base=_shop_base())
    return Response(content=xml, media_type="application/xml; charset=utf-8")


@router.get("/google-merchant.txt")
def google_merchant_tsv(db: Session = Depends(get_db)):
    items = iter_feed_products(db)
    tsv = build_google_merchant_tsv(items)
    return Response(content=tsv, media_type="text/tab-separated-values; charset=utf-8")
