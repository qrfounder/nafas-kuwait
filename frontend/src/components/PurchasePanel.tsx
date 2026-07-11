import { useMemo } from 'react'
import type { Product, Tier } from '../data/products'
import { singlesInBundle, SKU_HINTS, SKU_LABELS } from '../data/products'
import { useStore } from '../context/StoreContext'
import { BundleContents } from './BundleContents'
import { Price } from './Price'
import { formatUsd } from '../lib/currency'
import { skuImage, skuShowcaseImage } from '../data/images'
import { preserveScrollPosition } from '../lib/scroll'
import { OptimizedImage } from './OptimizedImage'

export type PurchaseMode = 'bundle' | 'single'

type Props = {
  product: Product
  mode: PurchaseMode
  onModeChange: (mode: PurchaseMode) => void
  selectedTier: Tier
  onTierChange: (tier: Tier) => void
  selectedSingle: string | null
  onSingleChange: (sku: string) => void
  /** Quantity when adding a single SKU (1–3). */
  singleQty: number
  onSingleQtyChange: (qty: 1 | 2 | 3) => void
  onAddBundle: () => void
  onAddSingle: (sku: string) => void
}

export function PurchasePanel({
  product,
  mode,
  onModeChange,
  selectedTier,
  onTierChange,
  selectedSingle,
  onSingleChange,
  singleQty,
  onSingleQtyChange,
  onAddBundle,
  onAddSingle,
}: Props) {
  const { skus } = useStore()
  const skuCatalog = useMemo(
    () =>
      Object.fromEntries(
        skus.map((s) => [
          s.sku,
          { sku: s.sku, title_ar: s.label_ar, hint_ar: s.hint_ar, price: s.price, anchor: s.anchor },
        ]),
      ),
    [skus],
  )
  const singles = singlesInBundle(product, skuCatalog)

  const modeTabClass = (active: boolean) =>
    [
      'relative flex flex-1 flex-col items-center justify-center gap-1 rounded-none px-3 py-3.5 text-center transition-colors duration-200 min-h-[4.5rem]',
      active
        ? 'border border-ink bg-white text-ink'
        : 'border border-surface-border bg-cream/40 text-surface-muted hover:border-ink/40 hover:text-ink',
    ].join(' ')

  return (
    <div className="space-y-4">
      <p className="text-center text-[11px] font-medium tracking-wide text-surface-muted">How do you want to order?</p>
      <div
        className="grid grid-cols-2 gap-2 sm:gap-3 border border-surface-border bg-cream/50 p-2"
        role="tablist"
        aria-label="Purchase mode"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'bundle'}
          className={modeTabClass(mode === 'bundle')}
          onClick={() => preserveScrollPosition(() => onModeChange('bundle'))}
        >
          {mode === 'bundle' && (
            <span
              className="absolute top-2 end-2 h-2 w-2 rounded-full bg-rose-brand shadow-sm"
              aria-hidden
            />
          )}
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              mode === 'bundle' ? 'bg-rose-brand text-white' : 'bg-cream border border-surface-border text-surface-muted'
            }`}
            aria-hidden
          >
            Kit
          </span>
          <span className="text-sm font-bold leading-tight">Bundle</span>
          <span className={`text-[10px] leading-snug ${mode === 'bundle' ? 'text-rose-brand/90' : 'text-surface-muted'}`}>
            All pieces together
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'single'}
          className={modeTabClass(mode === 'single')}
          onClick={() => preserveScrollPosition(() => onModeChange('single'))}
        >
          {mode === 'single' && (
            <span
              className="absolute top-2 end-2 h-2 w-2 rounded-full bg-rose-brand shadow-sm"
              aria-hidden
            />
          )}
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              mode === 'single' ? 'bg-rose-brand text-white' : 'bg-cream border border-surface-border text-surface-muted'
            }`}
            aria-hidden
          >
            1
          </span>
          <span className="text-sm font-bold leading-tight">Single piece</span>
          <span className={`text-[10px] leading-snug ${mode === 'single' ? 'text-rose-brand/90' : 'text-surface-muted'}`}>
            One item only
          </span>
        </button>
      </div>

      <div className="min-h-[26rem] sm:min-h-[24rem]">
      {mode === 'bundle' ? (
        <>
          <BundleContents
            includes={product.includes}
            boxCount={selectedTier.tier}
            layout="buy-panel"
            priority
          />
          <div className="space-y-2" role="radiogroup" aria-label="Kit quantity">
            <p className="font-semibold text-sm text-ink">Choose quantity:</p>
            {product.tiers.map((t) => (
              <button
                key={t.tier}
                type="button"
                role="radio"
                aria-checked={selectedTier.tier === t.tier}
                className={`block w-full text-left p-4 rounded-none border cursor-pointer transition relative ${
                  selectedTier.tier === t.tier
                    ? 'border-ink bg-rose-light/30'
                    : 'border-surface-border hover:border-ink/40'
                }`}
                onClick={() => preserveScrollPosition(() => onTierChange(t))}
              >
                {t.tier === 3 && (
                  <span className="absolute -top-2 left-4 text-[10px] bg-ink text-white px-2 py-0.5 font-medium tracking-wide uppercase">
                    Most popular
                  </span>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{t.label_ar}</span>
                  {t.badge && (
                    <span className="text-xs bg-cream text-surface-muted px-2 py-0.5 rounded border border-surface-border">
                      {t.badge}
                    </span>
                  )}
                </div>
                <div className="mt-1">
                  <Price usd={t.price} anchorUsd={t.anchor} size="md" />
                </div>
              </button>
            ))}
          </div>
          <button type="button" onClick={onAddBundle} className="btn-primary w-full">
            Add kit ({formatUsd(selectedTier.price)})
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-surface-muted leading-relaxed">
            Want just one piece? Pick what fits. The photo shows what ships.
          </p>
          <fieldset className="relative z-10 space-y-2 max-md:pb-2 border-0 p-0 m-0 min-w-0">
            <legend className="sr-only">Choose a single piece</legend>
            {singles.map((item) => {
              const active = selectedSingle === item.sku
              const inputId = `single-${product.slug}-${item.sku}`
              return (
                <label
                  key={item.sku}
                  htmlFor={inputId}
                  className={`relative flex w-full cursor-pointer gap-3 rounded-none border p-3 text-left transition touch-manipulation items-start ${
                    active
                      ? 'border-ink bg-rose-light/30'
                      : 'border-surface-border bg-white hover:border-ink/40'
                  }`}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={`single-sku-${product.slug}`}
                    className="sr-only"
                    checked={active}
                    onChange={() => onSingleChange(item.sku)}
                  />
                  <span className="block h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-surface-border bg-cream pointer-events-none">
                    <OptimizedImage
                      src={skuShowcaseImage(item.sku)}
                      alt=""
                      inert
                      pictureClassName="block h-full w-full"
                      className="h-full w-full object-cover"
                      sizes="64px"
                      onError={(e) => {
                        e.currentTarget.src = skuImage(item.sku)
                        e.currentTarget.className = 'h-full w-full object-contain bg-cream p-1'
                      }}
                    />
                  </span>
                  <div className="min-w-0 flex-1 pointer-events-none">
                    <p className="text-sm font-semibold text-ink leading-snug">{item.title_ar}</p>
                    {SKU_HINTS[item.sku] && (
                      <p className="text-[11px] text-surface-muted mt-0.5 leading-snug">
                        {SKU_HINTS[item.sku]}
                      </p>
                    )}
                    <div className="mt-2">
                      <Price usd={item.price} anchorUsd={item.anchor} size="sm" />
                    </div>
                  </div>
                </label>
              )
            })}
          </fieldset>
          {selectedSingle && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-ink">Choose quantity</p>
              <p className="text-[11px] text-surface-muted leading-relaxed">
                Same piece: useful if you want an extra for someone else without buying the full kit twice.
              </p>
              <div
                className="flex rounded-xl border border-surface-border bg-cream p-1 gap-1"
                role="group"
                aria-label="Piece quantity"
              >
                {([1, 2, 3] as const).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => preserveScrollPosition(() => onSingleQtyChange(q))}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                      singleQty === q ? 'bg-white text-ink shadow-sm' : 'text-surface-muted'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            type="button"
            disabled={!selectedSingle}
            onClick={() => selectedSingle && onAddSingle(selectedSingle)}
            className="btn-primary w-full disabled:opacity-50 mt-4"
          >
            {selectedSingle
              ? (() => {
                  const unit = singles.find((s) => s.sku === selectedSingle)!.price
                  return `Add ${SKU_LABELS[selectedSingle]} (${formatUsd(unit * singleQty)})`
                })()
              : 'Choose a piece'}
          </button>
          <p className="text-[11px] text-center text-surface-muted">
            Want a full kit or mixed pieces? Switch back to Bundle. usually a better value.
          </p>
        </>
      )}
      </div>
    </div>
  )
}

export function heroGallerySkus(
  product: Product,
  mode: PurchaseMode,
  selectedSingle: string | null,
): string[] {
  if (mode === 'single' && selectedSingle) return [selectedSingle]
  return product.includes
}
