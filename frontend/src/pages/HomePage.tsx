import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { ProductImage } from '../components/ProductImage'
import { useStoreProducts } from '../context/StoreContext'
import { PaymentMethods } from '../components/PaymentMethods'
import { TrustProcess } from '../components/TrustProcess'
import { TrustHighlights } from '../components/TrustHighlights'
import { StoreTrustNote } from '../components/StoreTrustNote'
import { FAQ } from '../components/FAQ'
import { BusinessTrust } from '../components/BusinessTrust'
import { formatUsd } from '../lib/currency'
import { IMAGES } from '../data/images'
import { OptimizedImage } from '../components/OptimizedImage'

const COMFORT_THEMES = [
  {
    t: 'Warmth at home',
    d: 'A wireless warming belt for short, comfortable sessions when you want gentle heat.',
    img: IMAGES.pain.cycle,
  },
  {
    t: 'Back & desk',
    d: 'Long sitting and desk days. A stretch arch with three height levels after work.',
    img: IMAGES.pain.back,
  },
  {
    t: 'Neck & screens',
    d: 'Phone time and desk posture. A small adhesive massager before you wind down.',
    img: IMAGES.pain.neck,
  },
]

export function HomePage() {
  const products = useStoreProducts()
  const entryPrice = Math.min(...products.map((p) => p.tiers[0]?.price ?? p.base_price))

  return (
    <>
      <section className="section bg-white border-b border-surface-border">
        <div className="container-narrow grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="section-label">Ships across the USA</p>
            <h1 className="font-display text-4xl md:text-[2.75rem] font-normal leading-tight text-ink">
              Home comfort kits that show up ready to use
            </h1>
            <p className="mt-4 text-lg text-surface-muted leading-relaxed">
              Heat, stretch, and massage tools in one box. We ship from the US and you check out with
              Stripe.
            </p>
            <div className="mt-5">
              <StoreTrustNote />
            </div>
            <div className="mt-4">
              <TrustHighlights />
            </div>
            <Link to="/collection" className="btn-primary inline-block mt-6 text-lg">
              Shop kits from {formatUsd(entryPrice)}
            </Link>
            <div className="mt-5 pt-5 border-t border-surface-border">
              <PaymentMethods variant="compact" />
            </div>
          </div>
          <ProductImage src={IMAGES.hero} alt="Nafas at-home comfort kit" priority aspect="4/3" />
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <p className="section-label text-center">Why Nafas</p>
          <h2 className="section-title text-center mb-10">Built for everyday comfort</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {COMFORT_THEMES.map((x) => (
              <div key={x.t} className="card overflow-hidden">
                <div className="aspect-[16/10] relative">
                  <OptimizedImage
                    src={x.img}
                    alt={x.t}
                    pictureClassName="absolute inset-0 block w-full h-full"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-medium text-ink">{x.t}</h3>
                  <p className="mt-2 text-sm text-surface-muted leading-relaxed">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustProcess />

      <section className="section container-narrow">
        <BusinessTrust />
      </section>

      <section className="section bg-white border-y border-surface-border">
        <div className="container-narrow text-center max-w-2xl mx-auto">
          <p className="section-label">The difference</p>
          <h2 className="section-title">A full kit, not a single gadget</h2>
          <p className="mt-4 text-surface-muted leading-relaxed">
            Wireless warming belt + back stretch arch + adhesive neck massager in one box. Three different
            tools for home comfort.
          </p>
          <ul className="mt-6 text-sm text-left inline-block space-y-2 text-surface-muted">
            <li className="flex gap-2">
              <span className="text-trust-green">✓</span> 30-day returns on unused or defective items
            </li>
            <li className="flex gap-2">
              <span className="text-trust-green">✓</span> At-home comfort devices, not medical treatment
            </li>
            <li className="flex gap-2">
              <span className="text-trust-green">✓</span> Free shipping on orders $100+
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <h2 className="section-title text-center mb-10">Nafas kits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-narrow max-w-2xl">
          <p className="section-label text-center">Compare</p>
          <h2 className="section-title text-center mb-6">Nafas kit vs. a single gadget</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-cream">
                  <th className="py-3 px-4 text-left font-medium text-surface-muted"></th>
                  <th className="py-3 px-4 text-center font-medium text-surface-muted">Single gadget</th>
                  <th className="py-3 px-4 text-center font-semibold text-rose-brand">Nafas kit</th>
                </tr>
              </thead>
              <tbody className="text-ink/85">
                <tr className="border-b border-surface-border">
                  <td className="py-3 px-4 text-left">Tools in the box</td>
                  <td className="text-center py-3">1</td>
                  <td className="text-center py-3 font-semibold">3–4</td>
                </tr>
                <tr className="border-b border-surface-border">
                  <td className="py-3 px-4 text-left">Secure Stripe checkout</td>
                  <td className="text-center py-3 text-surface-muted">Varies</td>
                  <td className="text-center py-3 text-trust-green">✓</td>
                </tr>
                <tr className="border-b border-surface-border">
                  <td className="py-3 px-4 text-left">Ships across the USA</td>
                  <td className="text-center py-3 text-surface-muted">Varies</td>
                  <td className="text-center py-3 text-trust-green">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-left">Gift-ready packaging option</td>
                  <td className="text-center py-3 text-surface-muted">Rarely</td>
                  <td className="text-center py-3 text-trust-green">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FAQ />

      <section className="container-narrow pb-20 text-center">
        <PaymentMethods variant="row" showCaption />
        <Link to="/collection" className="btn-primary text-base px-10 mt-8 inline-block">
          Shop now from {formatUsd(entryPrice)}
        </Link>
        <p className="text-xs text-surface-muted mt-3">Prepaid with Stripe · Ships USA · Free shipping $100+</p>
      </section>
    </>
  )
}
