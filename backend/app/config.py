from pydantic_settings import BaseSettings, SettingsConfigDict


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
    # Mojourney: optional legacy API header (scripts); browser uses login + session.
    admin_api_key: str = ""
    mojourney_admin_user: str = "admin"
    # Required for password login. Never ship a default password.
    mojourney_admin_password: str = ""


settings = Settings()
