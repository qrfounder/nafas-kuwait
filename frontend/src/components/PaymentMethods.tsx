const METHODS = [
  { src: '/payments/cod.svg', alt: 'دفع عند الاستلام', label: 'COD' },
  { src: '/payments/knet.svg', alt: 'KNET', label: 'KNET' },
  { src: '/payments/kuwait-delivery.svg', alt: 'توصيل الكويت', label: 'توصيل' },
  { src: '/payments/phone-confirm.svg', alt: 'تأكيد هاتفي', label: 'تأكيد' },
]

type Props = {
  variant?: 'row' | 'compact' | 'footer'
  showCaption?: boolean
}

export function PaymentMethods({ variant = 'row', showCaption = false }: Props) {
  const imgClass =
    variant === 'compact' ? 'h-7 w-auto' : variant === 'footer' ? 'h-6 w-auto' : 'h-8 w-auto'

  return (
    <div className={variant === 'row' ? 'w-full' : ''}>
      {showCaption && variant === 'row' && (
        <p className="text-xs text-surface-muted text-center mb-3">
          الدفع عند الاستلام · KNET مع المندوب · بدون بطاقة أونلاين
        </p>
      )}
      <div
        className={`flex flex-wrap items-center justify-center gap-2 ${
          variant === 'footer' ? 'opacity-90' : ''
        }`}
      >
        {METHODS.map((m) => (
          <img
            key={m.label}
            src={m.src}
            alt={m.alt}
            className={imgClass}
            loading="lazy"
            width={88}
            height={32}
          />
        ))}
      </div>
    </div>
  )
}
