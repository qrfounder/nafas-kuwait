import { FormEvent, useState } from 'react'
import { useCart } from '../context/CartContext'
import { createOrder } from '../lib/api'
import { formatKwd, formatUsd } from '../lib/currency'
import { getAttribution, getLastEventId, trackPurchase } from '../lib/analytics'
import { validateKuwaitPhone } from '../lib/phone'
import { KUWAIT_GOVERNORATES } from '../data/kuwaitAreas'
import { PaymentMethods } from './PaymentMethods'

type Props = {
  onSuccess: (
    orderNumber: string,
    postUpsell: { sku: string; title_ar: string; anchor: number; price: number } | null,
  ) => void
}

export function CheckoutModal({ onSuccess }: Props) {
  const { checkoutOpen, setCheckoutOpen, product, tier, lines, subtotal, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [area, setArea] = useState('')
  const [block, setBlock] = useState('')
  const [street, setStreet] = useState('')
  const [building, setBuilding] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!checkoutOpen || !product || !tier) return null

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
        customer_name: name,
        customer_phone: phone,
        governorate,
        area,
        block,
        street,
        building: building || undefined,
        delivery_notes: deliveryNotes || undefined,
        product_slug: product.slug,
        offer_tier: tier.tier,
        lines,
        subtotal_usd: subtotal,
        total_usd: subtotal,
        event_id: eventId,
        ...attr,
      })
      trackPurchase(subtotal, eventId)
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
    'w-full border border-surface-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-brand/20 focus:border-rose-brand/40'

  return (
    <>
      <div className="fixed inset-0 bg-ink/40 z-[60]" onClick={() => setCheckoutOpen(false)} aria-hidden />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="card max-w-md w-full p-6 pointer-events-auto max-h-[90vh] overflow-y-auto shadow-lift"
          role="dialog"
          aria-labelledby="checkout-title"
        >
          <div className="flex items-center gap-2 text-trust-green text-xs font-medium mb-4 pb-3 border-b border-surface-border">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M8 1a4 4 0 00-4 4v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm-2 6V5a2 2 0 114 0v2H6z" />
            </svg>
            طلب آمن — دفع عند الاستلام · توصيل داخل الكويت
          </div>

          <h2 id="checkout-title" className="font-display text-xl font-bold text-ink">
            إتمام الطلب
          </h2>

          <div className="bg-cream rounded-lg p-3 mt-4 mb-5 text-sm space-y-1 border border-surface-border">
            {lines.map((l) => (
              <div key={l.sku + l.line_type} className="flex justify-between text-ink/80 gap-2">
                <span>{l.title_ar}</span>
                <span className="shrink-0 font-medium text-rose-brand">{formatKwd(l.price_usd)}</span>
              </div>
            ))}
            <p className="font-bold text-rose-brand pt-2 border-t border-surface-border mt-2">
              المجموع: {formatKwd(subtotal)}{' '}
              <span className="text-xs font-normal text-surface-muted">({formatUsd(subtotal)})</span>
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-ink mb-1">بيانات التواصل</legend>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">الاسم الكامل</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="مثال: فاطمة العلي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">رقم الكويت (+965)</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="5XXXXXXX"
                  dir="ltr"
                />
                {phoneError && <p className="text-red-700 text-sm mt-1">{phoneError}</p>}
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-ink mb-1">عنوان التوصيل</legend>
              <p className="text-xs text-surface-muted -mt-1">
                نستخدم العنوان للشحن — ونتصل للتأكيد قبل الإرسال
              </p>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">المحافظة</label>
                <select
                  required
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className={inputClass}
                >
                  <option value="">اختاري المحافظة</option>
                  {KUWAIT_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">المنطقة</label>
                <input
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className={inputClass}
                  placeholder="مثال: السالمية، حولي، الجابرية"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">القطعة</label>
                  <input
                    required
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className={inputClass}
                    placeholder="5"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">الشارع</label>
                  <input
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={inputClass}
                    placeholder="شارع الخليج"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">المنزل / الشقة (اختياري)</label>
                <input
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className={inputClass}
                  placeholder="منزل 12، شقة 4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">ملاحظات للمندوب (اختياري)</label>
                <input
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className={inputClass}
                  placeholder="باب خلفي، اتصلي قبل الوصول"
                />
              </div>
            </fieldset>

            <p className="text-xs text-surface-muted leading-relaxed">
              نتصل للتأكيد خلال ساعات العمل. الدفع عند استلام الطرد فقط — كاش أو KNET حسب المندوب.
            </p>
            <PaymentMethods variant="compact" />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'جاري الإرسال…' : `تأكيد الطلب — ${formatKwd(subtotal)}`}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
