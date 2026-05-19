import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct, SKU_TRUST_LINE, type Tier } from '../data/products'
import { getProductEmotional } from '../data/productEmotionalImages'
import { EmotionalImage } from '../components/EmotionalImage'
import { BeforeAfterPair } from '../components/BeforeAfterPair'
import { WhatsInBox } from '../components/WhatsInBox'
import { useCart } from '../context/CartContext'
import { trackAddToCart, trackViewContent } from '../lib/analytics'
import { MicroTrust } from '../components/MicroTrust'
import { PaymentMethods } from '../components/PaymentMethods'
import { ReviewCard } from '../components/ReviewCard'
import { RatingSummary } from '../components/RatingSummary'
import { InventoryNote } from '../components/InventoryNote'
import { Price } from '../components/Price'
import { useScarcity } from '../hooks/useScarcity'
import { formatKwd } from '../lib/currency'
import { REVIEWS } from '../data/socialProof'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProduct(slug) : undefined
  const emotional = slug ? getProductEmotional(slug) : undefined
  const { setBundle, setCartOpen } = useCart()
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const { stockLeft } = useScarcity()

  const productReviews = REVIEWS.filter((r) =>
    slug === 'mother-gift'
      ? r.product.includes('أمي') || r.product.includes('هدية')
      : slug === 'body-relief'
        ? r.product.includes('الجسم')
        : r.product.includes('الدورة') || r.product.includes('بوكس'),
  ).slice(0, 2)

  useEffect(() => {
    if (product) {
      setSelectedTier(product.tiers[0])
      trackViewContent(product.slug, product.base_price)
    }
  }, [product])

  if (!product || !selectedTier || !emotional) {
    return <p className="text-center py-20 text-surface-muted">المنتج غير موجود</p>
  }

  const addToCart = () => {
    setBundle(product, selectedTier)
    trackAddToCart(selectedTier.price, product.slug)
    setCartOpen(true)
  }

  return (
    <div className="pb-24">
      {/* Hero — emotional hope */}
      <div className="container-narrow py-6 grid md:grid-cols-2 gap-10 items-start">
        <EmotionalImage frame={emotional.hero} priority aspect="4/3" />
        <div>
          <RatingSummary compact />
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-2 text-ink">{product.title_ar}</h1>
          <p className="text-surface-muted mt-2 leading-relaxed">{product.subtitle_ar}</p>
          <div className="mt-4">
            <InventoryNote stockLeft={stockLeft} compact />
          </div>
          <div className="mt-6 space-y-2">
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
                  onChange={() => setSelectedTier(t)}
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
          <button type="button" onClick={addToCart} className="btn-primary w-full mt-6">
            أضيفي للسلة
          </button>
          <MicroTrust />
          <div className="mt-4 pt-4">
            <PaymentMethods variant="compact" />
          </div>
        </div>
      </div>

      {/* Before / after — shame & fear → relief */}
      <section className="section container-narrow border-t border-surface-border">
        <p className="section-label">قبل · بعد</p>
        <h2 className="font-display text-2xl font-bold mb-6">نفس القصة — بس النهاية مختلفة</h2>
        <BeforeAfterPair before={emotional['pain-before']} after={emotional['pain-after']} />
        <EmotionalImage
          frame={emotional.transformation}
          aspect="21/9"
          className="mt-6 hidden md:block"
          showCaption
        />
      </section>

      {/* Why — pain story */}
      <section className="section container-narrow grid md:grid-cols-2 gap-10 items-center border-t border-surface-border">
        <div>
          <p className="section-label">ليش نفس؟</p>
          <h2 className="font-display text-2xl font-bold">تعرفين هالإحساس؟</h2>
          <p className="mt-4 text-surface-muted leading-relaxed">{emotional.whyBody}</p>
        </div>
        <EmotionalImage frame={emotional['pain-before']} aspect="4/3" variant="before" />
      </section>

      {/* Box — product truth + emotional unboxing */}
      <section className="section container-narrow border-t border-surface-border">
        <div className="grid md:grid-cols-2 gap-10 items-start mb-8">
          <div>
            <p className="section-label">شنو داخل البوكس؟</p>
            <h2 className="font-display text-2xl font-bold">شنو يوصلج بالضبط</h2>
            <p className="mt-4 text-surface-muted leading-relaxed">{emotional.boxBody}</p>
          </div>
          <EmotionalImage frame={emotional.unboxing} aspect="4/3" />
        </div>
        <WhatsInBox includes={product.includes} />
        <p className="text-xs text-surface-muted mt-4 leading-relaxed">{SKU_TRUST_LINE}</p>
      </section>

      {/* How — relief routine */}
      <section className="section container-narrow grid md:grid-cols-2 gap-10 items-center border-t border-surface-border">
        <EmotionalImage frame={emotional['pain-after']} aspect="4/3" variant="after" />
        <div>
          <p className="section-label">كيف تستخدمينه؟</p>
          <h2 className="font-display text-2xl font-bold">روتين ١٥–٢٠ دقيقة بالبيت</h2>
          <p className="mt-4 text-surface-muted leading-relaxed">{emotional.howBody}</p>
          <p className="mt-3 text-xs text-surface-muted border-t border-surface-border pt-3">
            راحة منزلية فقط — مو علاج طبي. النتيجة تختلف من شخص لشخص.
          </p>
        </div>
      </section>

      {productReviews.length > 0 && (
        <section className="container-narrow py-10 border-t border-surface-border">
          <h2 className="font-display text-xl font-bold mb-4">تعليقات على هالمنتج</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {productReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}

      <section className="container-narrow py-8 border-t border-surface-border">
        <PaymentMethods variant="row" showCaption />
      </section>

      <div className="fixed bottom-0 inset-x-0 md:hidden bg-white border-t border-surface-border p-3 flex justify-between items-center z-30">
        <div>
          <span className="font-bold text-rose-brand block">{formatKwd(selectedTier.price)}</span>
          <span className="text-[10px] text-surface-muted">COD · الكويت</span>
        </div>
        <button type="button" onClick={addToCart} className="btn-primary text-sm py-2.5 px-5">
          أضيفي للسلة
        </button>
      </div>
    </div>
  )
}
