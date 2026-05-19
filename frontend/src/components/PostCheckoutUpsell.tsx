import { useEffect, useState } from 'react'
import { acceptUpsell } from '../lib/api'
import { getLastEventId, trackPurchase } from '../lib/analytics'
import { useNavigate } from 'react-router-dom'

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
        <p className="text-gold-accent font-bold mb-2">عرض حصري — ينتهي خلال {seconds} ثانية</p>
        <h3 className="font-display text-2xl font-bold mb-4">{upsell.title_ar}</h3>
        <p className="text-ink/50 line-through text-lg">${upsell.anchor}</p>
        <p className="text-4xl font-bold text-rose-brand my-2">${upsell.price}</p>
        <p className="text-sm text-ink/70 mb-6">خصم 50% — بس مع هالطلب، ما راح يتكرر</p>
        <div className="flex flex-col gap-3">
          <button type="button" disabled={loading} onClick={accept} className="btn-primary w-full">
            نعم أضيفيه لطلبي
          </button>
          <button type="button" onClick={() => finish(false)} className="text-sm text-ink/60 underline">
            لا شكراً
          </button>
        </div>
      </div>
    </div>
  )
}
