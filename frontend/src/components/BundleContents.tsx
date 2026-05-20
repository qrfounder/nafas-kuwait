import { skuShowcaseImage } from '../data/images'
import { SKU_HINTS, SKU_LABELS } from '../data/products'

type Props = {
  includes: string[]
  boxCount?: number
  layout?: 'gallery' | 'buy-panel' | 'cards' | 'preview'
  priority?: boolean
  galleryTitle?: string
  /** No product photos (ad landing / policy-safe checkout). */
  textOnly?: boolean
}

function tierNote(boxCount: number) {
  if (boxCount <= 1) return null
  const ar =
    boxCount === 2
      ? 'بوكسين: نفس القطع التالية في كل بوكس'
      : `${boxCount} بوكسات: نفس القطع التالية في كل بوكس`
  return (
    <p className="text-xs text-rose-brand/90 bg-rose-light/30 border border-rose-brand/15 rounded-lg px-3 py-2 leading-relaxed">
      {ar}
    </p>
  )
}

function SkuVisual({
  sku,
  size,
  priority,
  className = '',
}: {
  sku: string
  size: 'sm' | 'md' | 'lg' | 'card'
  priority?: boolean
  className?: string
}) {
  const src = skuShowcaseImage(sku)
  const label = SKU_LABELS[sku]

  if (size === 'card') {
    return (
      <img
        src={src}
        alt={label}
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  const box =
    size === 'lg'
      ? 'w-full h-full min-h-[7rem]'
      : size === 'md'
        ? 'w-16 h-16 shrink-0'
        : 'w-12 h-12 shrink-0'

  return (
    <div className={`relative rounded-lg border border-surface-border overflow-hidden ${box} ${className}`}>
      <img
        src={src}
        alt={label}
        className="absolute inset-0 w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}

export function BundleContents({
  includes,
  boxCount = 1,
  layout = 'cards',
  priority = false,
  galleryTitle,
  textOnly = false,
}: Props) {
  const count = includes.length
  const gridCols =
    count <= 2 ? 'grid-cols-2' : count === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'

  if (layout === 'preview') {
    return (
      <div
        className={`grid ${gridCols} gap-1.5 rounded-lg border border-surface-border bg-white p-2 aspect-[4/3]`}
        aria-label="محتويات البوكس"
      >
        {includes.map((sku) => (
          <div key={sku} className="relative min-h-0 rounded-md overflow-hidden border border-surface-border/60">
            <SkuVisual sku={sku} size="card" />
          </div>
        ))}
      </div>
    )
  }

  if (layout === 'gallery') {
    return (
      <div>
        <p className="text-xs font-semibold text-ink mb-2">
          {galleryTitle ?? (count === 1 ? 'القطعة اللي توصلج' : 'القطع اللي توصلج في البوكس')}
        </p>
        {tierNote(boxCount)}
        <div
          className={`mt-3 grid ${gridCols} gap-2 rounded-xl border border-surface-border p-2 aspect-[4/3]`}
        >
          {includes.map((sku) => (
            <div key={sku} className="relative min-h-0 rounded-lg overflow-hidden">
              <SkuVisual sku={sku} size="card" priority={priority} />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-surface-muted text-center mt-2">
          قبل وبعد بالخلفية، المنتج بالوسط
        </p>
      </div>
    )
  }

  if (layout === 'buy-panel') {
    return (
      <div className="rounded-xl border border-surface-border bg-white p-3 space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-semibold text-ink">
            {textOnly ? 'محتويات الطلب (وصف نصي)' : 'شنو يوصلج بالضبط'}
          </p>
          <span className="text-[10px] text-surface-muted shrink-0">
            {count} {count === 1 ? 'قطعة' : count === 2 ? 'قطعتين' : 'قطع'}
          </span>
        </div>
        {tierNote(boxCount)}
        <ul className="space-y-2.5">
          {includes.map((sku) => (
            <li key={sku} className={textOnly ? 'text-sm leading-relaxed' : 'flex gap-3 items-start'}>
              {!textOnly && <SkuVisual sku={sku} size="md" priority={priority} />}
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-ink leading-snug">{SKU_LABELS[sku]}</p>
                {SKU_HINTS[sku] && (
                  <p className="text-[11px] text-surface-muted mt-0.5 leading-snug">{SKU_HINTS[sku]}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {tierNote(boxCount)}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {includes.map((sku) => (
          <article key={sku} className="card overflow-hidden">
            <div className="aspect-square relative bg-ink/5">
              <SkuVisual sku={sku} size="card" priority={priority} />
            </div>
            <div className="p-2.5 text-center">
              <p className="text-xs font-medium text-ink leading-snug">{SKU_LABELS[sku]}</p>
              {SKU_HINTS[sku] && (
                <p className="text-[10px] text-surface-muted mt-1 leading-snug">{SKU_HINTS[sku]}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
