import { ProductCard } from '../components/ProductCard'
import { PaymentMethods } from '../components/PaymentMethods'
import { Logo } from '../components/Logo'
import { useStoreProducts } from '../context/StoreContext'
import { StoreTrustNote } from '../components/StoreTrustNote'
import { Link } from 'react-router-dom'

export function CollectionPage() {
  const products = useStoreProducts()
  return (
    <div className="container-narrow py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
        <div>
          <p className="section-label">Shop</p>
          <h1 className="section-title mb-0">Nafas collection</h1>
        </div>
        <Logo compact className="hidden sm:flex" />
      </div>
      <p className="text-surface-muted mb-4">
        Three kits. Each card lists the pieces that arrive in the box.
      </p>
      <div className="mb-8">
        <StoreTrustNote />
      </div>
      <div className="mb-8 pb-8 border-b border-surface-border">
        <PaymentMethods variant="compact" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      <p className="mt-12 text-sm text-surface-muted text-center">
        Questions about shipping or returns?{' '}
        <Link to="/returns" className="text-rose-brand underline">
          Returns policy
        </Link>{' '}
        ·{' '}
        <Link to="/contact" className="text-rose-brand underline">
          Contact
        </Link>
      </p>
    </div>
  )
}
