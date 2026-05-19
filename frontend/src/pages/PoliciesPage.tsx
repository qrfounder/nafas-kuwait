import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'الشحن والتوصيل',
    body: 'نوصّل داخل الكويت خلال 24–48 ساعة لمعظم المناطق بعد تأكيد الطلب هاتفياً. عنوان التوصيل يُؤكَّد عند الطلب وعند المكالمة.',
  },
  {
    title: 'الدفع',
    body: 'الدفع عند الاستلام فقط (COD). لا نطلب بطاقة ائتمان أونلاين. يمكن الدفع كاش أو KNET حسب إمكانية مندوب التوصيل.',
  },
  {
    title: 'الاستبدال',
    body: 'إذا وصل المنتج معيباً، تواصلي معنا خلال 7 أيام من الاستلام عبر واتساب أو صفحة التواصل — نرتب الاستبدال.',
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
