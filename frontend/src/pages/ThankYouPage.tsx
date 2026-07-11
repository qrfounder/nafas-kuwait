import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { trackStoreEvent } from '../lib/visitorAnalytics'
import { Logo } from '../components/Logo'
import { ORDER_STEPS } from '../data/socialProof'

export function ThankYouPage() {
  const [params] = useSearchParams()
  const order = params.get('order') || ''
  const upsell = params.get('upsell')

  useEffect(() => {
    if (!order) return
    const key = `nafas_purchase_logged_${order}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      /* ignore */
    }
    trackStoreEvent('purchase', {
      path: `/thank-you?order=${order}`,
      metadata: { order_number: order, upsell: Boolean(upsell), source: 'thank_you_page' },
    })
  }, [order, upsell])

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="p-4 border-b border-surface-border bg-white/80 backdrop-blur-sm">
        <Logo compact />
      </header>
      <div className="flex-1 w-full max-w-lg mx-auto px-4 py-10 sm:py-14">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-success/15 text-success text-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            ✓
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Thank you. Order confirmed</h1>
          {order && (
            <p className="mt-3 text-sm text-ink/75">
              Order number:{' '}
              <strong className="text-rose-brand font-mono tracking-tight" dir="ltr">
                {order}
              </strong>
            </p>
          )}
          {upsell && (
            <p className="mt-2 text-sm font-medium text-rose-brand">Your optional add-on was added to this order.</p>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-rose-brand/20 bg-rose-light/20 px-4 py-4 text-left">
          <p className="text-sm font-semibold text-ink">What happens next</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink/85">
            Your payment was received through <strong className="text-rose-brand">Stripe</strong>. We will
            prepare your order and email tracking when it ships.
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-surface-muted">
            Typical delivery across the United States is{' '}
            <strong className="text-ink/80">3–7 business days</strong> after payment, depending on your
            location and carrier.
          </p>
        </div>

        <p className="mt-6 text-sm text-ink/80 leading-relaxed text-center">
          Returns and replacements for defective or unused items follow our 30-day store policy. Optional
          checkout add-ons (if any) do not replace those rights.
        </p>

        <p className="mt-4 text-xs text-surface-muted text-center leading-relaxed">
          Prepaid securely with Stripe, with no cash on delivery.
        </p>

        <div className="mt-10">
          <p className="text-xs font-semibold text-surface-muted text-center mb-3">Order journey</p>
          <ol className="space-y-2.5">
            {ORDER_STEPS.map((s) => (
              <li
                key={s.step}
                className="flex gap-3 items-start bg-white rounded-xl p-3.5 border border-surface-border shadow-sm"
              >
                <span className="w-8 h-8 rounded-full bg-rose-light text-rose-brand flex items-center justify-center text-xs font-bold shrink-0">
                  {s.step}
                </span>
                <div className="min-w-0 text-left flex-1">
                  <p className="font-semibold text-ink text-sm">{s.title}</p>
                  <p className="text-surface-muted text-xs mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-stretch">
          <Link to="/collection" className="btn-primary text-center py-3">
            Continue shopping
          </Link>
          <Link to="/contact" className="btn-outline text-center py-3">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}
