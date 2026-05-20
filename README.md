# Nafas (نفس) — Kuwait COD DTC Store

Khaleeji women's pain-relief bundles. COD-only checkout. TikTok/Snap ads → **nafas.shop**.

## Structure

| Path | Description |
|------|-------------|
| `frontend/` | Vite + React + TypeScript (RTL Arabic) |
| `backend/` | FastAPI + PostgreSQL (`nafas_kw`) |
| `sheets/` | Google Apps Script + CSV template for orders |

## Mojourney admin (`/mojourney`)

Internal dashboard: orders, product URLs, UTM builder, pixel checklist.

**Sign-in (default):** username `admin`, password `Huhu*201` — defined in `backend/app/config.py` and **overridable** with env `MOJOURNEY_ADMIN_USER` / `MOJOURNEY_ADMIN_PASSWORD`. Change the password before production.

After login, the API issues a **session token** (12h, in-memory on the server) sent as `X-Admin-Key`. Optional legacy: set **`ADMIN_API_KEY`** only (no password) to use a single long key in the UI instead.

`GET /api/admin/ping` — no auth. `POST /api/admin/login` — JSON `{ "username", "password" }`. `POST /api/admin/logout` — clears server session when you send the current `X-Admin-Key`.

## Quick start (local)

```bash
# Backend
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Docker (Easypanel)

```bash
docker compose up --build
```

- **API:** port 8000 — set `DATABASE_URL` to Hostinger Postgres `nafas_kw`
- **Web:** port 8080 — set `VITE_API_URL` at build time

## Deploy checklist (Easypanel)

1. Create Postgres database `nafas_kw`
2. Deploy `nafas-api` from `backend/Dockerfile` with backend `.env`
3. Deploy `nafas-web` from `frontend/Dockerfile` with build args / `VITE_*`
4. Deploy Google Apps Script from `sheets/apps-script.js` → set `GOOGLE_SHEETS_WEBHOOK_URL`
5. Point `nafas.shop` to frontend; API subdomain to backend
6. COD Network: import orders from Sheet (column `status`)

## Marketing ops (manual)

- COD Network Kuwait Gadget tariff: see `content/ops/codnetwork-pricing.md`
- Ad scripts: `content/ar/ad-scripts.md`
- Call-center upsell script: `content/ops/call-center-upsell.md`
- UGC brief: `content/ugc/UGC_BRIEF.md`
- Launch ads: `content/ops/LAUNCH_ADS.md`

## Phase 2

After 50+ delivered orders: evaluate profit/order; optional hijab store or premium kit — see plan summary.
