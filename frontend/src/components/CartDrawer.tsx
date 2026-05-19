import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { CROSS_SELLS } from '../data/products'
import { formatKwd } from '../lib/currency'
import { trackInitiateCheckout } from '../lib/analytics'

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    setCheckoutOpen,
    lines,
    subtotal,
    crossSells,
    toggleCrossSell,
  } = useCart()
  const [timer, setTimer] = useState(600)

  useEffect(() => {
    if (!cartOpen) return
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [cartOpen])

  if (!cartOpen) return null

  const mins = Math.floor(timer / 60)
  const secs = timer % 60

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
        <p className="px-4 py-2 text-sm bg-gold-accent/20 text-ink">
          ⏱ السلة محجوزة: {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </p>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {lines.length === 0 ? (
            <p className="text-center text-ink/60 py-8">السلة فاضية — اختاري باقتج من المنتج</p>
          ) : (
            lines.map((l) => (
              <div key={l.sku + l.line_type} className="flex justify-between gap-2 border-b pb-3">
                <span className="text-sm font-medium">{l.title_ar}</span>
                <span className="font-bold text-rose-brand">{formatKwd(l.price_usd)}</span>
              </div>
            ))
          )}
          {lines.length > 0 && (
            <div className="pt-4">
              <p className="font-semibold mb-3 text-sm">أضيفي مع طلبج (اختياري):</p>
              <div className="space-y-2">
                {CROSS_SELLS.map((c) => (
                  <label
                    key={c.sku}
                    className="flex items-center gap-3 p-3 rounded-xl border border-rose-brand/20 cursor-pointer hover:bg-white"
                  >
                    <input
                      type="checkbox"
                      checked={!!crossSells[c.sku]}
                      onChange={() => toggleCrossSell(c.sku)}
                      className="w-5 h-5 accent-rose-brand"
                    />
                    <span className="flex-1 text-sm">{c.title_ar}</span>
                    <span className="text-rose-brand font-bold">+{formatKwd(c.price)}</span>
                  </label>
                ))}
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
            إتمام الطلب — دفع عند الاستلام
          </button>
        </div>
      </aside>
    </>
  )
}
