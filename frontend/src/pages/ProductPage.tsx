import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  SINGLE_SKU_PRICES,
  singlesInBundle,
  SKU_TRUST_LINE,
  type Tier,
} from '../data/products'
import { getProductEmotional } from '../data/productEmotionalImages'
import { EmotionalImage } from '../components/EmotionalImage'
import { BeforeAfterPair } from '../components/BeforeAfterPair'
import { WhatsInBox } from '../components/WhatsInBox'
import { ProductShowcase } from '../components/ProductShowcase'
import { PurchasePanel, type PurchaseMode } from '../components/PurchasePanel'
import { useCart } from '../context/CartContext'
import { trackAddToCart, trackViewContent } from '../lib/analytics'
import { MicroTrust } from '../components/MicroTrust'
import { PaymentMethods } from '../components/PaymentMethods'
import { ReviewsSection } from '../components/ReviewsSection'
import { RatingSummary } from '../components/RatingSummary'
import { formatKwd } from '../lib/currency'
import { useScarcity } from '../hooks/useScarcity'
import type { ReviewPage } from '../data/socialProof'
import { useStore } from '../context/StoreContext'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { getProduct } = useStore()
  const product = slug ? getProduct(slug) : undefined
  const emotional = slug ? getProductEmotional(slug) : undefined
  const { setBundle, setSinglePiece, setCartOpen } = useCart()
  const { stockLeft } = useScarcity()
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('bundle')
  const [selectedSingle, setSelectedSingle] = useState<string | null>(null)
  const [singleQty, setSingleQty] = useState<1 | 2 | 3>(1)

  useEffect(() => {
    setSingleQty(1)
  }, [selectedSingle])

  useEffect(() => {
    if (product) {
      setSelectedTier(product.tiers[0])
      const first = singlesInBundle(product)[0]?.sku ?? null
      setSelectedSingle(first)
      trackViewContent(product.slug, product.base_price)
    }
  }, [product])

  if (!product || !selectedTier || !emotional) {
    return <p className="text-center py-20 text-surface-muted">المنتج غير موجود</p>
  }

  const focusSku =
    purchaseMode === 'single' && selectedSingle
      ? selectedSingle
      : product.includes[0]

  const stickyPrice =
    purchaseMode === 'bundle'
      ? selectedTier.price
      : selectedSingle
        ? (SINGLE_SKU_PRICES[selectedSingle]?.price ?? 0) * singleQty
        : 0

  const addBundle = () => {
    setBundle(product, selectedTier)
    trackAddToCart(selectedTier.price, product.slug)
    setCartOpen(true)
  }

  const addSingle = (sku: string) => {
    const unit = SINGLE_SKU_PRICES[sku].price
    setSinglePiece(product, sku, singleQty)
    trackAddToCart(unit * singleQty, `${product.slug}:${sku}x${singleQty}`)
    setCartOpen(true)
  }

  return (
    <div className="pb-24">
      <div className="container-narrow py-6 grid md:grid-cols-2 gap-10 items-start">
        <ProductShowcase
          key={`${purchaseMode}-${focusSku}`}
          frame={emotional.hero}
          focusSku={focusSku}
          variant={purchaseMode}
          priority
        />
        <div>
          <RatingSummary compact />
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-2 text-ink">{product.title_ar}</h1>
          <p className="text-surface-muted mt-2 leading-relaxed">{product.subtitle_ar}</p>
          <div className="mt-4">
            <PurchasePanel
              product={product}
              mode={purchaseMode}
              onModeChange={setPurchaseMode}
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
              selectedSingle={selectedSingle}
              onSingleChange={setSelectedSingle}
              singleQty={singleQty}
              onSingleQtyChange={setSingleQty}
              stockLeft={stockLeft}
              onAddBundle={addBundle}
              onAddSingle={addSingle}
            />
          </div>
          <MicroTrust />
          <div className="mt-4 pt-4">
            <PaymentMethods variant="compact" />
          </div>
        </div>
      </div>

      <section className="section container-narrow border-t border-surface-border">
        <p className="section-label">قبل، بعد</p>
        <h2 className="font-display text-2xl font-bold mb-6">نفس القصة، بس النهاية مختلفة</h2>
        <BeforeAfterPair before={emotional['pain-before']} after={emotional['pain-after']} />
        <EmotionalImage
          frame={emotional.transformation}
          aspect="21/9"
          className="mt-6 hidden md:block"
          showCaption
        />
      </section>

      <section className="section container-narrow grid md:grid-cols-2 gap-10 items-center border-t border-surface-border">
        <div>
          <p className="section-label">ليش نفس؟</p>
          <h2 className="font-display text-2xl font-bold">تعرفين هالإحساس؟</h2>
          <p className="mt-4 text-surface-muted leading-relaxed">{emotional.whyBody}</p>
        </div>
        <EmotionalImage frame={emotional['pain-before']} aspect="4/3" variant="before" />
      </section>

      <section className="section container-narrow border-t border-surface-border">
        <p className="section-label">تأكيد المحتوى</p>
        <h2 className="font-display text-2xl font-bold">
          {purchaseMode === 'single' ? 'تقدرين تطلبين قطعة وحدة أو البوكس كامل' : 'محتويات البوكس الكامل'}
        </h2>
        <p className="mt-3 text-surface-muted leading-relaxed max-w-xl">{emotional.boxBody}</p>
        <div className="mt-8">
          <WhatsInBox includes={product.includes} boxCount={selectedTier.tier} />
        </div>
        <p className="text-xs text-surface-muted mt-4 leading-relaxed">{SKU_TRUST_LINE}</p>
      </section>

      <section className="section container-narrow grid md:grid-cols-2 gap-10 items-center border-t border-surface-border">
        <EmotionalImage frame={emotional['pain-after']} aspect="4/3" variant="after" />
        <div>
          <p className="section-label">كيف تستخدمينه؟</p>
          <h2 className="font-display text-2xl font-bold">روتين ١٥-٢٠ دقيقة بالبيت</h2>
          <p className="mt-4 text-surface-muted leading-relaxed">{emotional.howBody}</p>
          <p className="mt-3 text-xs text-surface-muted border-t border-surface-border pt-3">
            راحة منزلية فقط، مو علاج طبي. النتيجة تختلف من شخص لشخص.
          </p>
        </div>
      </section>

      {slug && (
        <ReviewsSection
          page={slug as ReviewPage}
          title="تعليقات على هالمنتج"
          subtitle="عميلات جربن نفس البوكس أو قطعة وحدة. اقرئي اللي يشبه سؤالج قبل ما تطلبين."
          className="section border-t border-surface-border"
        />
      )}

      <section className="container-narrow py-8 border-t border-surface-border">
        <PaymentMethods variant="row" showCaption />
      </section>

      <div className="fixed bottom-0 inset-x-0 md:hidden bg-white border-t border-surface-border p-3 flex justify-between items-center z-30">
        <div>
          <span className="font-bold text-rose-brand block">{formatKwd(stickyPrice)}</span>
          <span className="text-[10px] text-surface-muted">
            {purchaseMode === 'single' ? `قطعة ×${singleQty}` : 'البوكس'}، ادفعي عند الباب
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            purchaseMode === 'single'
              ? selectedSingle && addSingle(selectedSingle)
              : addBundle()
          }
          className="btn-primary text-sm py-2.5 px-5"
        >
          أضيفي للسلة
        </button>
      </div>
    </div>
  )
}
