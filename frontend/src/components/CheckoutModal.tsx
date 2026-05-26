import { FormEvent, useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import type { CartLine } from '../context/CartContext'
import { ApiRequestError, createOrder } from '../lib/api'
import { formatKwd } from '../lib/currency'
import { getAttribution, newEventId, trackPurchase } from '../lib/analytics'
import { useStore } from '../context/StoreContext'
import { trackStoreEvent } from '../lib/visitorAnalytics'
import { validateKuwaitPhone } from '../lib/phone'
import { CHECKOUT_EXTRAS, CHECKOUT_EXTRAS_ORDER, type CheckoutExtraKey } from '../data/checkoutExtras'
import { PaymentMethods } from './PaymentMethods'

type Props = {
  onSuccess: (
    orderNumber: string,
    postUpsell: { sku: string; title_ar: string; anchor: number; price: number } | null,
  ) => void
}

const TRUST_PILLS = ['ادفعي عند الباب', 'نتصل للتأكيد', 'بدون بطاقة'] as const

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
  const { apiReachable } = useStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutExtras, setCheckoutExtras] = useState<Record<CheckoutExtraKey, boolean>>({
    delivery_protection: false,
    priority_delivery: false,
  })
  const [extrasOpen, setExtrasOpen] = useState(false)
  const [formStarted, setFormStarted] = useState(false)

  useEffect(() => {
    if (checkoutOpen) {
      setCheckoutExtras({ delivery_protection: false, priority_delivery: false })
      setName('')
      setPhone('')
      setNameError('')
      setPhoneError('')
      setExtrasOpen(false)
      setFormStarted(false)
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

  const onFormInteraction = () => {
    if (formStarted) return
    setFormStarted(true)
    trackStoreEvent('checkout_form_start', { value: orderTotal })
  }

  const clearErrors = () => {
    setNameError('')
    setPhoneError('')
  }

  const ready =
    checkoutOpen &&
    product &&
    lines.length > 0 &&
    ((purchaseMode === 'bundle' && tier) || (purchaseMode === 'single' && singleSku))

  if (!ready) return null

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    clearErrors()

    if (!name.trim() || name.trim().length < 2) {
      setNameError('اكتبي اسمك (حرفين على الأقل)')
      return
    }
    const v = validateKuwaitPhone(phone)
    if (!v.ok || !v.normalized) {
      setPhoneError(v.error)
      return
    }
    if (!apiReachable) {
      setPhoneError('تعذّر الاتصال بالخادم. حاولي بعد دقائق أو من صفحة التواصل.')
      return
    }

    setLoading(true)
    const eventId = newEventId()
    const attr = getAttribution()
    try {
      const res = await createOrder({
        customer_name: name.trim(),
        customer_phone: v.normalized,
        product_slug: product.slug,
        offer_tier: offerTier,
        lines: submitLines,
        subtotal_usd: subtotal,
        total_usd: orderTotal,
        event_id: eventId,
        ...attr,
      })
      const orderNumber = String(res.order_number ?? '')
      const postUpsell =
        (res.post_upsell as { sku: string; title_ar: string; anchor: number; price: number } | null) ||
        product.post_upsell
      trackPurchase(orderTotal, eventId)
      try {
        sessionStorage.setItem(`nafas_purchase_logged_${orderNumber}`, '1')
      } catch {
        /* ignore */
      }
      trackStoreEvent('purchase', {
        value: orderTotal,
        product_slug: product.slug,
        metadata: { order_number: orderNumber, event_id: eventId },
      })
      setCheckoutOpen(false)
      onSuccess(orderNumber, postUpsell)
      clearCart()
    } catch (err) {
      const msg =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'حدث خطأ'
      setPhoneError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputBase =
    'w-full rounded-xl border bg-white px-4 py-3.5 text-base text-ink placeholder:text-surface-muted/80 focus:outline-none focus:ring-2 focus:ring-rose-brand/20 focus:border-rose-brand/50 transition-shadow'
  const inputErr = 'border-red-400 focus:ring-red-200 focus:border-red-400'
  const inputOk = 'border-surface-border'

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-ink/55 backdrop-blur-[2px]" onClick={() => setCheckoutOpen(false)} aria-hidden />
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4">
        <div
          className="pointer-events-auto flex w-full max-h-[96dvh] sm:max-h-[90vh] sm:max-w-md flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl border border-surface-border bg-white shadow-2xl"
          role="dialog"
          aria-labelledby="checkout-title"
          aria-describedby="checkout-desc"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-surface-border px-4 py-3.5 sm:px-5">
            <button
              type="button"
              onClick={() => setCheckoutOpen(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-border text-surface-muted hover:bg-cream hover:text-ink"
              aria-label="إغلاق"
            >
              <span className="text-xl leading-none" aria-hidden>
                ×
              </span>
            </button>
            <div className="min-w-0 flex-1 text-center sm:text-right">
              <h2 id="checkout-title" className="font-display text-lg font-bold text-ink leading-tight">
                إتمام الطلب
              </h2>
              <p className="text-[11px] text-trust-green font-medium mt-0.5">الدفع عند الاستلام فقط</p>
            </div>
            <div className="w-10 shrink-0 sm:hidden" aria-hidden />
          </div>

          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            {/* Scrollable body */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 space-y-4">
              <p id="checkout-desc" className="text-center text-sm text-ink/80 leading-relaxed">
                خطوتين بس: <strong className="text-ink">اسمج</strong> و <strong className="text-ink">رقمج</strong> — ونكمل الباقي بالمكالمة
              </p>

              {/* Order summary */}
              <section className="rounded-2xl border border-surface-border bg-cream/60 overflow-hidden" aria-label="ملخص الطلب">
                <div className="px-4 py-2.5 border-b border-surface-border/80 bg-white/60">
                  <p className="text-xs font-semibold text-surface-muted">طلبج</p>
                </div>
                <ul className="px-4 py-3 space-y-2.5 text-sm">
                  {lines.map((l) => (
                    <li key={l.sku + l.line_type} className="flex justify-between gap-3 text-ink/90">
                      <span className="min-w-0 leading-snug font-medium">{l.title_ar}</span>
                      <span className="shrink-0 tabular-nums text-ink">{formatKwd(l.price_usd)}</span>
                    </li>
                  ))}
                  {extraLines.map((l) => (
                    <li key={l.sku} className="flex justify-between gap-3 text-sm">
                      <span className="text-trust-green font-medium leading-snug">{l.title_ar}</span>
                      <span className="shrink-0 tabular-nums text-trust-green font-semibold">
                        +{formatKwd(l.price_usd)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between gap-3 border-t border-surface-border bg-white px-4 py-3">
                  <span className="text-sm font-bold text-ink">المجموع</span>
                  <span className="text-xl font-bold text-rose-brand tabular-nums">{formatKwd(orderTotal)}</span>
                </div>
              </section>

              {/* Optional extras — before form so total stays honest */}
              <section className="rounded-2xl border border-dashed border-surface-border bg-white">
                <button
                  type="button"
                  onClick={() => setExtrasOpen((o) => !o)}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-ink"
                  aria-expanded={extrasOpen}
                >
                  <span>إضافات اختيارية</span>
                  <span className="text-xs font-normal text-surface-muted">مو لازم · {extrasOpen ? '▲' : '▼'}</span>
                </button>
                {extrasOpen && (
                  <div className="space-y-2 border-t border-surface-border px-3 pb-3 pt-2">
                    {CHECKOUT_EXTRAS_ORDER.map((key) => {
                      const x = CHECKOUT_EXTRAS[key]
                      const checked = checkoutExtras[key]
                      return (
                        <label
                          key={key}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                            checked
                              ? 'border-rose-brand/50 bg-rose-light/25'
                              : 'border-surface-border hover:border-rose-brand/25'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setCheckoutExtras((prev) => ({ ...prev, [key]: !prev[key] }))}
                            className="h-5 w-5 shrink-0 accent-rose-brand"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                              <span className="text-sm font-semibold text-ink">{x.title_ar}</span>
                              <span className="text-sm font-bold text-rose-brand tabular-nums">
                                +{formatKwd(x.price_usd)}
                              </span>
                            </span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* Contact fields */}
              <section className="space-y-4" aria-label="بيانات التواصل">
                <div>
                  <label htmlFor="checkout-name" className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-brand text-[11px] font-bold text-white">
                      ١
                    </span>
                    الاسم الكامل
                  </label>
                  <input
                    id="checkout-name"
                    required
                    minLength={2}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (nameError) setNameError('')
                    }}
                    onFocus={onFormInteraction}
                    className={`${inputBase} ${nameError ? inputErr : inputOk}`}
                    placeholder="مثال: فاطمة العلي"
                  />
                  {nameError && (
                    <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
                      {nameError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-brand text-[11px] font-bold text-white">
                      ٢
                    </span>
                    رقم الجوال أو الأرضي
                  </label>
                  <input
                    id="checkout-phone"
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      if (phoneError) setPhoneError('')
                    }}
                    onFocus={onFormInteraction}
                    className={`${inputBase} font-mono tracking-wide ${phoneError ? inputErr : inputOk}`}
                    placeholder="51234567"
                    dir="ltr"
                  />
                  {phoneError ? (
                    <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
                      {phoneError}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-surface-muted">جوال أو أرضي كويتي — 8 أرقام</p>
                  )}
                </div>
              </section>
            </div>

            {/* Sticky footer — CTA always visible */}
            <div className="shrink-0 border-t border-surface-border bg-white px-4 py-4 sm:px-5 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
              <ul className="mb-3 flex flex-wrap justify-center gap-1.5">
                {TRUST_PILLS.map((text) => (
                  <li
                    key={text}
                    className="rounded-full border border-surface-border bg-cream/80 px-2.5 py-1 text-[10px] font-medium text-ink/85"
                  >
                    {text}
                  </li>
                ))}
              </ul>

              {!apiReachable && (
                <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-950" role="alert">
                  تعذّر الاتصال بالخادم. حاولي بعد قليل.
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !apiReachable}
                className="btn-primary w-full py-4 text-base font-bold disabled:opacity-55"
              >
                {loading ? 'جاري الإرسال…' : `تأكيد الطلب · ${formatKwd(orderTotal)}`}
              </button>

              <div className="mt-3">
                <PaymentMethods variant="compact" />
              </div>
              <p className="mt-2 text-center text-[10px] leading-relaxed text-surface-muted">
                نتصل خلال ساعة تقريباً لتأكيد العنوان · التوصيل غالباً ١–٧ أيام
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
