from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.store_catalog import bootstrap_payload

router = APIRouter(prefix="/api/store", tags=["store"])


@router.get("/bootstrap")
def store_bootstrap(db: Session = Depends(get_db)):
    """Public: pixels, redirects, merged catalog for the storefront."""
    return bootstrap_payload(db)
