import { Link } from 'react-router-dom'
import { BUSINESS, formatAddressLines, hasPhysicalAddress } from '../data/business'

/** Trust signals for US Stripe shoppers. honest identity only. */
export function BusinessTrust({ compact }: { compact?: boolean }) {
  const address = formatAddressLines()

  if (compact) {
    return (
      <p className="text-[11px] text-surface-muted text-center">
        Nafas · USA · {BUSINESS.supportEmail} · Stripe checkout · comfort products, not medical devices
      </p>
    )
  }

  return (
    <section className="bg-white border border-surface-border rounded-xl p-5">
      <p className="section-label mb-3">Store information</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-surface-muted">Online store</p>
          <p className="text-sm font-medium text-ink mt-0.5">{BUSINESS.shopUrl.replace('https://', '')}</p>
        </div>
        <div>
          <p className="text-xs text-surface-muted">Support</p>
          <p className="text-sm font-medium text-ink mt-0.5">
            <a href={`mailto:${BUSINESS.supportEmail}`} className="text-rose-brand underline">
              {BUSINESS.supportEmail}
            </a>
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-muted">Payment</p>
          <p className="text-sm font-medium text-ink mt-0.5">Prepaid with Stripe (cards & Apple Pay)</p>
        </div>
        <div>
          <p className="text-xs text-surface-muted">Shipping & returns</p>
          <p className="text-sm font-medium text-ink mt-0.5">
            US · 3–7 business days ·{' '}
            <Link to="/returns" className="text-rose-brand underline">
              30-day returns
            </Link>
          </p>
        </div>
        {hasPhysicalAddress() && (
          <div className="sm:col-span-2">
            <p className="text-xs text-surface-muted">Business address</p>
            {address.map((line) => (
              <p key={line} className="text-sm font-medium text-ink mt-0.5">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
