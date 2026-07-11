import { useStore } from '../context/StoreContext'

function isProductionStorefront(): boolean {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'naffas.shop' || h === 'www.naffas.shop'
}

export function ApiStatusBanner() {
  const { apiReachable, ready } = useStore()
  if (!ready || apiReachable || !isProductionStorefront()) return null

  return (
    <div
      role="alert"
      className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950 leading-relaxed"
    >
      <strong className="font-semibold">Notice:</strong> Our order server is temporarily unreachable.
      Browsing still works, but <strong>checkout is paused</strong> until the server is back. If this
      continues, contact us via the Contact page or email support@naffas.shop.
    </div>
  )
}
