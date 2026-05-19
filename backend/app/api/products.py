from fastapi import APIRouter

from app.data.products import CROSS_SELLS, PRODUCTS, SKU_LABELS

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/products")
def list_products():
    return {"products": list(PRODUCTS.values()), "cross_sells": CROSS_SELLS, "sku_labels": SKU_LABELS}


@router.get("/products/{slug}")
def get_product(slug: str):
    if slug not in PRODUCTS:
        from fastapi import HTTPException

        raise HTTPException(404, "منتج غير موجود")
    return PRODUCTS[slug]
