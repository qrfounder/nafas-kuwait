import { useCart } from '../context/CartContext'
import { BundleContents } from './BundleContents'
import { AD_LANDING_SLUG } from '../data/adLanding'
import { CROSS_SELLS, singlesInBundle, SKU_LABELS } from '../data/products'
import { skuImage } from '../data/images'
import { OptimizedImage } from './OptimizedImage'
import { formatKwd } from '../lib/currency'
import { preserveScrollPosition } from '../lib/scroll'
import { trackInitiateCheckout } from '../lib/analytics'
import { trackStoreEvent } from '../lib/visitorAnalytics'
import { useEffect, useRef } from 'react'

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    setCheckoutOpen,
    product,
    tier,
    singleSku,
    singleQty,
    purchaseMode,
    lines,
    subtotal,
    crossSells,
    toggleCrossSell,
  } = useCart()

  const cartTracked = useRef(false)
  useEffect(() => {
    if (!cartOpen) {
      cartTracked.current = false
      return
    }
    if (cartTracked.current) return
    cartTracked.current = true
    trackStoreEvent('cart_view', {
      path: window.location.pathname,
      product_slug: product?.slug,
    })
  }, [cartOpen, product?.slug])

  if (!cartOpen) return null

  const adLanding = product?.slug === AD_LANDING_SLUG

  const bundleExtras =
    product && purchaseMode === 'bundle'
      ? CROSS_SELLS.filter((c) => !product.includes.includes(c.sku))
      : []

  const singleExtras =
    product && purchaseMode === 'single' && singleSku
      ? singlesInBundle(product).filter((s) => s.sku !== singleSku)
      : []

  return (
    <>
      <div className="fixed inset-0 bg-ink/40 z-50" onClick={() => setCartOpen(false)} aria-hidden />
      <aside className="fixed top-0 left-0 h-full w-full max-w-md bg-cream z-50 shadow-2xl flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-display text-xl font-bold">سلتج</h2>
          <button type="button" onClick={() => setCartOpen(false)} className="text-2xl leading-none">
            ×
          </button>
        </div>
        <p className="px-4 py-2 text-sm bg-cream border-b border-surface-border text-surface-muted">
          تقدرين تكملين الطلب الآن أو ترجعين لاحقاً. ادفعي عند الباب بعد ما تشوفين الطرد.
        </p>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {lines.length === 0 ? (
            <p className="text-center text-ink/60 py-8">السلة فاضية، اختاري باقتج من المنتج</p>
          ) : (
            <>
              {product && purchaseMode === 'bundle' && tier && (
                <BundleContents
                  includes={product.includes}
                  boxCount={tier.tier}
                  layout="buy-panel"
                  textOnly={adLanding}
                />
              )}
              {product && purchaseMode === 'single' && singleSku && (
                <>
                  <BundleContents includes={[singleSku]} boxCount={1} layout="buy-panel" textOnly={adLanding} />
                  {singleQty > 1 && (
                    <p className="text-xs text-rose-brand/90 font-medium text-center -mt-2 mb-1">
                      الكمية في الطلب: {singleQty === 2 ? '٢' : '٣'} قطع من نفس المنتج
                    </p>
                  )}
                </>
              )}
              {lines.map((l) => (
                <div key={l.sku + l.line_type} className="flex justify-between gap-2 border-b pb-3">
                  <span className="text-sm font-medium">{l.title_ar}</span>
                  <span className="font-bold text-rose-brand">{formatKwd(l.price_usd)}</span>
                </div>
              ))}
            </>
          )}
          {bundleExtras.length > 0 && (
            <div className="pt-4">
              <p className="font-semibold mb-3 text-sm">أضيفي مع طلبج (اختياري):</p>
              <div className="space-y-2">
                {bundleExtras.map((c) => {
                  const on = !!crossSells[c.sku]
                  return (
                    <button
                      key={c.sku}
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      className={`flex w-full items-center gap-3 p-3 rounded-xl border text-right transition ${
                        on
                          ? 'border-rose-brand bg-rose-light/30'
                          : 'border-rose-brand/20 hover:bg-white'
                      }`}
                      onClick={() => preserveScrollPosition(() => toggleCrossSell(c.sku))}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                          on ? 'border-rose-brand bg-rose-brand text-white' : 'border-surface-border bg-white'
                        }`}
                        aria-hidden
                      >
                        {on ? '✓' : ''}
                      </span>
                      {!adLanding && (
                        <OptimizedImage
                          src={skuImage(c.sku)}
                          alt={SKU_LABELS[c.sku] ?? c.title_ar}
                          className="w-12 h-12 object-contain shrink-0 rounded-lg border border-surface-border bg-cream p-0.5"
                          sizes="48px"
                        />
                      )}
                      <span className="flex-1 text-sm">{c.title_ar}</span>
                      <span className="text-rose-brand font-bold">+{formatKwd(c.price)}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          {singleExtras.length > 0 && (
            <div className="pt-4">
              <p className="font-semibold mb-3 text-sm">تكميل اختياري (قطعة إضافية):</p>
              <div className="space-y-2">
                {singleExtras.map((c) => {
                  const on = !!crossSells[c.sku]
                  return (
                    <button
                      key={c.sku}
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      className={`flex w-full items-center gap-3 p-3 rounded-xl border text-right transition ${
                        on
                          ? 'border-rose-brand bg-rose-light/30'
                          : 'border-rose-brand/20 hover:bg-white'
                      }`}
                      onClick={() => preserveScrollPosition(() => toggleCrossSell(c.sku))}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                          on ? 'border-rose-brand bg-rose-brand text-white' : 'border-surface-border bg-white'
                        }`}
                        aria-hidden
                      >
                        {on ? '✓' : ''}
                      </span>
                      {!adLanding && (
                        <OptimizedImage
                          src={skuImage(c.sku)}
                          alt={SKU_LABELS[c.sku] ?? c.title_ar}
                          className="w-12 h-12 object-contain shrink-0 rounded-lg border border-surface-border bg-cream p-0.5"
                          sizes="48px"
                        />
                      )}
                      <span className="flex-1 text-sm">{c.title_ar}</span>
                      <span className="text-rose-brand font-bold">+{formatKwd(c.price)}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-white space-y-3">
          <div className="flex justify-between text-lg font-bold">
            <span>المجموع</span>
            <span className="text-rose-brand">{formatKwd(subtotal)}</span>
          </div>
          <button
            type="button"
            disabled={lines.length === 0}
            className="btn-primary w-full disabled:opacity-50"
            onClick={() => {
              trackInitiateCheckout(subtotal)
              setCartOpen(false)
              setCheckoutOpen(true)
            }}
          >
            إتمام الطلب، ادفعي عند الباب
          </button>
        </div>
      </aside>
    </>
  )
}
