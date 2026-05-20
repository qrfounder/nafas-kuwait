from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://nafas:nafas@localhost:5432/nafas_kw"
    google_sheets_webhook_url: str = ""
    meta_pixel_id: str = ""
    meta_capi_access_token: str = ""
    tiktok_pixel_id: str = ""
    tiktok_access_token: str = ""
    snap_pixel_id: str = ""
    snap_capi_token: str = ""
    frontend_origin: str = "http://localhost:5173"
    api_public_url: str = "http://localhost:8000"
    # Mojourney: optional legacy API header (scripts); browser uses login + session.
    admin_api_key: str = ""
    mojourney_admin_user: str = "admin"
    # Override in production via MOJOURNEY_ADMIN_PASSWORD in .env
    mojourney_admin_password: str = "Huhu*201"


settings = Settings()
