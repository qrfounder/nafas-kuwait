import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AD_LANDING_COPY, AD_LANDING_SLUG } from '../data/adLanding'
import { SKU_HINTS, SKU_LABELS, type Tier } from '../data/products'
import { useStore } from '../context/StoreContext'
import { useCart } from '../context/CartContext'
import { Price } from '../components/Price'
import { PaymentMethods } from '../components/PaymentMethods'
import { formatKwd } from '../lib/currency'
import { trackAddToCart, trackViewContent } from '../lib/analytics'
import { preserveScrollPosition, scrollToSection } from '../lib/scroll'

/**
 * Policy-safe landing for TikTok / Snapchat ad review.
 * No product images, before-after, pain claims, or medical promises.
 */
export function AdSafeProductPage() {
  const { getProduct } = useStore()
  const product = getProduct(AD_LANDING_SLUG)
  const { setBundle, setCartOpen } = useCart()
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)

  useEffect(() => {
    if (product) {
      setSelectedTier(product.tiers[0])
      trackViewContent(product.slug, product.base_price)
    }
  }, [product])

  if (!product || !selectedTier) {
    return (
      <p className="text-center py-20 text-surface-muted" dir="rtl">
        الصفحة غير متاحة
      </p>
    )
  }

  const addBundle = () => {
    setBundle(product, selectedTier)
    trackAddToCart(selectedTier.price, product.slug)
    setCartOpen(true)
  }

  const scrollToOffer = () => {
    scrollToSection('purchase-offer', { behavior: 'smooth', onlyIfNeeded: true })
  }

  return (
    <div className="pb-24" dir="rtl">
      <div className="container-narrow py-6 max-w-2xl mx-auto">
        <p className="text-[11px] text-surface-muted text-center mb-2">{AD_LANDING_COPY.company_ar}</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink text-center leading-snug">
          {AD_LANDING_COPY.title_ar}
        </h1>
        <p className="mt-3 text-sm text-surface-muted text-center leading-relaxed">{AD_LANDING_COPY.subtitle_ar}</p>

        <section className="mt-6 rounded-xl border border-surface-border bg-white p-4">
          <h2 className="text-sm font-bold text-ink mb-3">محتويات البوكس (وصف نصي)</h2>
          <ul className="space-y-3 text-sm text-ink/90">
            {product.includes.map((sku) => (
              <li key={sku} className="flex gap-2 leading-relaxed">
                <span className="text-rose-brand shrink-0" aria-hidden>
                  •
                </span>
                <span>
                  <strong>{SKU_LABELS[sku]}</strong>
                  {SKU_HINTS[sku] && (
                    <span className="block text-xs text-surface-muted mt-0.5">{SKU_HINTS[sku]}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 rounded-xl border border-surface-border bg-cream/80 p-4 text-xs text-surface-muted leading-relaxed space-y-2">
          <p>
            <strong className="text-ink">إخلاء مسؤولية:</strong> {AD_LANDING_COPY.disclaimer_ar}
          </p>
          <p>{AD_LANDING_COPY.shipping_ar}</p>
          <p>{AD_LANDING_COPY.confirm_ar}</p>
        </div>

        <div
          id="purchase-offer"
          className="mt-8 scroll-mt-24 rounded-2xl border-2 border-rose-brand/25 bg-white p-4 sm:p-5 shadow-sm"
        >
          <h2 className="text-sm font-bold text-ink text-center mb-1">اختاري الكمية</h2>
          <p className="text-[11px] text-center text-surface-muted mb-4">الأسعار بالدينار الكويتي — الدفع عند الاستلام</p>

          <div className="space-y-2" role="radiogroup" aria-label="كمية البوكس">
            {product.tiers.map((t) => (
              <button
                key={t.tier}
                type="button"
                role="radio"
                aria-checked={selectedTier.tier === t.tier}
                className={`block w-full text-right p-4 rounded-lg border cursor-pointer transition ${
                  selectedTier.tier === t.tier
                    ? 'border-rose-brand bg-rose-light/30'
                    : 'border-surface-border hover:border-rose-brand/30'
                }`}
                onClick={() => preserveScrollPosition(() => setSelectedTier(t))}
              >
                <div className="flex justify-between items-center gap-3">
                  <span className="font-medium text-sm text-ink">{t.label_ar}</span>
                  <Price usd={t.price} anchorUsd={t.anchor} size="md" />
                </div>
              </button>
            ))}
          </div>

          <button type="button" onClick={addBundle} className="btn-primary w-full mt-4">
            اطلبي الآن — {formatKwd(selectedTier.price)}
          </button>
        </div>

        <div className="mt-6">
          <PaymentMethods variant="compact" showCaption />
        </div>

        <nav className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-surface-muted">
          <Link to="/policies" className="hover:text-rose-brand underline">
            سياسات المتجر
          </Link>
          <Link to="/contact" className="hover:text-rose-brand underline">
            تواصل معنا
          </Link>
          <Link to="/about" className="hover:text-rose-brand underline">
            من نحن
          </Link>
        </nav>

      </div>

      <div className="fixed bottom-0 inset-x-0 md:hidden bg-white border-t border-surface-border p-3 flex justify-between items-center z-30">
        <div>
          <span className="font-bold text-rose-brand block">{formatKwd(selectedTier.price)}</span>
          <span className="text-[10px] text-surface-muted">ادفعي عند الباب</span>
        </div>
        <button type="button" onClick={scrollToOffer} className="btn-primary text-sm py-2.5 px-5">
          اطلبي الآن
        </button>
      </div>
    </div>
  )
}
