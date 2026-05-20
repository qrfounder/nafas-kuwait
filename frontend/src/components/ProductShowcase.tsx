import { skuShowcaseImage } from '../data/images'
import type { EmotionalFrame } from '../data/productEmotionalImages'
import { SKU_LABELS } from '../data/products'

type Props = {
  frame: EmotionalFrame
  focusSku: string
  /** Bundle hero uses pre-rendered bundle image; single uses SKU showcase. */
  variant: 'bundle' | 'single'
  priority?: boolean
}

/** One composite image: product large in center, before/after mood in background. */
export function ProductShowcase({ frame, focusSku, variant, priority }: Props) {
  const src = variant === 'single' ? skuShowcaseImage(focusSku) : frame.src
  const alt = variant === 'single' ? SKU_LABELS[focusSku] ?? focusSku : frame.alt

  return (
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-surface-border shadow-card bg-cream">
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
      <figcaption className="mt-2 text-[11px] text-center text-surface-muted leading-snug">
        {frame.caption_ar}
      </figcaption>
    </figure>
  )
}
