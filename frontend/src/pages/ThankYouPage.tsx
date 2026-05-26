import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { trackStoreEvent } from '../lib/visitorAnalytics'
import { Logo } from '../components/Logo'
import { ORDER_STEPS } from '../data/socialProof'

export function ThankYouPage() {
  const [params] = useSearchParams()
  const order = params.get('order') || ''
  const upsell = params.get('upsell')

  useEffect(() => {
    if (!order) return
    const key = `nafas_purchase_logged_${order}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      /* ignore */
    }
    trackStoreEvent('purchase', {
      path: `/thank-you?order=${order}`,
      metadata: { order_number: order, upsell: Boolean(upsell), source: 'thank_you_page' },
    })
  }, [order, upsell])

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="p-4 border-b border-surface-border bg-white/80 backdrop-blur-sm">
        <Logo compact />
      </header>
      <div className="flex-1 w-full max-w-lg mx-auto px-4 py-10 sm:py-14">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-success/15 text-success text-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            ✓
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">تم استلام طلبج</h1>
          {order && (
            <p className="mt-3 text-sm text-ink/75">
              رقم الطلب:{' '}
              <strong className="text-rose-brand font-mono tracking-tight" dir="ltr">
                {order}
              </strong>
            </p>
          )}
          {upsell && (
            <p className="mt-2 text-sm font-medium text-rose-brand">تمت إضافة العرض الإضافي لطلبج</p>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-rose-brand/20 bg-rose-light/20 px-4 py-4 text-right">
          <p className="text-sm font-semibold text-ink">الخطوة الجاية: مكالمة من مركز الاتصال</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink/85">
            خلّي جوالج <strong className="text-rose-brand">شغال وقريب</strong>، نتصل خلال{' '}
            <strong className="text-rose-brand">ساعة تقريباً</strong> في أوقات الدوام لنؤكد عنوان التوصيل ونرتب
            الشحن. لو الرقم مشغول أو مغلق، يتأخر الطلب.
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-surface-muted">
            موعد وصول الطرد للبيت غالباً بين <strong className="text-ink/80">يوم وسبعة أيام</strong> بعد ما نكمّل
            المكالمة، حسب منطقتج والمندوب.
          </p>
        </div>

        <p className="mt-6 text-sm text-ink/80 leading-relaxed text-center">
          الاستبدال أو الإرجاع عند العيب أو التلف ضمن سياسة المتجر لكل الطلبات. الإضافات الاختيارية بالطلب (إن
          وجدت) تعني أولوية في التجهيز أو متابعة أسرع للتلف أثناء الشحن، مو بدال الحقوق الأساسية.
        </p>

        <p className="mt-4 text-xs text-surface-muted text-center leading-relaxed">
          الدفع عند استلام الطرد فقط، كاش أو KNET حسب المندوب.
        </p>

        <div className="mt-10">
          <p className="text-xs font-semibold text-surface-muted text-center mb-3">ملخص الرحلة</p>
          <ol className="space-y-2.5">
            {ORDER_STEPS.map((s) => (
              <li
                key={s.step}
                className="flex gap-3 items-start bg-white rounded-xl p-3.5 border border-surface-border shadow-sm"
              >
                <span className="w-8 h-8 rounded-full bg-rose-light text-rose-brand flex items-center justify-center text-xs font-bold shrink-0">
                  {s.step}
                </span>
                <div className="min-w-0 text-right flex-1">
                  <p className="font-semibold text-ink text-sm">{s.title}</p>
                  <p className="text-surface-muted text-xs mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-stretch">
          <Link to="/collection" className="btn-primary text-center py-3">
            تسوقي أكثر
          </Link>
          <Link to="/contact" className="btn-outline text-center py-3">
            تواصلي معنا
          </Link>
        </div>
      </div>
    </div>
  )
}
