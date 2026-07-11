import { useEffect, useState } from 'react'
import { acceptUpsell } from '../lib/api'
import { getLastEventId, trackPurchase } from '../lib/analytics'
import { trackStoreEvent } from '../lib/visitorAnalytics'
import { formatUsd } from '../lib/currency'
import { useNavigate } from 'react-router-dom'
import { Logo } from './Logo'

type Upsell = { sku: string; title_ar: string; anchor: number; price: number }

export function PostCheckoutUpsell({
  orderNumber,
  upsell,
  onDone,
}: {
  orderNumber: string
  upsell: Upsell
  onDone: () => void
}) {
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(15)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    trackStoreEvent('upsell_view', { metadata: { order_number: orderNumber } })
  }, [orderNumber])

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id)
          finish(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const finish = (accepted: boolean) => {
    trackStoreEvent(accepted ? 'upsell_accept' : 'upsell_decline', {
      metadata: { order_number: orderNumber },
    })
    onDone()
    navigate(`/thank-you?order=${orderNumber}${accepted ? '&upsell=1' : ''}`)
  }

  const accept = async () => {
    setLoading(true)
    const eventId = getLastEventId()
    try {
      await acceptUpsell(orderNumber, {
        upsell_sku: upsell.sku,
        upsell_price_usd: upsell.price,
        event_id: eventId,
      })
      trackPurchase(upsell.price, eventId)
      finish(true)
    } catch {
      finish(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] bg-ink/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 text-center">
        <div className="flex justify-center mb-5">
          <Logo compact />
        </div>
        <p className="text-gold-accent font-bold mb-2">Optional add-on for this order ({seconds}s)</p>
        <h3 className="font-display text-2xl font-bold mb-4">{upsell.title_ar}</h3>
        <p className="text-ink/50 line-through text-lg">{formatUsd(upsell.anchor)}</p>
        <p className="text-4xl font-bold text-rose-brand my-2">{formatUsd(upsell.price)}</p>
        <p className="text-sm text-ink/70 mb-6">
          Special price with this order only. You can skip without delaying shipment.
        </p>
        <div className="flex flex-col gap-3">
          <button type="button" disabled={loading} onClick={accept} className="btn-primary w-full">
            Yes, add it to my order
          </button>
          <button type="button" onClick={() => finish(false)} className="text-sm text-ink/60 underline">
            No thanks
          </button>
        </div>
      </div>
    </div>
  )
}
