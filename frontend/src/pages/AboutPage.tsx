import { Link } from 'react-router-dom'
import { ProductImage } from '../components/ProductImage'
import { TrustProcess } from '../components/TrustProcess'
import { PaymentMethods } from '../components/PaymentMethods'
import { BusinessTrust } from '../components/BusinessTrust'
import { Logo } from '../components/Logo'
import { IMAGES } from '../data/images'
import { BUSINESS } from '../data/business'

export function AboutPage() {
  return (
    <>
      <div className="container-narrow py-12">
        <div className="flex justify-start mb-4">
          <Logo compact />
        </div>
        <p className="section-label">About</p>
        <h1 className="section-title mb-8">Nafas ships across the USA</h1>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <ProductImage src={IMAGES.heroAlt} alt="About Nafas. at-home comfort" aspect="4/3" />
          <div className="space-y-4 text-surface-muted leading-relaxed">
            <p>
              <strong className="text-ink">Nafas</strong> makes at-home comfort kits: heat, stretch, and
              massage tools for everyday use. We keep product language honest: comfort devices, not medical
              treatment.
            </p>
            <p>
              <strong className="text-ink">Why “Nafas”?</strong> It means breath. After a short comfort
              session at home, many people simply want a calmer moment in their day.
            </p>
            <p>
              Orders ship across the United States from our US warehouse / 3PL partners. Checkout is prepaid
              with Stripe. Free shipping on orders $100+.{' '}
              <Link to="/returns" className="text-rose-brand underline">
                30-day returns
              </Link>
              .
            </p>
            <p>
              The store is operated by <strong className="text-ink">{BUSINESS.legalName}</strong>
              {BUSINESS.addressLine1
                ? `, ${BUSINESS.addressLine1}, ${BUSINESS.addressLine2 ? `${BUSINESS.addressLine2}, ` : ''}${BUSINESS.city} ${BUSINESS.postalCode}, ${BUSINESS.countryName}`
                : ''}
              . Customer service: {BUSINESS.supportEmail}.
            </p>
            <p className="text-sm border-t border-surface-border pt-4">
              Nafas products are at-home comfort and massage devices only, not intended to diagnose, treat,
              cure, or prevent any disease. Contact{' '}
              <a href={`mailto:${BUSINESS.supportEmail}`} className="text-rose-brand underline">
                {BUSINESS.supportEmail}
              </a>
              .
            </p>
            <PaymentMethods variant="compact" />
          </div>
        </div>
        <div className="mt-10">
          <BusinessTrust />
        </div>
      </div>
      <TrustProcess />
    </>
  )
}
