import { FormEvent, useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import type { CartLine } from '../context/CartContext'
import { ApiRequestError, createOrder, type OrderOut } from '../lib/api'
import { formatUsd, shippingForSubtotal, FREE_SHIPPING_THRESHOLD_USD } from '../lib/currency'
import { getAttribution, newEventId } from '../lib/analytics'
import { useStore } from '../context/StoreContext'
import { trackStoreEvent } from '../lib/visitorAnalytics'
import { validateUsPhone } from '../lib/phone'
import { CHECKOUT_EXTRAS, CHECKOUT_EXTRAS_ORDER, type CheckoutExtraKey } from '../data/checkoutExtras'
import { US_STATES } from '../data/usStates'
import { PaymentMethods } from './PaymentMethods'

type Props = {
  /** Unused: Stripe Checkout redirects to success_url. Kept for call-site compatibility. */
  onSuccess?: (
    orderNumber: string,
    postUpsell: { sku: string; title_ar: string; anchor: number; price: number } | null,
  ) => void
}

const TRUST_PILLS = ['Secure Stripe checkout', 'Ships USA', '30-day returns'] as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ZIP_RE = /^\d{5}(-\d{4})?$/

export function CheckoutModal({ onSuccess: _onSuccess }: Props) {
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
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
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
      setEmail('')
      setPhone('')
      setAddress1('')
      setAddress2('')
      setCity('')
      setState('')
      setZip('')
      setFormError('')
      setFieldErrors({})
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
  const merchandiseTotal = subtotal + extrasTotal
  const shipping = shippingForSubtotal(merchandiseTotal)
  const orderTotal = merchandiseTotal + shipping
  const submitLines = [...lines, ...extraLines]

  const onFormInteraction = () => {
    if (formStarted) return
    setFormStarted(true)
    trackStoreEvent('checkout_form_start', { value: orderTotal })
  }

  const ready =
    checkoutOpen &&
    product &&
    lines.length > 0 &&
    ((purchaseMode === 'bundle' && tier) || (purchaseMode === 'single' && singleSku))

  if (!ready) return null

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Enter your full name (at least 2 characters).'
    }
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      errs.email = 'Enter a valid email address.'
    }
    const v = validateUsPhone(phone)
    if (!v.ok || !v.normalized) {
      errs.phone = v.error
    }
    if (!address1.trim() || address1.trim().length < 3) {
      errs.address1 = 'Enter your street address.'
    }
    if (!city.trim() || city.trim().length < 2) {
      errs.city = 'Enter your city.'
    }
    if (!state) {
      errs.state = 'Select your state.'
    }
    if (!ZIP_RE.test(zip.trim())) {
      errs.zip = 'Enter a valid ZIP code (e.g. 90210).'
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    if (!apiReachable) {
      setFormError('Could not reach the server. Please try again in a moment.')
      return
    }

    const v = validateUsPhone(phone)
    if (!v.ok || !v.normalized) {
      setFieldErrors((prev) => ({ ...prev, phone: v.error }))
      return
    }

    setLoading(true)
    const eventId = newEventId()
    const attr = getAttribution()
    try {
      const res: OrderOut = await createOrder({
        customer_name: name.trim(),
        customer_email: email.trim().toLowerCase(),
        customer_phone: v.normalized,
        governorate: state,
        area: city.trim(),
        street: address1.trim(),
        building: address2.trim() || undefined,
        block: zip.trim(),
        product_slug: product.slug,
        offer_tier: offerTier,
        lines: submitLines,
        subtotal_usd: merchandiseTotal,
        total_usd: orderTotal,
        event_id: eventId, ...attr,
      })
      const checkoutUrl = res.checkout_url
      if (!checkoutUrl) {
        setFormError('Checkout URL missing. Please try again or contact support.')
        return
      }
      clearCart()
      setCheckoutOpen(false)
      // Stripe success_url → /thank-you; onSuccess unused for card checkout.
      window.location.href = checkoutUrl
    } catch (err) {
      const msg =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Something went wrong'
      setFormError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputBase =
    'w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-surface-muted/80 focus:outline-none focus:ring-2 focus:ring-rose-brand/20 focus:border-rose-brand/50 transition-shadow'
  const inputErr = 'border-red-400 focus:ring-red-200 focus:border-red-400'
  const inputOk = 'border-surface-border'
  const fieldClass = (key: string) => `${inputBase} ${fieldErrors[key] ? inputErr : inputOk}`

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
          <div className="flex shrink-0 items-center gap-3 border-b border-surface-border px-4 py-3.5 sm:px-5">
            <button
              type="button"
              onClick={() => setCheckoutOpen(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-border text-surface-muted hover:bg-cream hover:text-ink"
              aria-label="Close"
            >
              <span className="text-xl leading-none" aria-hidden>
                ×
              </span>
            </button>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 id="checkout-title" className="font-display text-lg font-bold text-ink leading-tight">
                Checkout
              </h2>
              <p className="text-[11px] text-trust-green font-medium mt-0.5">Secure payment with Stripe</p>
            </div>
            <div className="w-10 shrink-0 sm:hidden" aria-hidden />
          </div>

          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 space-y-4">
              <p id="checkout-desc" className="text-center text-sm text-ink/80 leading-relaxed">
                Enter your shipping details, then pay securely with Stripe.
              </p>

              <section className="rounded-2xl border border-surface-border bg-cream/60 overflow-hidden" aria-label="Order summary">
                <div className="px-4 py-2.5 border-b border-surface-border/80 bg-white/60">
                  <p className="text-xs font-semibold text-surface-muted">Your order</p>
                </div>
                <ul className="px-4 py-3 space-y-2.5 text-sm">
                  {lines.map((l) => (
                    <li key={l.sku + l.line_type} className="flex justify-between gap-3 text-ink/90">
                      <span className="min-w-0 leading-snug font-medium">{l.title_ar}</span>
                      <span className="shrink-0 tabular-nums text-ink">{formatUsd(l.price_usd)}</span>
                    </li>
                  ))}
                  {extraLines.map((l) => (
                    <li key={l.sku} className="flex justify-between gap-3 text-sm">
                      <span className="text-trust-green font-medium leading-snug">{l.title_ar}</span>
                      <span className="shrink-0 tabular-nums text-trust-green font-semibold">
                        +{formatUsd(l.price_usd)}
                      </span>
                    </li>
                  ))}
                  <li className="flex justify-between gap-3 text-sm text-ink/80">
                    <span>Shipping</span>
                    <span className="tabular-nums">
                      {shipping === 0 ? 'Free' : formatUsd(shipping)}
                    </span>
                  </li>
                </ul>
                <div className="flex items-center justify-between gap-3 border-t border-surface-border bg-white px-4 py-3">
                  <span className="text-sm font-bold text-ink">Total</span>
                  <span className="text-xl font-bold text-rose-brand tabular-nums">{formatUsd(orderTotal)}</span>
                </div>
                {shipping > 0 && (
                  <p className="px-4 pb-3 text-[11px] text-surface-muted">
                    Free shipping on orders {formatUsd(FREE_SHIPPING_THRESHOLD_USD)}+ before shipping.
                  </p>
                )}
              </section>

              <section className="rounded-2xl border border-dashed border-surface-border bg-white">
                <button
                  type="button"
                  onClick={() => setExtrasOpen((o) => !o)}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-ink"
                  aria-expanded={extrasOpen}
                >
                  <span>Optional add-ons</span>
                  <span className="text-xs font-normal text-surface-muted">{extrasOpen ? '▲' : '▼'}</span>
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
                                +{formatUsd(x.price_usd)}
                              </span>
                            </span>
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </section>

              <section className="space-y-3" aria-label="Shipping details">
                <div>
                  <label htmlFor="checkout-name" className="mb-1.5 block text-sm font-bold text-ink">
                    Full name
                  </label>
                  <input
                    id="checkout-name"
                    required
                    minLength={2}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: '' }))
                    }}
                    onFocus={onFormInteraction}
                    className={fieldClass('name')}
                    placeholder="Jane Smith"
                  />
                  {fieldErrors.name && (
                    <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-email" className="mb-1.5 block text-sm font-bold text-ink">
                    Email
                  </label>
                  <input
                    id="checkout-email"
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }))
                    }}
                    onFocus={onFormInteraction}
                    className={fieldClass('email')}
                    placeholder="you@example.com"
                    dir="ltr"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="mb-1.5 block text-sm font-bold text-ink">
                    Phone
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
                      if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: '' }))
                    }}
                    onFocus={onFormInteraction}
                    className={`${fieldClass('phone')} font-mono tracking-wide`}
                    placeholder="4155552671"
                    dir="ltr"
                  />
                  {fieldErrors.phone ? (
                    <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
                      {fieldErrors.phone}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-surface-muted">US mobile or landline. 10 digits</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-address1" className="mb-1.5 block text-sm font-bold text-ink">
                    Address
                  </label>
                  <input
                    id="checkout-address1"
                    required
                    autoComplete="address-line1"
                    value={address1}
                    onChange={(e) => {
                      setAddress1(e.target.value)
                      if (fieldErrors.address1) setFieldErrors((p) => ({ ...p, address1: '' }))
                    }}
                    onFocus={onFormInteraction}
                    className={fieldClass('address1')}
                    placeholder="123 Main St"
                  />
                  {fieldErrors.address1 && (
                    <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
                      {fieldErrors.address1}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkout-address2" className="mb-1.5 block text-sm font-bold text-ink">
                    Apt / suite <span className="font-normal text-surface-muted">(optional)</span>
                  </label>
                  <input
                    id="checkout-address2"
                    autoComplete="address-line2"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    onFocus={onFormInteraction}
                    className={`${inputBase} ${inputOk}`}
                    placeholder="Apt 4B"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-city" className="mb-1.5 block text-sm font-bold text-ink">
                    City
                  </label>
                  <input
                    id="checkout-city"
                    required
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value)
                      if (fieldErrors.city) setFieldErrors((p) => ({ ...p, city: '' }))
                    }}
                    onFocus={onFormInteraction}
                    className={fieldClass('city')}
                    placeholder="Los Angeles"
                  />
                  {fieldErrors.city && (
                    <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
                      {fieldErrors.city}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="checkout-state" className="mb-1.5 block text-sm font-bold text-ink">
                      State
                    </label>
                    <select
                      id="checkout-state"
                      required
                      autoComplete="address-level1"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value)
                        if (fieldErrors.state) setFieldErrors((p) => ({ ...p, state: '' }))
                      }}
                      onFocus={onFormInteraction}
                      className={fieldClass('state')}
                    >
                      <option value="">Select</option>
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.code}. {s.name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.state && (
                      <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
                        {fieldErrors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="checkout-zip" className="mb-1.5 block text-sm font-bold text-ink">
                      ZIP
                    </label>
                    <input
                      id="checkout-zip"
                      required
                      autoComplete="postal-code"
                      value={zip}
                      onChange={(e) => {
                        setZip(e.target.value)
                        if (fieldErrors.zip) setFieldErrors((p) => ({ ...p, zip: '' }))
                      }}
                      onFocus={onFormInteraction}
                      className={`${fieldClass('zip')} font-mono`}
                      placeholder="90210"
                      dir="ltr"
                    />
                    {fieldErrors.zip && (
                      <p className="mt-1.5 text-sm font-medium text-red-700" role="alert">
                        {fieldErrors.zip}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {formError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  {formError}
                </p>
              )}
            </div>

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
                  Could not reach the server. Please try again shortly.
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !apiReachable}
                className="btn-primary w-full py-4 text-base font-bold disabled:opacity-55"
              >
                {loading ? 'Redirecting to Stripe…' : `Pay ${formatUsd(orderTotal)}`}
              </button>

              <div className="mt-3">
                <PaymentMethods variant="compact" />
              </div>
              <p className="mt-2 text-center text-[10px] leading-relaxed text-surface-muted">
                You will complete payment on Stripe’s secure checkout. Ships within the USA.
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
