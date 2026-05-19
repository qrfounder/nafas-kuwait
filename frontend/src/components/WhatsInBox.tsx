import { skuImage } from '../data/images'
import { SKU_HINTS, SKU_LABELS } from '../data/products'

export function WhatsInBox({ includes }: { includes: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {includes.map((sku) => (
        <div key={sku} className="card overflow-hidden">
          <div className="aspect-square relative bg-cream">
            <img
              src={skuImage(sku)}
              alt={SKU_LABELS[sku]}
              className="absolute inset-0 w-full h-full object-contain p-2"
              loading="lazy"
            />
          </div>
          <div className="p-2.5 text-center">
            <p className="text-xs font-medium text-ink leading-snug">{SKU_LABELS[sku]}</p>
            {SKU_HINTS[sku] && (
              <p className="text-[10px] text-surface-muted mt-1 leading-snug">{SKU_HINTS[sku]}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
