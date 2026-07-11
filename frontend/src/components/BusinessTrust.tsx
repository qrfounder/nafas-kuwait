import { Link } from 'react-router-dom'
import { BusinessIdentity } from './BusinessIdentity'
import { BUSINESS } from '../data/business'
import { FREE_SHIPPING_THRESHOLD_USD, US_SHIPPING_USD, formatUsd } from '../lib/currency'

/** Trust signals for US Stripe shoppers. honest identity only. */
export function BusinessTrust({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="text-[11px] text-surface-muted text-center max-w-3xl mx-auto px-4">
        <BusinessIdentity compact />
      </div>
    )
  }

  return (
    <section className="bg-white border border-surface-border p-5">
      <p className="section-label mb-3">Store information</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-xs text-surface-muted">Online store</p>
          <p className="text-sm font-medium text-ink mt-0.5">{BUSINESS.shopUrl.replace('https://', '')}</p>
        </div>
        <div>
          <p className="text-xs text-surface-muted">Payment</p>
          <p className="text-sm font-medium text-ink mt-0.5">Prepaid with Stripe (Visa, Mastercard, Amex, Apple Pay)</p>
        </div>
        <div>
          <p className="text-xs text-surface-muted">Shipping</p>
          <p className="text-sm font-medium text-ink mt-0.5">
            US · {formatUsd(US_SHIPPING_USD)} under {formatUsd(FREE_SHIPPING_THRESHOLD_USD)} · free at{' '}
            {formatUsd(FREE_SHIPPING_THRESHOLD_USD)}+ · 3–7 business days
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-muted">Returns</p>
          <p className="text-sm font-medium text-ink mt-0.5">
            <Link to="/returns" className="text-rose-brand underline">
              30-day returns
            </Link>
          </p>
        </div>
      </div>
      <BusinessIdentity />
    </section>
  )
}
