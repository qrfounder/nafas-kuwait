import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { SKU_LABELS } from '../data/products'
import { StoreTrustNote } from './StoreTrustNote'
import { PriceFrom } from './Price'
import { BundleContents } from './BundleContents'

function includesSummary(includes: string[]) {
  const n = includes.length
  const names = includes.map((s) => SKU_LABELS[s]).join(', ')
  const piece = n === 1 ? 'piece' : 'pieces'
  return `${n} ${piece}: ${names}`
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card overflow-hidden flex flex-col">
      <div className="p-3 pb-0 bg-cream border-b border-surface-border">
        <BundleContents includes={product.includes} layout="preview" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <StoreTrustNote compact />
        <h3 className="font-display text-xl font-bold mt-3 text-ink">{product.title_ar}</h3>
        <p className="text-sm text-surface-muted mt-1 flex-1">{product.subtitle_ar}</p>
        <p className="text-[11px] text-surface-muted mt-2 leading-relaxed">{includesSummary(product.includes)}</p>
        <p className="mt-4 text-2xl">
          <PriceFrom usd={product.base_price} />
        </p>
        <Link to={`/product/${product.slug}`} className="btn-primary text-center mt-4 block">
          View kit & pieces
        </Link>
      </div>
    </article>
  )
}
