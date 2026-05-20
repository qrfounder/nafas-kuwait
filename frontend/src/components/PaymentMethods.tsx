import {
  PAYMENT_METHODS,
  PAYMENT_METHODS_COMPACT,
  type PaymentMethod,
} from '../data/paymentMethods'

type Props = {
  variant?: 'row' | 'compact' | 'footer'
  showCaption?: boolean
}

/** Standard e-commerce badge size (Shopify payment_icons ratio). */
const BADGE_W = 46
const BADGE_H = 30

function PaymentBadge({ method }: { method: PaymentMethod }) {
  return (
    <img
      src={method.src}
      alt={method.alt}
      width={BADGE_W}
      height={BADGE_H}
      className="h-full w-full object-contain object-center p-0.5"
      loading="lazy"
      decoding="async"
    />
  )
}

export function PaymentMethods({ variant = 'row', showCaption = false }: Props) {
  const methods = variant === 'row' ? PAYMENT_METHODS : PAYMENT_METHODS_COMPACT
  const gap = variant === 'footer' ? 'gap-2' : 'gap-2.5'

  return (
    <div className={variant === 'row' ? 'w-full' : ''}>
      {showCaption && (
        <p className="text-xs text-surface-muted text-center mb-3">
          ادفعي عند الباب. كاش أو KNET مع المندوب. فيزا وماستركارد عند التسليم إذا متوفرة
        </p>
      )}
      <div
        className={`flex flex-wrap items-center justify-center ${gap}`}
        role="list"
        aria-label="طرق الدفع المقبولة"
      >
        {methods.map((m) => (
          <span
            key={m.id}
            role="listitem"
            className="inline-flex items-center justify-center rounded-md overflow-hidden bg-white border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
            style={{ width: BADGE_W, height: BADGE_H, minWidth: BADGE_W, minHeight: BADGE_H }}
          >
            <PaymentBadge method={m} />
          </span>
        ))}
      </div>
    </div>
  )
}
