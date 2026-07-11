"""Pure Google Merchant feed builders (no DB)."""

from __future__ import annotations

from xml.sax.saxutils import escape

_HERO_BY_SLUG = {
    "cycle-relief": "/products/emotional/cycle-relief/hero-960.webp",
    "body-relief": "/products/emotional/body-relief/hero-960.webp",
    "mother-gift": "/products/emotional/mother-gift/hero-960.webp",
}


def product_image_path(slug: str) -> str:
    return _HERO_BY_SLUG.get(slug, f"/products/emotional/{slug}/hero-960.webp")


def catalog_items_from_products(
    products: dict,
    *,
    shop_base: str,
    shipping_usd: float,
    exclude_slugs: frozenset[str] | set[str] | None = None,
) -> list[dict]:
    exclude = exclude_slugs or {"test"}
    shop = shop_base.rstrip("/")
    out: list[dict] = []
    for slug, p in products.items():
        if slug in exclude:
            continue
        price = float(p.get("base_price") or 0)
        desc = p.get("description_en") or p.get("subtitle_ar") or p.get("title_ar") or slug
        out.append(
            {
                "id": slug,
                "title": p.get("title_ar") or slug,
                "description": desc,
                "link": f"{shop}/product/{slug}",
                "image_link": f"{shop}{product_image_path(slug)}",
                "availability": "in_stock",
                "price": f"{price:.2f} USD",
                "brand": p.get("brand") or "Nafas",
                "condition": p.get("condition") or "new",
                "mpn": p.get("mpn") or f"NF-{slug.upper()}",
                "identifier_exists": "false" if not p.get("identifier_exists") else "true",
                "google_product_category": str(p.get("google_product_category") or "469"),
                "shipping_country": "US",
                "shipping_price": f"{float(shipping_usd):.2f} USD",
                "shipping_weight": f"{float(p.get('shipping_weight_lb') or 1):.1f} lb",
            }
        )
    return out


def build_google_merchant_xml(items: list[dict], *, shop_base: str) -> str:
    shop = shop_base.rstrip("/")
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
        "<channel>",
        f"<title>{escape('Nafas')}</title>",
        f"<link>{escape(shop)}</link>",
        f"<description>{escape('Nafas USA comfort kits')}</description>",
    ]
    for item in items:
        lines.append("<item>")
        for key in (
            "id",
            "title",
            "description",
            "link",
            "image_link",
            "availability",
            "price",
            "brand",
            "condition",
            "mpn",
            "identifier_exists",
            "google_product_category",
            "shipping_weight",
        ):
            val = item.get(key, "")
            lines.append(f"<g:{key}>{escape(str(val))}</g:{key}>")
        lines.append("<g:shipping>")
        lines.append(f"<g:country>{escape(item['shipping_country'])}</g:country>")
        lines.append(f"<g:price>{escape(item['shipping_price'])}</g:price>")
        lines.append("</g:shipping>")
        lines.append("</item>")
    lines.extend(["</channel>", "</rss>", ""])
    return "\n".join(lines)


def build_google_merchant_tsv(items: list[dict]) -> str:
    headers = [
        "id",
        "title",
        "description",
        "link",
        "image_link",
        "availability",
        "price",
        "brand",
        "condition",
        "mpn",
        "identifier_exists",
        "google_product_category",
        "shipping(country:price)",
        "shipping_weight",
    ]
    rows = ["\t".join(headers)]
    for item in items:
        ship = f"US:{item['shipping_price']}"
        rows.append(
            "\t".join(
                [
                    item["id"],
                    item["title"].replace("\t", " "),
                    item["description"].replace("\t", " ").replace("\n", " "),
                    item["link"],
                    item["image_link"],
                    item["availability"],
                    item["price"],
                    item["brand"],
                    item["condition"],
                    item["mpn"],
                    item["identifier_exists"],
                    item["google_product_category"],
                    ship,
                    item["shipping_weight"],
                ]
            )
        )
    return "\n".join(rows) + "\n"
