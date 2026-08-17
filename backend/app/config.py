from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine.url import URL, make_url


def build_database_url(
    *,
    database_url: str = "",
    postgres_host: str = "",
    postgres_port: int = 5432,
    postgres_user: str = "",
    postgres_password: str = "",
    postgres_db: str = "",
) -> str:
    """Build a SQLAlchemy URL. Discrete POSTGRES_* vars beat a stale DATABASE_URL."""
    if postgres_user and postgres_password and postgres_db:
        url = URL.create(
            drivername="postgresql",
            username=postgres_user,
            password=postgres_password,
            host=postgres_host or "db",
            port=postgres_port or 5432,
            database=postgres_db,
            query={"sslmode": "disable"},
        )
        return url.render_as_string(hide_password=False)

    raw = (database_url or "").strip()
    if not raw:
        return ""

    url = make_url(raw)
    query = dict(url.query)
    query.setdefault("sslmode", "disable")
    return url.set(query=query).render_as_string(hide_password=False)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        env_ignore_empty=True,
    )

    database_url: str = ""
    postgres_host: str = ""
    postgres_port: int = 5432
    postgres_user: str = ""
    postgres_password: str = ""
    postgres_db: str = ""
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

    @model_validator(mode="after")
    def assemble_database_url(self) -> "Settings":
        self.database_url = build_database_url(
            database_url=self.database_url,
            postgres_host=self.postgres_host,
            postgres_port=self.postgres_port,
            postgres_user=self.postgres_user,
            postgres_password=self.postgres_password,
            postgres_db=self.postgres_db,
        )
        return self


settings = Settings()
