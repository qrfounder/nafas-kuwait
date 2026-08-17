import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { inferLiveStage, sendLiveHeartbeat } from '../lib/livePresence'

/** Keeps in-memory live sessions fresh for Mojourney Live View (every 15s). */
export function LiveHeartbeat() {
  const location = useLocation()
  const { itemCount, checkoutOpen, product } = useCart()

  useEffect(() => {
    if (location.pathname.startsWith('/mojourney') || location.pathname.startsWith('/mojo')) return

    const path = location.pathname + location.search
    const product_slug = product?.slug ?? null

    const tick = () => {
      const stage = inferLiveStage({ path, itemCount, checkoutOpen })
      sendLiveHeartbeat({ path, stage, product_slug })
    }

    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [location.pathname, location.search, itemCount, checkoutOpen, product?.slug])

  return null
}
