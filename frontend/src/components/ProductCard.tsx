import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { ProductImage } from './ProductImage'
import { RatingSummary } from './RatingSummary'
import { PriceFrom } from './Price'
import { productImage } from '../data/images'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card overflow-hidden flex flex-col">
      <ProductImage src={productImage(product.slug)} alt={product.title_ar} aspect="4/3" className="rounded-none border-0" />
      <div className="p-5 flex flex-col flex-1">
        <RatingSummary compact />
        <h3 className="font-display text-xl font-bold mt-3 text-ink">{product.title_ar}</h3>
        <p className="text-sm text-surface-muted mt-1 flex-1">{product.subtitle_ar}</p>
        <p className="mt-4 text-2xl">
          <PriceFrom usd={product.base_price} />
        </p>
        <Link to={`/product/${product.slug}`} className="btn-primary text-center mt-4 block">
          عرض الباقة
        </Link>
      </div>
    </article>
  )
}
