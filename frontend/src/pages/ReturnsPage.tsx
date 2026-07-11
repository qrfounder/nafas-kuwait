import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { BUSINESS } from '../data/business'

/** Dedicated returns URL for Google Merchant Center return policy. */
export function ReturnsPage() {
  return (
    <div className="container-narrow py-12 max-w-2xl">
      <div className="flex justify-start mb-4">
        <Logo compact />
      </div>
      <p className="section-label">Returns</p>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Return & refund policy</h1>
      <div className="space-y-6 text-surface-muted leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold text-rose-brand">30-day window</h2>
          <p className="mt-2">
            You may request a return within <strong className="text-ink">30 days of delivery</strong> for
            unused items in original packaging, or for items that arrived defective or damaged.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-rose-brand">How to start a return</h2>
          <p className="mt-2">
            Email{' '}
            <a href={`mailto:${BUSINESS.supportEmail}`} className="text-rose-brand underline">
              {BUSINESS.supportEmail}
            </a>{' '}
            or use our{' '}
            <Link to="/contact" className="text-rose-brand underline">
              Contact
            </Link>{' '}
            form with your order number, reason, and photos for damage claims. We will reply with return
            instructions.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-rose-brand">Refunds & replacements</h2>
          <p className="mt-2">
            Approved returns are refunded to the original Stripe payment method, or replaced when stock
            allows. Defective items: we cover return shipping. Unused change-of-mind returns: customer is
            responsible for return shipping unless we state otherwise.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-rose-brand">Country</h2>
          <p className="mt-2">This policy applies to orders shipped within the United States.</p>
        </section>
      </div>
      <p className="mt-8 text-sm text-surface-muted">
        Also see{' '}
        <Link to="/policies" className="text-rose-brand underline">
          full store policies
        </Link>
        .
      </p>
      <Link to="/collection" className="btn-outline inline-block mt-8">
        Back to shop
      </Link>
    </div>
  )
}
