# Merchant Center linking — naffas.shop (USA)

Checklist for Google Merchant Center and Microsoft Merchant Center after the GMC-compliance storefront pass.

## Blockers you must complete (outside code)

1. **Business identity** in `frontend/src/data/business.ts` must match Merchant Center → Business info
   (legal name, address, email/phone). Current registered address is Morocco; sell-to country is United States.
2. **Stripe live keys** + webhook `https://api.naffas.shop/api/stripe/webhook` (`checkout.session.completed`)
3. **Set `MOJOURNEY_ADMIN_PASSWORD`** (and optional `ADMIN_API_KEY`) in backend `.env` — there is no default password
4. **Deploy** English USA storefront + feed before claiming the URL
5. **Run** `alembic upgrade head` on the API host after pulling Stripe migrations
6. **Optional later:** verified-purchase reviews only (no fabricated testimonials)

## What was removed (policy rejection risks)

- Fabricated customer reviews, star aggregates, “illustrative” UGC
- Before/after transformation sections on product pages
- Fake scarcity / “kits left” theater
- Misleading strike-through “was” prices and “Save $18” without a real MSRP
- Google Pay mentioned without a badge (copy now matches Visa/MC/Amex/Apple Pay)
- Kuwait/COD storefront framing

## What was added (approval hygiene)

- Dedicated returns URL: `https://naffas.shop/returns`
- Contact shows support email + prompts for real address/phone
- Product + Organization JSON-LD (no AggregateRating)
- Honest USD prices matching feed
- Shipping story: $5.99 under $100 / free at $100+ (configure the free threshold in Merchant Center shipping settings to match)
- Soft comfort-only product copy (not medical cure claims)
- `google_product_category` `2330` (Massage & Relaxation)

## Product feed URLs

| Format | URL |
|--------|-----|
| XML | `https://api.naffas.shop/api/feeds/google-merchant.xml` |
| Static | `https://naffas.shop/feeds/google-merchant.xml` |
| TSV | `https://api.naffas.shop/api/feeds/google-merchant.txt` |

Sitemap: `https://naffas.shop/sitemap.xml` (includes `/returns`)  
Robots: `https://naffas.shop/robots.txt`

Regenerate static feed after catalog changes:

```bash
cd backend && python3 -c "
from app.data.products import PRODUCTS
from app.services.merchant_feed import catalog_items_from_products, build_google_merchant_xml
items = catalog_items_from_products(PRODUCTS, shop_base='https://naffas.shop', shipping_usd=5.99)
open('../frontend/public/feeds/google-merchant.xml','w').write(
  build_google_merchant_xml(items, shop_base='https://naffas.shop'))
print(len(items), 'items')
"
```

## Google Merchant Center steps

1. Verify + claim `naffas.shop`
2. Business info = same legal name / address / phone / email as the site
3. Primary feed (US / English) → XML URL above, daily fetch
4. Shipping settings: US flat **$5.99**, free over **$100** (must match site + policies)
5. Returns policy URL: `https://naffas.shop/returns`
6. Fix diagnostics until products are eligible
7. Link Google Ads for Shopping only after eligibility is green

## Microsoft Merchant Center

Use the same feed URL, same shipping/returns URLs, claim `https://naffas.shop`.

## Do not

- Add fake reviews or star ratings
- Redirect Shopping traffic from a clean PDP to a medical/before-after lander
- Show payment methods you do not accept
- Submit the store before `business.ts` has a real US address and phone
