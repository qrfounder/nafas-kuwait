import json
import re
from copy import deepcopy
from urllib.parse import urlparse

from sqlalchemy.orm import Session

from app.config import settings
from app.data.products import PRODUCTS
from app.models.store import ProductOverride, Redirect, StoreSettings
from app.services.sku_catalog import list_skus_merged

MACRO_HELP = {
    "{{shop}}": "Store URL (e.g. https://naffas.shop)",
    "{{shop_url}}": "Same as {{shop}}",
    "{{product:slug}}": "Product page, e.g. {{product:cycle-relief}}",
}


def _is_local_url(url: str) -> bool:
    host = (url or "").lower()
    return "localhost" in host or "127.0.0.1" in host or "0.0.0.0" in host


def public_shop_url(stored: str | None = None) -> str:
    public = (settings.shop_public_url or "https://naffas.shop").rstrip("/")
    stored = (stored or "").rstrip("/")
    if not stored or _is_local_url(stored):
        return public
    return stored


def get_settings(db: Session) -> StoreSettings:
    row = db.query(StoreSettings).filter(StoreSettings.id == 1).first()
    if not row:
        row = StoreSettings(
            id=1,
            shop_url=public_shop_url(),
            meta_pixel_id=settings.meta_pixel_id or None,
            tiktok_pixel_id=settings.tiktok_pixel_id or None,
            snap_pixel_id=settings.snap_pixel_id or None,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return row
    if _is_local_url(row.shop_url):
        row.shop_url = public_shop_url()
        db.commit()
        db.refresh(row)
    return row


def expand_macros(target: str, shop_url: str) -> str:
    base = public_shop_url(shop_url)
    out = target.strip()
    out = out.replace("{{shop_url}}", base)
    out = out.replace("{{shop}}", base)

    def repl(m: re.Match[str]) -> str:
        slug = m.group(1)
        return f"{base}/product/{slug}"

    out = re.sub(r"\{\{product:([\w-]+)\}\}", repl, out)
    if out.startswith("/"):
        return f"{base}{out}"
    if out.startswith("http") and _is_local_url(out):
        parsed = urlparse(out)
        path = parsed.path or "/"
        if parsed.query:
            path = f"{path}?{parsed.query}"
        return f"{base}{path}"
    return out


def _has_arabic(text: str | None) -> bool:
    if not text:
        return False
    return any("\u0600" <= ch <= "\u06FF" for ch in text)


def merge_product(base: dict, override: ProductOverride | None) -> dict:
    p = deepcopy(base)
    if not override:
        return p
    # Ignore Arabic legacy overrides after US English cutover
    if override.title_ar and not _has_arabic(override.title_ar):
        p["title_ar"] = override.title_ar
    if override.subtitle_ar and not _has_arabic(override.subtitle_ar):
        p["subtitle_ar"] = override.subtitle_ar
    if override.base_price is not None:
        p["base_price"] = override.base_price
    if override.anchor_single is not None:
        p["anchor_single"] = override.anchor_single
    if override.tiers_json:
        try:
            tiers = json.loads(override.tiers_json)
            if isinstance(tiers, list) and tiers and not _has_arabic(str(tiers[0].get("label_ar", ""))):
                p["tiers"] = tiers
            elif isinstance(tiers, list) and tiers:
                # Keep English labels from base; apply prices from override
                merged = deepcopy(p.get("tiers") or [])
                for i, t in enumerate(tiers):
                    if i < len(merged):
                        if "price" in t:
                            merged[i]["price"] = t["price"]
                        if "anchor" in t:
                            merged[i]["anchor"] = t["anchor"]
                p["tiers"] = merged
        except json.JSONDecodeError:
            pass
    p["active"] = override.active if override else True
    return p


def list_products_merged(db: Session, *, include_ad_landing: bool = False) -> list[dict]:
    overrides = {o.slug: o for o in db.query(ProductOverride).all()}
    out: list[dict] = []
    for slug, base in PRODUCTS.items():
        if slug == "test" and not include_ad_landing:
            continue
        o = overrides.get(slug)
        if o and not o.active:
            continue
        out.append(merge_product(base, o))
    return out


def get_product_merged(db: Session, slug: str) -> dict | None:
    if slug not in PRODUCTS:
        return None
    override = db.query(ProductOverride).filter(ProductOverride.slug == slug).first()
    if override and not override.active:
        return None
    return merge_product(PRODUCTS[slug], override)


def list_redirects_resolved(db: Session) -> list[dict]:
    cfg = get_settings(db)
    rows = db.query(Redirect).filter(Redirect.enabled.is_(True)).order_by(Redirect.from_path).all()
    return [
        {
            "id": str(r.id),
            "from_path": r.from_path,
            "to_path": expand_macros(r.to_path, cfg.shop_url),
            "to_path_raw": r.to_path,
            "status_code": r.status_code,
            "note": r.note,
        }
        for r in rows
    ]


def bootstrap_payload(db: Session) -> dict:
    cfg = get_settings(db)
    return {
        "shop_url": cfg.shop_url.rstrip("/"),
        "pixels": {
            "meta": cfg.meta_pixel_id or "",
            "tiktok": cfg.tiktok_pixel_id or "",
            "snap": cfg.snap_pixel_id or "",
        },
        "redirects": list_redirects_resolved(db),
        "products": list_products_merged(db, include_ad_landing=False),
        "skus": list_skus_merged(db, cfg.shop_url.rstrip("/")),
        "macro_help": MACRO_HELP,
    }
