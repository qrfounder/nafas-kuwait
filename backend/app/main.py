import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    admin,
    admin_live,
    admin_store,
    analytics,
    contact,
    feeds,
    orders,
    products,
    store,
    stripe_webhook,
)
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from alembic import command
        from alembic.config import Config

        alembic_cfg = Config("alembic.ini")
        command.upgrade(alembic_cfg, "head")
        logger.info("Alembic migrations applied")
    except Exception as e:
        logger.warning("Migration on startup skipped or failed: %s", e)
    yield


app = FastAPI(title="Nafas API", version="1.0.0", lifespan=lifespan)

def _cors_origins() -> list[str]:
    base = settings.frontend_origin.rstrip("/")
    out = {
        base,
        "http://localhost:5173",
        "http://localhost:8080",
        "https://naffas.shop",
        "https://www.naffas.shop",
        "https://nafas.shop",
        "https://www.nafas.shop",
    }
    if base.startswith("https://") and "://www." not in base:
        out.add(base.replace("https://", "https://www.", 1))
    return sorted(out)


origins = _cors_origins()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(store.router)
app.include_router(orders.router)
app.include_router(stripe_webhook.router)
app.include_router(feeds.router)
app.include_router(contact.router)
app.include_router(admin.router)
app.include_router(admin_store.router)
app.include_router(analytics.router)
app.include_router(analytics.admin_router)
app.include_router(admin_live.router)
app.include_router(admin_live.admin_router)


@app.get("/health")
def health():
    return {"status": "ok", "brand": "nafas"}
