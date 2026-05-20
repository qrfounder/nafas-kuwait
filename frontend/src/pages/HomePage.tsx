import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { ProductImage } from '../components/ProductImage'
import { useStoreProducts } from '../context/StoreContext'
import { ReviewsSection } from '../components/ReviewsSection'
import { PaymentMethods } from '../components/PaymentMethods'
import { TrustProcess } from '../components/TrustProcess'
import { TrustHighlights } from '../components/TrustHighlights'
import { RatingSummary } from '../components/RatingSummary'
import { FAQ } from '../components/FAQ'
import { useScarcity } from '../hooks/useScarcity'
import { InventoryNote } from '../components/InventoryNote'
import { BusinessTrust } from '../components/BusinessTrust'
import { usdToKwd } from '../lib/currency'
import { IMAGES } from '../data/images'

const PAIN_POINTS = [
  {
    t: 'الدورة',
    d: 'مغص يخليج تلغين خططك. حزام حرارة من أول يومين يفرق.',
    img: IMAGES.pain.cycle,
  },
  {
    t: 'الظهر',
    d: 'تكييف الشغل والقيادة. ممدد ظهر بثلاث مستويات يفك الضغط بعد الدوام.',
    img: IMAGES.pain.back,
  },
  {
    t: 'الرقبة',
    d: 'تلفون وحجاب. مدلك لاصق قبل النوم يريح الرقبة والنوم.',
    img: IMAGES.pain.neck,
  },
]

export function HomePage() {
  const products = useStoreProducts()
  const { stockLeft } = useScarcity()
  const entryPrice = Math.min(...products.map((p) => p.tiers[0]?.price ?? p.base_price))

  return (
    <>
      <section className="section bg-white border-b border-surface-border">
        <div className="container-narrow grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="section-label">نفس، الكويت، ادفعي عند الباب</p>
            <h1 className="font-display text-4xl md:text-[2.75rem] font-bold leading-tight text-ink">
              ألم تعرفينه. راحة تلحقين فيها على شهرج.
            </h1>
            <p className="mt-4 text-lg text-surface-muted leading-relaxed">
              بوكس واحد فيه حرارة وتدليك لثلاث مناطق. توصيل داخل الكويت، ادفعي عند الباب بعد ما تشوفين
              الطرد، ونتصل قبل الشحن.
            </p>
            <div className="mt-5">
              <RatingSummary />
            </div>
            <div className="mt-4">
              <TrustHighlights />
            </div>
            <Link to="/collection" className="btn-primary inline-block mt-6 text-lg">
              اختاري باقتج، من {usdToKwd(entryPrice).toFixed(1)} د.ك
            </Link>
            <div className="mt-5 pt-5 border-t border-surface-border">
              <PaymentMethods variant="compact" />
            </div>
          </div>
          <ProductImage src={IMAGES.hero} alt="نظام نفس للراحة في البيت" priority aspect="4/3" />
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <p className="section-label text-center">لماذا نفس</p>
          <h2 className="section-title text-center mb-10">تعرفين هالألم؟</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {PAIN_POINTS.map((x) => (
              <div key={x.t} className="card overflow-hidden">
                <div className="aspect-[16/10] relative">
                  <img src={x.img} alt={x.t} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-rose-brand">{x.t}</h3>
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

      <ReviewsSection page="home" />

      <section className="section bg-white border-y border-surface-border">
        <div className="container-narrow text-center max-w-2xl mx-auto">
          <p className="section-label">الفرق</p>
          <h2 className="section-title">نظام واحد، مو قطعة وحدة</h2>
          <p className="mt-4 text-surface-muted leading-relaxed">
            حزام حرارة لاسلكي + ممدد ظهر + مدلك رقبة لاصق في بوكس واحد، ثلاث قطع مختلفة، نظام واحد.
          </p>
          <ul className="mt-6 text-sm text-left inline-block space-y-2 text-surface-muted">
            <li className="flex gap-2">
              <span className="text-trust-green">✓</span> استبدال 7 أيام عند وجود عيب
            </li>
            <li className="flex gap-2">
              <span className="text-trust-green">✓</span> ليس علاجاً طبياً، راحة منزلية فقط
            </li>
            <li className="flex gap-2">
              <span className="text-trust-green">✓</span> تأكيد هاتفي قبل الشحن
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <InventoryNote stockLeft={stockLeft} />
          <h2 className="section-title text-center mt-6 mb-10">باقات نفس</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-narrow max-w-2xl">
          <p className="section-label text-center">مقارنة</p>
          <h2 className="section-title text-center mb-6">نفس مقابل قطعة من النون</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-cream">
                  <th className="py-3 px-4 text-right font-medium text-surface-muted"></th>
                  <th className="py-3 px-4 text-center font-medium text-surface-muted">نون (قطعة)</th>
                  <th className="py-3 px-4 text-center font-semibold text-rose-brand">نفس (نظام)</th>
                </tr>
              </thead>
              <tbody className="text-ink/85">
                <tr className="border-b border-surface-border">
                  <td className="py-3 px-4">مناطق الألم</td>
                  <td className="text-center py-3">1</td>
                  <td className="text-center py-3 font-semibold">3-4</td>
                </tr>
                <tr className="border-b border-surface-border">
                  <td className="py-3 px-4">تأكيد هاتفي</td>
                  <td className="text-center py-3 text-surface-muted">لا</td>
                  <td className="text-center py-3 text-trust-green">✓</td>
                </tr>
                <tr className="border-b border-surface-border">
                  <td className="py-3 px-4">ادفعي عند الباب (مخصص)</td>
                  <td className="text-center py-3 text-surface-muted">لا</td>
                  <td className="text-center py-3 text-trust-green">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">بوكس هدية</td>
                  <td className="text-center py-3 text-surface-muted">لا</td>
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
          ابدئي الآن، من {usdToKwd(entryPrice).toFixed(1)} د.ك
        </Link>
        <p className="text-xs text-surface-muted mt-3">ادفعي عند الباب فقط، داخل الكويت</p>
      </section>
    </>
  )
}
