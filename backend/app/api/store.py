from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.store_catalog import bootstrap_payload

router = APIRouter(prefix="/api/store", tags=["store"])


@router.get("/bootstrap")
def store_bootstrap(db: Session = Depends(get_db), lite: bool = Query(False)):
    """Public: pixels, redirects, merged catalog. lite=1 skips catalog for ad landings."""
    return bootstrap_payload(db, lite=lite)
