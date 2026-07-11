# Nafas — US DTC Store

At-home comfort kits for women. English USA storefront, Stripe checkout, US 3PL shipping. Shopping-ready for Google / Microsoft Merchant Center → **naffas.shop**.

## Structure

| Path | Description |
|------|-------------|
| `frontend/` | Vite + React + TypeScript (en-US LTR) |
| `backend/` | FastAPI + PostgreSQL |
| `sheets/` | Google Apps Script + CSV template for orders |
| `docs/MERCHANT_CENTER_LINKING.md` | GMC / Bing linking checklist |

## Quick start (local)

```bash
# Backend
cd backend
cp .env.example .env
# Set STRIPE_SECRET_KEY=sk_test_... and STRIPE_WEBHOOK_SECRET=whsec_...
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

Stripe CLI (test webhooks):

```bash
stripe listen --forward-to localhost:8000/api/stripe/webhook
```

## Merchant feeds

- API: `GET /api/feeds/google-merchant.xml`
- Static: `frontend/public/feeds/google-merchant.xml`
- Sitemap: `/sitemap.xml` · Robots: `/robots.txt`

See [docs/MERCHANT_CENTER_LINKING.md](docs/MERCHANT_CENTER_LINKING.md).

## Mojourney admin (`/mojourney`)

Internal dashboard: orders, product URLs, UTM builder, pixel checklist.

**Sign-in (default):** username `admin`, password from `MOJOURNEY_ADMIN_PASSWORD` (change before production).

## Docker (Easypanel)

```bash
docker compose up --build
```

- **API:** port 8000 — set `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Web:** port 8080 — set `VITE_API_URL` at build time
