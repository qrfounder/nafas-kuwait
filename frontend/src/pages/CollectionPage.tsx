import { ProductCard } from '../components/ProductCard'
import { PaymentMethods } from '../components/PaymentMethods'
import { PRODUCTS } from '../data/products'

export function CollectionPage() {
  return (
    <div className="container-narrow py-12">
      <p className="section-label">المجموعة</p>
      <h1 className="section-title mb-2">مجموعة نفس</h1>
      <p className="text-surface-muted mb-8">ثلاث أنظمة راحة — اختاري اللي يناسب ألمج</p>
      <div className="mb-8 pb-8 border-b border-surface-border">
        <PaymentMethods variant="compact" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  )
}
