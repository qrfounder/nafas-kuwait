from urllib.parse import quote, unquote
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _encode_db_password(url: str) -> str:
    """Quote the password so characters like * do not break SQLAlchemy or Alembic."""
    if "://" not in url or "@" not in url:
        return url
    scheme, rest = url.split("://", 1)
    creds, host = rest.rsplit("@", 1)
    if ":" not in creds:
        return url
    user, password = creds.split(":", 1)
    password = quote(unquote(password), safe="")
    return f"{scheme}://{user}:{password}@{host}"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://nafas:nafas@localhost:5432/nafas"
    google_sheets_webhook_url: str = ""
    meta_pixel_id: str = ""
    meta_capi_access_token: str = ""
    tiktok_pixel_id: str = ""
    tiktok_access_token: str = ""
    snap_pixel_id: str = ""
    snap_capi_token: str = ""
    frontend_origin: str = "http://localhost:5173"
    api_public_url: str = "http://localhost:8000"
    shop_public_url: str = "https://naffas.shop"
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    us_shipping_usd: float = 5.99
    free_shipping_threshold_usd: float = 100.0
    admin_api_key: str = ""
    mojourney_admin_user: str = "admin"
    mojourney_admin_password: str = ""

    @field_validator("database_url")
    @classmethod
    def encode_database_url(cls, v: str) -> str:
        return _encode_db_password(v.strip())


settings = Settings()
