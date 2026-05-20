import { FormEvent, useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import type { CartLine } from '../context/CartContext'
import { createOrder } from '../lib/api'
import { formatKwd } from '../lib/currency'
import { getAttribution, getLastEventId, trackPurchase } from '../lib/analytics'
import { validateKuwaitPhone } from '../lib/phone'
import { CHECKOUT_EXTRAS, CHECKOUT_EXTRAS_ORDER, type CheckoutExtraKey } from '../data/checkoutExtras'
import { PaymentMethods } from './PaymentMethods'

type Props = {
  onSuccess: (
    orderNumber: string,
    postUpsell: { sku: string; title_ar: string; anchor: number; price: number } | null,
  ) => void
}

export function CheckoutModal({ onSuccess }: Props) {
  const {
    checkoutOpen,
    setCheckoutOpen,
    product,
    tier,
    singleSku,
    purchaseMode,
    lines,
    subtotal,
    offerTier,
    clearCart,
  } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutExtras, setCheckoutExtras] = useState<Record<CheckoutExtraKey, boolean>>({
    delivery_protection: false,
    priority_delivery: false,
  })

  useEffect(() => {
    if (checkoutOpen) {
      setCheckoutExtras({ delivery_protection: false, priority_delivery: false })
      setName('')
      setPhone('')
      setPhoneError('')
    }
  }, [checkoutOpen])

  const extraLines: CartLine[] = CHECKOUT_EXTRAS_ORDER.filter((k) => checkoutExtras[k]).map((k) => {
    const x = CHECKOUT_EXTRAS[k]
    return {
      sku: x.sku,
      title_ar: x.title_ar,
      qty: 1,
      price_usd: x.price_usd,
      line_type: 'checkout_extra',
    }
  })

  const extrasTotal = extraLines.reduce((s, l) => s + l.price_usd, 0)
  const orderTotal = subtotal + extrasTotal
  const submitLines = [...lines, ...extraLines]

  const ready =
    checkoutOpen &&
    product &&
    lines.length > 0 &&
    ((purchaseMode === 'bundle' && tier) || (purchaseMode === 'single' && singleSku))

  if (!ready) return null

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validateKuwaitPhone(phone)
    if (!v.ok) {
      setPhoneError(v.error)
      return
    }
    setPhoneError('')
    setLoading(true)
    const eventId = getLastEventId()
    const attr = getAttribution()
    try {
      const res = await createOrder({
        customer_name: name.trim(),
        customer_phone: phone,
        product_slug: product.slug,
        offer_tier: offerTier,
        lines: submitLines,
        subtotal_usd: subtotal,
        total_usd: orderTotal,
        event_id: eventId,
        ...attr,
      })
      trackPurchase(orderTotal, eventId)
      setCheckoutOpen(false)
      onSuccess(res.order_number, res.post_upsell || product.post_upsell)
      clearCart()
    } catch (err) {
      setPhoneError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border border-surface-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-brand/25 focus:border-rose-brand/40 bg-white'

  return (
    <>
      <div className="fixed inset-0 bg-ink/50 z-[60]" onClick={() => setCheckoutOpen(false)} aria-hidden />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-surface-border bg-white shadow-2xl"
          role="dialog"
          aria-labelledby="checkout-title"
          aria-describedby="checkout-desc"
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-surface-border bg-cream/95 px-5 py-4 backdrop-blur-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-trust-green">ادفعي عند الباب</p>
              <h2 id="checkout-title" className="font-display text-xl font-bold text-ink mt-0.5">
                إتمام الطلب
              </h2>
              <p id="checkout-desc" className="text-xs text-surface-muted mt-1 leading-relaxed max-w-[20rem]">
                عنوان التوصيل يُؤخذ بالمكالمة من خدمة العملاء، مو بالنموذج.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCheckoutOpen(false)}
              className="shrink-0 rounded-lg p-2 text-surface-muted hover:bg-white hover:text-ink"
              aria-label="إغلاق"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          <div className="px-5 pt-5 space-y-5">
            {/* Order lines */}
            <section className="rounded-xl border border-surface-border bg-cream/60 p-4">
              <p className="text-[11px] font-semibold text-surface-muted mb-2">ملخص الطلب</p>
              <ul className="space-y-2 text-sm">
                {lines.map((l) => (
                  <li key={l.sku + l.line_type} className="flex justify-between gap-3 text-ink/90">
                    <span className="min-w-0 leading-snug">{l.title_ar}</span>
                    <span className="shrink-0 font-semibold text-rose-brand tabular-nums">
                      {formatKwd(l.price_usd)}
                    </span>
                  </li>
                ))}
                {extraLines.map((l) => (
                  <li
                    key={l.sku}
                    className="flex justify-between gap-3 border-t border-dashed border-surface-border pt-2 text-xs"
                  >
                    <span className="text-trust-green font-medium leading-snug">{l.title_ar}</span>
                    <span className="shrink-0 font-semibold text-rose-brand tabular-nums">
                      +{formatKwd(l.price_usd)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-baseline justify-between border-t border-surface-border pt-3">
                <span className="text-sm font-semibold text-ink">المجموع</span>
                <span className="text-lg font-bold text-rose-brand tabular-nums">{formatKwd(orderTotal)}</span>
              </div>
              {extrasTotal > 0 && (
                <p className="text-[10px] text-surface-muted mt-1.5">شامل الإضافات الاختيارية</p>
              )}
            </section>

            {/* Optional bumps */}
            <section>
              <p className="text-sm font-semibold text-ink mb-1">إضافات اختيارية</p>
              <p className="text-[11px] text-surface-muted leading-relaxed mb-3">
                أوضح وبدون مبالغة: الاستبدال عند العيب من سياسة المتجر للجميع. الإضافات تحسّن السرعة أو الأولوية فقط.
              </p>
              <div className="space-y-2">
                {CHECKOUT_EXTRAS_ORDER.map((key) => {
                  const x = CHECKOUT_EXTRAS[key]
                  const checked = checkoutExtras[key]
                  return (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                        checked
                          ? 'border-rose-brand/45 bg-rose-light/30 ring-1 ring-rose-brand/10'
                          : 'border-surface-border hover:border-rose-brand/25 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setCheckoutExtras((prev) => ({ ...prev, [key]: !prev[key] }))}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-rose-brand"
                      />
                      <span className="min-w-0 flex-1 text-right">
                        <span className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
                          <span className="text-sm font-semibold text-ink">{x.title_ar}</span>
                          {x.recommended && (
                            <span className="rounded-full bg-gold-accent/25 px-2 py-0.5 text-[10px] font-bold text-ink/90">
                              مناسب للاستعجال
                            </span>
                          )}
                          <span className="text-sm font-bold text-rose-brand tabular-nums">
                            +{formatKwd(x.price_usd)}
                          </span>
                        </span>
                        <span className="mt-1.5 block text-[11px] leading-relaxed text-surface-muted">
                          {x.desc_ar}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </section>

            {/* Call center + phone notice */}
            <div className="rounded-xl border border-rose-brand/20 bg-rose-light/25 px-4 py-3.5">
              <p className="text-sm font-semibold text-ink leading-snug">جهّزي جوالج، نتصل لتأكيد العنوان والشحن</p>
              <p className="mt-2 text-[12px] leading-relaxed text-ink/85">
                مركز الاتصال يتصل عليج خلال <strong className="text-rose-brand">ساعة تقريباً</strong> في أوقات الدوام
                (قد يتأخر شوي وقت الزحمة). خلّي الرقم شغال وبدون مانع، عشان نثبت عنوان التوصيل ونطلّع طلبج بسرعة.
              </p>
              <p className="mt-2 text-[11px] text-surface-muted leading-relaxed">
                التوصيل للبيت غالباً بين يوم وسبعة أيام بعد التأكيد، حسب المنطقة والمندوب.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4 pb-6">
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-ink">بيانات التواصل فقط</legend>

                <div>
                  <label htmlFor="checkout-name" className="block text-xs font-medium text-ink mb-1.5">
                    الاسم
                  </label>
                  <input
                    id="checkout-name"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="مثال: فاطمة العلي"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-medium text-ink mb-1.5">
                    رقم الكويت
                  </label>
                  <input
                    id="checkout-phone"
                    required
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`${inputClass} font-mono text-base tracking-wide`}
                    placeholder="5XXXXXXX"
                    dir="ltr"
                  />
                  {phoneError && <p className="text-red-700 text-sm mt-2">{phoneError}</p>}
                </div>
              </fieldset>

              <p className="text-[11px] text-surface-muted leading-relaxed">
                الدفع عند استلام الطرد فقط، كاش أو KNET حسب المندوب. ما نطلب بطاقة أونلاين.
              </p>

              <PaymentMethods variant="compact" />

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base font-semibold">
                {loading ? 'جاري الإرسال…' : `تأكيد الطلب · ${formatKwd(orderTotal)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
