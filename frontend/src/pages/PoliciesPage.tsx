import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { BusinessIdentity } from '../components/BusinessIdentity'
import { BUSINESS } from '../data/business'
import { FREE_SHIPPING_THRESHOLD_USD, US_SHIPPING_USD, formatUsd } from '../lib/currency'

const sections = [
  {
    id: 'shipping',
    title: 'Shipping',
    body: `We ship to addresses in the 50 United States. Orders fulfill from our US warehouse / 3PL partners after payment. Typical delivery is 3–7 business days after payment clears. Shipping is ${formatUsd(US_SHIPPING_USD)} on orders under ${formatUsd(FREE_SHIPPING_THRESHOLD_USD)} subtotal; free shipping on orders of ${formatUsd(FREE_SHIPPING_THRESHOLD_USD)} or more. You will receive tracking by email when your package ships.`,
  },
  {
    id: 'payment',
    title: 'Payment',
    body: 'All orders are prepaid through Stripe at checkout. We accept Visa, Mastercard, American Express, and Apple Pay where Stripe supports them. We do not offer cash on delivery or pay-at-door.',
  },
  {
    id: 'returns',
    title: 'Returns',
    body: `Contact us within 30 days of delivery for unused items in original packaging or for defective / damaged items. Full details: ${BUSINESS.returnsUrl}. Email ${BUSINESS.supportEmail} or call ${BUSINESS.supportPhoneDisplay || BUSINESS.supportPhone} with your order number.`,
  },
  {
    id: 'privacy',
    title: 'Privacy',
    body: `We use your name, email, phone, and shipping address to process orders, deliver packages, and provide customer support. Payment details are handled by Stripe. We do not store full card numbers on our servers. We do not sell your personal data to third parties. For privacy questions, email ${BUSINESS.supportEmail} or call ${BUSINESS.supportPhoneDisplay || BUSINESS.supportPhone}.`,
  },
  {
    id: 'terms',
    title: 'Terms',
    body: `By placing an order on naffas.shop you agree to these policies. The store brand is ${BUSINESS.brandName}; the legal operator is ${BUSINESS.legalName}. Products are at-home comfort devices (heat, stretch, massage, compression). They are not medical devices and are not intended to diagnose, treat, cure, or prevent any disease. Results vary. Consult a clinician for medical concerns. Prices are in USD. ${BUSINESS.legalName} reserves the right to cancel orders that appear fraudulent or that we cannot fulfill.`,
  },
]

export function PoliciesPage() {
  return (
    <div className="container-narrow py-12 max-w-2xl">
      <div className="flex justify-start mb-4">
        <Logo compact />
      </div>
      <p className="section-label">Policies</p>
      <h1 className="font-display text-3xl font-bold text-ink mb-8">Store policies</h1>
      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.id} id={s.id}>
            <h2 className="font-display text-xl font-bold text-rose-brand">{s.title}</h2>
            <p className="mt-2 text-surface-muted leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-10 card p-5">
        <p className="section-label mb-3">Business & contact</p>
        <BusinessIdentity />
        <p className="mt-4 text-sm text-surface-muted">
          Returns:{' '}
          <Link to="/returns" className="text-rose-brand underline">
            {BUSINESS.returnsUrl}
          </Link>
        </p>
      </section>

      <Link to="/" className="btn-outline inline-block mt-10">
        Back to home
      </Link>
    </div>
  )
}
