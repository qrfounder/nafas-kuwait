import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../context/CartContext'

type Props = {
  /** Section to scroll to (e.g. purchase-offer). */
  offerSectionId: string
  priceLabel: string
  detailLine: string
  ctaLabel: string
  onCta: () => void
}

/**
 * Mobile-only bar while browsing a product (reviews, story sections).
 * Hidden when the offer block is on screen, or when cart/checkout is open.
 */
export function ProductMobileStickyBar({
  offerSectionId,
  priceLabel,
  detailLine,
  ctaLabel,
  onCta,
}: Props) {
  const { cartOpen, checkoutOpen } = useCart()
  const [offerOnScreen, setOfferOnScreen] = useState(true)

  useEffect(() => {
    const el = document.getElementById(offerSectionId)
    if (!el) {
      setOfferOnScreen(false)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => setOfferOnScreen(entry.isIntersecting),
      { root: null, threshold: 0.12, rootMargin: '-56px 0px 0px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [offerSectionId])

  const hidden = cartOpen || checkoutOpen || offerOnScreen
  if (hidden || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-[100] border-t border-surface-border bg-white/98 backdrop-blur-sm shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]"
      role="region"
      aria-label="ملخص السعر"
    >
      <div className="flex items-center justify-between gap-3 p-3 max-w-6xl mx-auto px-4">
        <div className="min-w-0">
          <span className="font-bold text-rose-brand block text-lg leading-tight">{priceLabel}</span>
          <span className="text-[10px] text-surface-muted leading-snug">{detailLine}</span>
        </div>
        <button type="button" onClick={onCta} className="btn-primary shrink-0 text-sm py-2.5 px-5">
          {ctaLabel}
        </button>
      </div>
    </div>,
    document.body,
  )
}
