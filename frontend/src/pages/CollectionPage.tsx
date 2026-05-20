import { ProductCard } from '../components/ProductCard'
import { PaymentMethods } from '../components/PaymentMethods'
import { ReviewsSection } from '../components/ReviewsSection'
import { Logo } from '../components/Logo'
import { PRODUCTS } from '../data/products'

export function CollectionPage() {
  return (
    <div className="container-narrow py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
        <div>
          <p className="section-label">المجموعة</p>
          <h1 className="section-title mb-0">مجموعة نفس</h1>
        </div>
        <Logo compact className="hidden sm:flex" />
      </div>
      <p className="text-surface-muted mb-8">
        ثلاث باقات. كل بطاقة تعرض صور القطع اللي توصلج في البوكس، بدون مفاجآت.
      </p>
      <div className="mb-8 pb-8 border-b border-surface-border">
        <PaymentMethods variant="compact" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      <ReviewsSection
        page="collection"
        className="section mt-16 border-t border-surface-border pt-12"
      />
    </div>
  )
}
