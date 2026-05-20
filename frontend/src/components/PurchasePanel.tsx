import { useMemo } from 'react'
import type { Product, Tier } from '../data/products'
import { singlesInBundle, SKU_HINTS, SKU_LABELS } from '../data/products'
import { useStore } from '../context/StoreContext'
import { BundleContents } from './BundleContents'
import { InventoryNote } from './InventoryNote'
import { Price } from './Price'
import { formatKwd } from '../lib/currency'
import { skuImage, skuShowcaseImage } from '../data/images'

export type PurchaseMode = 'bundle' | 'single'

type Props = {
  product: Product
  mode: PurchaseMode
  onModeChange: (mode: PurchaseMode) => void
  selectedTier: Tier
  onTierChange: (tier: Tier) => void
  selectedSingle: string | null
  onSingleChange: (sku: string) => void
  /** Quantity when adding a single SKU (١–٣). */
  singleQty: number
  onSingleQtyChange: (qty: 1 | 2 | 3) => void
  stockLeft: number
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
  stockLeft,
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
      'relative flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 py-3.5 text-center transition-all duration-200 min-h-[4.5rem]',
      active
        ? 'border-2 border-rose-brand bg-white text-ink shadow-md shadow-rose-brand/15 ring-2 ring-rose-brand/20'
        : 'border border-surface-border/90 bg-white/50 text-surface-muted hover:border-rose-brand/40 hover:bg-rose-light/30 hover:text-ink hover:shadow-sm',
    ].join(' ')

  return (
    <div className="space-y-4">
      <p className="text-center text-[11px] font-semibold text-surface-muted">اختاري طريقة الطلب</p>
      <div
        className="grid grid-cols-2 gap-2 sm:gap-3 rounded-2xl border border-rose-brand/15 bg-cream/80 p-2 shadow-inner"
        role="tablist"
        aria-label="طريقة الشراء"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'bundle'}
          className={modeTabClass(mode === 'bundle')}
          onClick={() => onModeChange('bundle')}
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
            بوكس
          </span>
          <span className="text-sm font-bold leading-tight">البوكس الكامل</span>
          <span className={`text-[10px] leading-snug ${mode === 'bundle' ? 'text-rose-brand/90' : 'text-surface-muted'}`}>
            كل القطع مع بعض
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'single'}
          className={modeTabClass(mode === 'single')}
          onClick={() => onModeChange('single')}
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
            ١
          </span>
          <span className="text-sm font-bold leading-tight">قطعة واحدة</span>
          <span className={`text-[10px] leading-snug ${mode === 'single' ? 'text-rose-brand/90' : 'text-surface-muted'}`}>
            اختاري قطعة بس
          </span>
        </button>
      </div>

      {mode === 'bundle' ? (
        <>
          <BundleContents
            includes={product.includes}
            boxCount={selectedTier.tier}
            layout="buy-panel"
            priority
          />
          <InventoryNote stockLeft={stockLeft} compact />
          <div className="space-y-2">
            <p className="font-semibold text-sm text-ink">اختاري الكمية:</p>
            {product.tiers.map((t) => (
              <label
                key={t.tier}
                className={`block p-4 rounded-lg border cursor-pointer transition relative ${
                  selectedTier.tier === t.tier
                    ? 'border-rose-brand bg-rose-light/40'
                    : 'border-surface-border hover:border-rose-brand/30'
                }`}
              >
                <input
                  type="radio"
                  name="tier"
                  className="sr-only"
                  checked={selectedTier.tier === t.tier}
                  onChange={() => onTierChange(t)}
                />
                {t.tier === 3 && (
                  <span className="absolute -top-2 left-4 text-[10px] bg-gold-accent/90 text-ink px-2 py-0.5 rounded font-semibold">
                    الأكثر طلباً
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
              </label>
            ))}
          </div>
          <button type="button" onClick={onAddBundle} className="btn-primary w-full">
            أضيفي البوكس ({formatKwd(selectedTier.price)})
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-surface-muted leading-relaxed">
            تبين قطعة وحدة بس؟ اختاري اللي يناسب ألمج. الصورة هي المنتج اللي يوصلج.
          </p>
          <ul className="space-y-2">
            {singles.map((item) => {
              const active = selectedSingle === item.sku
              return (
                <li key={item.sku}>
                  <button
                    type="button"
                    onClick={() => onSingleChange(item.sku)}
                    className={`w-full text-right rounded-xl border p-3 transition flex gap-3 items-start ${
                      active
                        ? 'border-rose-brand bg-rose-light/40 ring-1 ring-rose-brand/20'
                        : 'border-surface-border bg-white hover:border-rose-brand/30'
                    }`}
                  >
                    <img
                      src={skuShowcaseImage(item.sku)}
                      alt={item.title_ar}
                      className="w-16 h-16 object-cover shrink-0 rounded-lg border border-surface-border"
                      onError={(e) => {
                        e.currentTarget.src = skuImage(item.sku)
                        e.currentTarget.className =
                          'w-16 h-16 object-contain shrink-0 rounded-lg border border-surface-border bg-cream p-1'
                      }}
                    />
                    <div className="min-w-0 flex-1">
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
                  </button>
                </li>
              )
            })}
          </ul>
          {selectedSingle && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-ink">اختاري الكمية</p>
              <p className="text-[11px] text-surface-muted leading-relaxed">
                نفس القطعة: مناسب لو تبين وحدة زيادة لأختج أو لأمك، بدون ما تشتري البوكس كامل مرتين.
              </p>
              <div
                className="flex rounded-xl border border-surface-border bg-cream p-1 gap-1"
                role="group"
                aria-label="كمية القطعة"
              >
                {([1, 2, 3] as const).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => onSingleQtyChange(q)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                      singleQty === q ? 'bg-white text-ink shadow-sm' : 'text-surface-muted'
                    }`}
                  >
                    {q === 1 ? '١' : q === 2 ? '٢' : '٣'}
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
                  return `أضيفي ${SKU_LABELS[selectedSingle]} (${formatKwd(unit * singleQty)})`
                })()
              : 'اختاري قطعة'}
          </button>
          <p className="text-[11px] text-center text-surface-muted">
            تبين بوكس كامل أو قطع مختلفة مع بعض؟ ارجعي للبوكس الكامل، أوفر لج.
          </p>
        </>
      )}
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
