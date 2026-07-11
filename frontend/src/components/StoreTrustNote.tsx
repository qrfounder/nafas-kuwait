import { Link } from 'react-router-dom'

/** Honest trust strip, with no star ratings or fabricated social proof. */
export function StoreTrustNote({ compact }: { compact?: boolean }) {
  if (compact) {
    return <span className="text-[11px] text-surface-muted">Ships USA · Stripe checkout · 30-day returns</span>
  }
  return (
    <p className="text-[12px] text-surface-muted leading-relaxed">
      Ships across the United States. Prepaid Stripe checkout.{' '}
      <Link to="/returns" className="text-rose-brand underline underline-offset-2">
        30-day returns
      </Link>
      .
    </p>
  )
}
