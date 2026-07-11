import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'

const sections = [
  {
    title: 'Shipping',
    body: 'We ship to addresses in the 50 United States. Orders fulfill from our US warehouse / 3PL partners. Typical delivery is 3–7 business days after payment clears. Flat shipping applies under $100 subtotal; free shipping on orders of $100 or more. You will receive tracking by email when your package ships.',
  },
  {
    title: 'Payment',
    body: 'All orders are prepaid through Stripe at checkout. We accept major credit and debit cards and Apple Pay where Stripe supports them. We do not offer cash on delivery or pay-at-door.',
  },
  {
    title: 'Returns',
    body: 'Contact us within 30 days of delivery for unused items in original packaging or for defective / damaged items. Full details and how to start a return: https://naffas.shop/returns (or /returns on this site). Email support@naffas.shop with your order number.',
  },
  {
    title: 'Privacy',
    body: 'We use your name, email, phone, and shipping address to process orders, deliver packages, and provide customer support. Payment details are handled by Stripe. We do not store full card numbers on our servers. We do not sell your personal data to third parties. For privacy questions, email support@naffas.shop.',
  },
  {
    title: 'Terms',
    body: 'By placing an order on naffas.shop you agree to these policies. Products are at-home comfort devices (heat, stretch, massage, compression). They are not medical devices and are not intended to diagnose, treat, cure, or prevent any disease. Results vary. Consult a clinician for medical concerns. Prices are in USD. Nafas reserves the right to cancel orders that appear fraudulent or that we cannot fulfill.',
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
          <section key={s.title} id={s.title.toLowerCase()}>
            <h2 className="font-display text-xl font-bold text-rose-brand">{s.title}</h2>
            <p className="mt-2 text-surface-muted leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm text-surface-muted">
        Questions?{' '}
        <a href="mailto:support@naffas.shop" className="text-rose-brand underline">
          support@naffas.shop
        </a>
      </p>
      <Link to="/" className="btn-outline inline-block mt-10">
        Back to home
      </Link>
    </div>
  )
}
