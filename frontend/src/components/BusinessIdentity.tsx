import { BUSINESS, formatAddressLines, hasPhysicalAddress } from '../data/business'

type Props = {
  /** denser layout for footers / policy footers */
  compact?: boolean
  className?: string
}

/**
 * Full operator identity for GMC Misrepresentation reviews.
 * Must match Merchant Center → Business info.
 */
export function BusinessIdentity({ compact = false, className = '' }: Props) {
  const lines = formatAddressLines()

  if (compact) {
    return (
      <div className={`text-xs leading-relaxed ${className}`}>
        <p className="font-medium">
          {BUSINESS.legalName}
          {BUSINESS.brandName !== BUSINESS.legalName ? (
            <span className="opacity-80"> (brand: {BUSINESS.brandName})</span>
          ) : null}
        </p>
        {lines.map((line) => (
          <p key={line} className="opacity-80">
            {line}
          </p>
        ))}
        <p className="mt-1 opacity-90">
          <a href={`mailto:${BUSINESS.supportEmail}`} className="underline">
            {BUSINESS.supportEmail}
          </a>
          {BUSINESS.supportPhone ? (
            <>
              {' · '}
              <a href={`tel:${BUSINESS.supportPhone}`} dir="ltr">
                {BUSINESS.supportPhoneDisplay || BUSINESS.supportPhone}
              </a>
            </>
          ) : null}
        </p>
        <p className="mt-1 opacity-70">
          Ships to the {BUSINESS.salesCountryName}. Orders fulfill from US warehouse / 3PL partners.
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-2 text-sm ${className}`}>
      <p>
        <span className="text-surface-muted">Legal business name · </span>
        <strong className="text-ink">{BUSINESS.legalName}</strong>
        {BUSINESS.brandName !== BUSINESS.legalName ? (
          <span className="text-surface-muted"> (store brand: {BUSINESS.brandName})</span>
        ) : null}
      </p>
      <p>
        <span className="text-surface-muted">Email · </span>
        <a href={`mailto:${BUSINESS.supportEmail}`} className="text-rose-brand font-medium underline">
          {BUSINESS.supportEmail}
        </a>
      </p>
      {BUSINESS.supportPhone ? (
        <p>
          <span className="text-surface-muted">Phone · </span>
          <a href={`tel:${BUSINESS.supportPhone}`} className="text-ink font-medium" dir="ltr">
            {BUSINESS.supportPhoneDisplay || BUSINESS.supportPhone}
          </a>
        </p>
      ) : null}
      {hasPhysicalAddress() ? (
        <div>
          <p className="text-surface-muted mb-1">Business address</p>
          {lines.map((line) => (
            <p key={line} className="text-ink font-medium">
              {line}
            </p>
          ))}
        </div>
      ) : null}
      <p className="text-xs text-surface-muted leading-relaxed pt-1 border-t border-surface-border">
        We sell and ship to the {BUSINESS.salesCountryName}. Fulfillment is handled by US warehouse / 3PL
        partners after Stripe payment. The registered business address above is where {BUSINESS.legalName}{' '}
        is established.
      </p>
    </div>
  )
}
