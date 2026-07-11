from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.data.products import CROSS_SELLS, SKU_LABELS
from app.database import get_db
from app.services.store_catalog import get_product_merged, list_products_merged

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/products")
def list_products(db: Session = Depends(get_db)):
    return {
        "products": list_products_merged(db),
        "cross_sells": CROSS_SELLS,
        "sku_labels": SKU_LABELS,
    }


@router.get("/products/{slug}")
def get_product(slug: str, db: Session = Depends(get_db)):
    product = get_product_merged(db, slug)
    if not product:
        raise HTTPException(404, "Product not found")
    return product
