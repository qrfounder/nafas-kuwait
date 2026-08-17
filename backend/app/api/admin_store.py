import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.data.products import ADMIN_VISIBLE_SKUS, PRODUCTS
from app.database import get_db
from app.models.store import ProductOverride, Redirect
from app.schemas.store import (
    AdminProductOut,
    AdminSkuOut,
    PixelSettingsIn,
    PixelSettingsOut,
    ProductOverrideIn,
    RedirectIn,
    RedirectOut,
    SkuInventoryIn,
)
from app.services.sku_catalog import list_skus_merged, sku_image_url
from app.services.store_catalog import expand_macros, get_settings, list_products_merged, merge_product, public_shop_url
from app.models.sku_inventory import SkuInventory

from app.api.admin import _require_admin_key

router = APIRouter(prefix="/api/admin", tags=["admin-store"])


def _normalize_path(path: str) -> str:
    p = path.strip()
    if not p.startswith("/"):
        p = f"/{p}"
    if len(p) > 1 and p.endswith("/"):
        p = p.rstrip("/")
    return p


@router.get("/settings/pixels", response_model=PixelSettingsOut)
def get_pixels(_: None = Depends(_require_admin_key), db: Session = Depends(get_db)):
    cfg = get_settings(db)
    return PixelSettingsOut(
        shop_url=cfg.shop_url,
        meta_pixel_id=cfg.meta_pixel_id or "",
        tiktok_pixel_id=cfg.tiktok_pixel_id or "",
        snap_pixel_id=cfg.snap_pixel_id or "",
        updated_at=cfg.updated_at.isoformat() if cfg.updated_at else None,
    )


@router.put("/settings/pixels", response_model=PixelSettingsOut)
def put_pixels(
    body: PixelSettingsIn,
    _: None = Depends(_require_admin_key),
    db: Session = Depends(get_db),
):
    cfg = get_settings(db)
    cfg.shop_url = public_shop_url(body.shop_url)
    cfg.meta_pixel_id = body.meta_pixel_id.strip() or None
    cfg.tiktok_pixel_id = body.tiktok_pixel_id.strip() or None
    cfg.snap_pixel_id = body.snap_pixel_id.strip() or None
    db.commit()
    db.refresh(cfg)
    return PixelSettingsOut(
        shop_url=cfg.shop_url,
        meta_pixel_id=cfg.meta_pixel_id or "",
        tiktok_pixel_id=cfg.tiktok_pixel_id or "",
        snap_pixel_id=cfg.snap_pixel_id or "",
        updated_at=cfg.updated_at.isoformat() if cfg.updated_at else None,
    )


@router.get("/redirects", response_model=list[RedirectOut])
def list_redirects_admin(_: None = Depends(_require_admin_key), db: Session = Depends(get_db)):
    cfg = get_settings(db)
    rows = db.query(Redirect).order_by(Redirect.from_path).all()
    return [
        RedirectOut(
            id=str(r.id),
            from_path=r.from_path,
            to_path=r.to_path,
            to_path_resolved=expand_macros(r.to_path, cfg.shop_url),
            status_code=r.status_code,
            enabled=r.enabled,
            note=r.note,
        )
        for r in rows
    ]


@router.post("/redirects", response_model=RedirectOut)
def create_redirect(
    body: RedirectIn,
    _: None = Depends(_require_admin_key),
    db: Session = Depends(get_db),
):
    from_path = _normalize_path(body.from_path)
    existing = db.query(Redirect).filter(Redirect.from_path == from_path).first()
    if existing:
        raise HTTPException(400, "يوجد تحويل لهذا المسار مسبقاً")
    row = Redirect(
        from_path=from_path,
        to_path=body.to_path.strip(),
        status_code=body.status_code,
        enabled=body.enabled,
        note=body.note,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    cfg = get_settings(db)
    return RedirectOut(
        id=str(row.id),
        from_path=row.from_path,
        to_path=row.to_path,
        to_path_resolved=expand_macros(row.to_path, cfg.shop_url),
        status_code=row.status_code,
        enabled=row.enabled,
        note=row.note,
    )


@router.put("/redirects/{redirect_id}", response_model=RedirectOut)
def update_redirect(
    redirect_id: str,
    body: RedirectIn,
    _: None = Depends(_require_admin_key),
    db: Session = Depends(get_db),
):
    try:
        rid = uuid.UUID(redirect_id)
    except ValueError as e:
        raise HTTPException(400, "معرّف غير صالح") from e
    row = db.query(Redirect).filter(Redirect.id == rid).first()
    if not row:
        raise HTTPException(404, "التحويل غير موجود")
    from_path = _normalize_path(body.from_path)
    if from_path != row.from_path:
        clash = db.query(Redirect).filter(Redirect.from_path == from_path).first()
        if clash:
            raise HTTPException(400, "يوجد تحويل لهذا المسار مسبقاً")
    row.from_path = from_path
    row.to_path = body.to_path.strip()
    row.status_code = body.status_code
    row.enabled = body.enabled
    row.note = body.note
    db.commit()
    db.refresh(row)
    cfg = get_settings(db)
    return RedirectOut(
        id=str(row.id),
        from_path=row.from_path,
        to_path=row.to_path,
        to_path_resolved=expand_macros(row.to_path, cfg.shop_url),
        status_code=row.status_code,
        enabled=row.enabled,
        note=row.note,
    )


@router.delete("/redirects/{redirect_id}")
def delete_redirect(
    redirect_id: str,
    _: None = Depends(_require_admin_key),
    db: Session = Depends(get_db),
):
    try:
        rid = uuid.UUID(redirect_id)
    except ValueError as e:
        raise HTTPException(400, "معرّف غير صالح") from e
    row = db.query(Redirect).filter(Redirect.id == rid).first()
    if not row:
        raise HTTPException(404, "التحويل غير موجود")
    db.delete(row)
    db.commit()
    return {"ok": True}


@router.get("/products", response_model=list[AdminProductOut])
def admin_products(_: None = Depends(_require_admin_key), db: Session = Depends(get_db)):
    cfg = get_settings(db)
    base_url = public_shop_url(cfg.shop_url)
    return [
        AdminProductOut(
            slug="HIMRJP10",
            title_ar="خلطة أجدادنا",
            subtitle_ar="كريم المفاصل والعظام. ادفع عند الاستلام داخل المملكة.",
            base_price=179,
            anchor_single=340,
            active=True,
            tiers=[
                {"tier": 1, "label_ar": "علبة واحدة", "price": 179, "anchor": 179, "badge": None},
                {"tier": 2, "label_ar": "٣ علب", "price": 280, "anchor": 280, "badge": "الأكثر مبيعاً"},
                {"tier": 3, "label_ar": "٥ علب", "price": 340, "anchor": 340, "badge": "الأوفر"},
            ],
            product_url=f"{base_url}/product/official",
            has_override=False,
            post_upsell=None,
            includes=["HIMRJP10"],
        )
    ]


@router.get("/skus", response_model=list[AdminSkuOut])
def admin_skus(_: None = Depends(_require_admin_key), db: Session = Depends(get_db)):
    cfg = get_settings(db)
    rows = list_skus_merged(db, cfg.shop_url.rstrip("/"))
    return [AdminSkuOut(**r) for r in rows if r["sku"] in ADMIN_VISIBLE_SKUS]


@router.put("/skus/{sku}", response_model=AdminSkuOut)
def update_sku(
    sku: str,
    body: SkuInventoryIn,
    _: None = Depends(_require_admin_key),
    db: Session = Depends(get_db),
):
    from app.data.products import ADMIN_VISIBLE_SKUS, SKU_LABELS

    if sku not in ADMIN_VISIBLE_SKUS or sku not in SKU_LABELS:
        raise HTTPException(404, "SKU not in catalog")
    row = db.query(SkuInventory).filter(SkuInventory.sku == sku).first()
    if not row:
        from app.services.sku_catalog import ensure_sku_rows

        ensure_sku_rows(db)
        row = db.query(SkuInventory).filter(SkuInventory.sku == sku).first()
    row.label_ar = body.label_ar.strip()
    row.hint_ar = (body.hint_ar or "").strip() or None
    row.price = body.price
    row.anchor = body.anchor
    row.quantity = body.quantity
    row.active = body.active
    db.commit()
    db.refresh(row)
    cfg = get_settings(db)
    base = cfg.shop_url.rstrip("/")
    return AdminSkuOut(
        sku=sku,
        label_ar=row.label_ar,
        hint_ar=row.hint_ar or "",
        price=row.price,
        anchor=row.anchor,
        quantity=row.quantity,
        active=row.active,
        image_url=sku_image_url(base, sku),
        has_override=True,
    )


@router.put("/products/{slug}", response_model=AdminProductOut)
def update_product(
    slug: str,
    body: ProductOverrideIn,
    _: None = Depends(_require_admin_key),
    db: Session = Depends(get_db),
):
    if slug not in PRODUCTS:
        raise HTTPException(404, "منتج غير موجود في الكتالوج الأساسي")
    row = db.query(ProductOverride).filter(ProductOverride.slug == slug).first()
    if not row:
        row = ProductOverride(slug=slug)
        db.add(row)
    if body.title_ar is not None:
        row.title_ar = body.title_ar.strip() or None
    if body.subtitle_ar is not None:
        row.subtitle_ar = body.subtitle_ar.strip() or None
    row.base_price = body.base_price
    row.anchor_single = body.anchor_single
    row.active = body.active
    if body.tiers_json is not None:
        row.tiers_json = body.tiers_json.strip() or None
    db.commit()
    db.refresh(row)
    cfg = get_settings(db)
    merged = merge_product(PRODUCTS[slug], row)
    return AdminProductOut(
        slug=slug,
        title_ar=merged["title_ar"],
        subtitle_ar=merged["subtitle_ar"],
        base_price=merged["base_price"],
        anchor_single=merged["anchor_single"],
        active=merged.get("active", True),
        tiers=merged["tiers"],
        product_url=f"{cfg.shop_url.rstrip('/')}/product/{slug}",
        has_override=True,
        post_upsell=merged.get("post_upsell"),
        includes=merged.get("includes", []),
    )
