import { ProductImage } from '../components/ProductImage'
import { TrustProcess } from '../components/TrustProcess'
import { PaymentMethods } from '../components/PaymentMethods'
import { IMAGES } from '../data/images'

export function AboutPage() {
  return (
    <>
      <div className="container-narrow py-12">
        <p className="section-label">من نحن</p>
        <h1 className="section-title mb-8">نفس — من الكويت</h1>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <ProductImage src={IMAGES.heroAlt} alt="عن نفس — راحة منزلية" aspect="4/3" />
          <div className="space-y-4 text-surface-muted leading-relaxed">
            <p>
              <strong className="text-ink">نفس</strong> انولدت في الكويت من فكرة بسيطة: المرأة الخليجية تتألم
              بصمت — بالدورة، بالظهر، بالرقبة — وما تبي صيدلية ولا كلام طبي معقد.
            </p>
            <p>
              <strong className="text-ink">ليش سمّيناها نفس؟</strong> لأن أول شي تبين بعد ما يرتاح جسمج هو إنك
              تاخذين نفس عميق — من غير ألم يوقفج.
            </p>
            <p>
              نبيع <strong className="text-ink">نظام راحة</strong> مو قطعة: حرارة وتدليك لمناطق جسمج اللي تتعب كل
              شهر وكل يوم. دفع عند الاستلام، توصيل لكل الكويت، وتأكيد هاتفي قبل ما يطلع طلبج.
            </p>
            <p className="text-sm border-t border-surface-border pt-4">
              نفس ما تقدم علاجاً طبياً — منتجات راحة وتدليك للاستخدام المنزلي فقط.
            </p>
            <PaymentMethods variant="compact" />
          </div>
        </div>
      </div>
      <TrustProcess />
    </>
  )
}
