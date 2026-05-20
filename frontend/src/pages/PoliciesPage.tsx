import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'

const sections = [
  {
    title: 'الشحن والتوصيل',
    body: 'نوصّل داخل الكويت. عنوان التوصيل يُؤكَّد بالمكالمة. غالباً يستغرق وصول الطرد بين يوم وسبعة أيام بعد التأكيد، حسب المنطقة والمندوب.',
  },
  {
    title: 'الدفع',
    body: 'ادفعي عند الباب فقط. ما نطلب بطاقة أونلاين. تقدرين تدفعين كاش أو KNET مع المندوب حسب المتاح.',
  },
  {
    title: 'الاستبدال',
    body: 'إذا وصل المنتج معيباً، تواصلي معنا خلال 7 أيام من الاستلام عبر صفحة التواصل، نرتب الاستبدال.',
  },
  {
    title: 'إخلاء مسؤولية',
    body: 'منتجات نفس أجهزة حرارة وتدليك للراحة المنزلية. ليست علاجاً طبياً ولا بديلاً عن استشارة الطبيب.',
  },
  {
    title: 'الخصوصية',
    body: 'نستخدم اسمك ورقمك وعنوانك لمعالجة الطلب والتوصيل ومتابعة خدمة العملاء. لا نبيع بياناتك لأطراف ثالثة.',
  },
]

export function PoliciesPage() {
  return (
    <div className="container-narrow py-12 max-w-2xl">
      <div className="flex justify-start mb-4">
        <Logo compact />
      </div>
      <p className="section-label">السياسات</p>
      <h1 className="font-display text-3xl font-bold text-ink mb-8">سياسات المتجر</h1>
      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-xl font-bold text-rose-brand">{s.title}</h2>
            <p className="mt-2 text-surface-muted leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
      <Link to="/" className="btn-outline inline-block mt-10">
        العودة للرئيسية
      </Link>
    </div>
  )
}
