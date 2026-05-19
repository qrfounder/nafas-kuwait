import { useSearchParams, Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ORDER_STEPS } from '../data/socialProof'

export function ThankYouPage() {
  const [params] = useSearchParams()
  const order = params.get('order') || ''
  const upsell = params.get('upsell')

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="p-4 border-b border-surface-border">
        <Logo />
      </header>
      <div className="flex-1 max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-success/15 text-success text-3xl flex items-center justify-center mx-auto mb-6">
          ✓
        </div>
        <h1 className="font-display text-3xl font-bold text-ink">تم استلام طلبج</h1>
        {order && (
          <p className="mt-2 text-ink/70">
            رقم الطلب: <strong className="text-rose-brand">{order}</strong>
          </p>
        )}
        {upsell && <p className="mt-2 text-sm text-rose-brand">تمت إضافة العرض الخاص لطلبج</p>}
        <p className="mt-6 text-ink/80 leading-relaxed">
          راح يتصلون عليج من فريق التأكيد خلال ساعات العمل — نؤكد العنوان وموعد التوصيل. الدفع عند
          الاستلام فقط.
        </p>

        <ol className="mt-8 text-right space-y-3 text-sm">
          {ORDER_STEPS.map((s) => (
            <li key={s.step} className="flex gap-3 items-start bg-white rounded-lg p-3 border border-surface-border">
              <span className="w-7 h-7 rounded-full bg-rose-light text-rose-brand flex items-center justify-center text-xs font-bold shrink-0">
                {s.step}
              </span>
              <div>
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="text-surface-muted mt-0.5">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <Link to="/collection" className="btn-primary inline-block mt-10">
          تسوقي أكثر
        </Link>
        <Link to="/contact" className="btn-outline inline-block mt-3 mr-3">
          تواصلي معنا
        </Link>
      </div>
    </div>
  )
}
