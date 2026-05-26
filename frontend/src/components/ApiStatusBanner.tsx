import { useStore } from '../context/StoreContext'

export function ApiStatusBanner() {
  const { apiReachable, ready } = useStore()
  if (!ready || apiReachable) return null

  return (
    <div
      role="alert"
      className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 leading-relaxed"
    >
      <strong className="font-semibold">تنبيه:</strong> خادم الطلبات غير متصل حالياً. التصفح يعمل، لكن{' '}
      <strong>إتمام الطلب موقوف مؤقتاً</strong> حتى يعود الخادم. إذا استمرّت المشكلة، تواصلي معنا عبر صفحة
      التواصل.
    </div>
  )
}
