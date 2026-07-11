import logging

from fastapi import APIRouter
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactIn(BaseModel):
    name: str
    phone: str | None = None
    email: str | None = None
    message: str


@router.post("")
async def contact(body: ContactIn):
    logger.info("Contact form: %s — %s", body.name, body.message[:80])
    return {"ok": True, "message": "Thanks — we received your message and will reply soon."}
