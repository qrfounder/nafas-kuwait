import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ProductMobileStickyBar } from '../components/ProductMobileStickyBar'
import { scrollToSection } from '../lib/scroll'
import {
  SINGLE_SKU_PRICES,
  singlesInBundle,
  SKU_LABELS,
  SKU_TRUST_LINE,
  type Tier,
} from '../data/products'
import { getProductEmotional } from '../data/productEmotionalImages'
import { WhatsInBox } from '../components/WhatsInBox'
import { ProductShowcase } from '../components/ProductShowcase'
import { PurchasePanel, type PurchaseMode } from '../components/PurchasePanel'
import { useCart } from '../context/CartContext'
import { trackAddToCart, trackViewContent } from '../lib/analytics'
import { MicroTrust } from '../components/MicroTrust'
import { PaymentMethods } from '../components/PaymentMethods'
import { StoreTrustNote } from '../components/StoreTrustNote'
import { formatUsd } from '../lib/currency'
import { useStore } from '../context/StoreContext'
import { ProductJsonLd } from '../components/ProductJsonLd'

export function ProductPage() {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const { getProduct, ready } = useStore()
  const product = slug ? getProduct(slug) : undefined
  const emotional = slug ? getProductEmotional(slug) : undefined
  const {
    setBundle,
    setSinglePiece,
    setCartOpen,
    product: cartProduct,
    purchaseMode: cartMode,
  } = useCart()
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('bundle')
  const [selectedSingle, setSelectedSingle] = useState<string | null>(null)
  const [singleQty, setSingleQty] = useState<1 | 2 | 3>(1)

  useEffect(() => {
    setSingleQty(1)
  }, [selectedSingle])

  useEffect(() => {
    if (!slug || !ready) return
    const p = getProduct(slug)
    if (!p) return
    setSelectedTier(p.tiers[0])
    setSelectedSingle(singlesInBundle(p)[0]?.sku ?? null)
    setPurchaseMode('bundle')
    setSingleQty(1)
    trackViewContent(p.slug, p.base_price)
  }, [slug, ready, getProduct])

  useEffect(() => {
    if (hash) navigate(pathname, { replace: true })
  }, [hash, pathname, navigate])

  if (!product || !selectedTier || !emotional) {
    return <p className="text-center py-20 text-surface-muted">Product not found</p>
  }

  const focusSku =
    purchaseMode === 'single' && selectedSingle ? selectedSingle : product.includes[0]

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

  const handleTierChange = (t: Tier) => {
    setSelectedTier(t)
    if (cartProduct?.slug === product.slug && cartMode === 'bundle') {
      setBundle(product, t)
    }
  }

  const stickyDetail =
    purchaseMode === 'single' && selectedSingle
      ? `${SKU_LABELS[selectedSingle] ?? selectedSingle} ×${singleQty} · Stripe checkout`
      : `${selectedTier.label_ar} · Stripe checkout`

  return (
    <div className="pb-32 md:pb-12">
      <ProductJsonLd
        product={product}
        imageUrl={`https://naffas.shop/products/emotional/${product.slug}/hero-960.webp`}
      />
      <div className="container-narrow py-6 grid md:grid-cols-2 gap-10 items-start">
        <ProductShowcase
          frame={emotional.hero}
          focusSku={focusSku}
          variant={purchaseMode}
          priority
        />
        <div>
          <StoreTrustNote compact />
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-2 text-ink">{product.title_ar}</h1>
          <p className="text-surface-muted mt-2 leading-relaxed">{product.subtitle_ar}</p>
          <div
            id="purchase-offer"
            className="relative z-40 mt-6 scroll-mt-24 border border-surface-border bg-white p-4 sm:p-5"
          >
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.14em] text-surface-muted mb-1">
              Choose your offer
            </p>
            <p className="text-center text-xs text-surface-muted mb-4 leading-relaxed">
              Full kit or a single piece. Pay securely with Stripe
            </p>
            <PurchasePanel
              product={product}
              mode={purchaseMode}
              onModeChange={setPurchaseMode}
              selectedTier={selectedTier}
              onTierChange={handleTierChange}
              selectedSingle={selectedSingle}
              onSingleChange={(sku) => {
                setSelectedSingle(sku)
                if (cartProduct?.slug === product.slug && cartMode === 'single') {
                  setSinglePiece(product, sku, singleQty)
                }
              }}
              singleQty={singleQty}
              onSingleQtyChange={setSingleQty}
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
        <p className="section-label">About this kit</p>
        <h2 className="font-display text-2xl font-bold">What you are buying</h2>
        <p className="mt-4 text-surface-muted leading-relaxed max-w-2xl">{emotional.whyBody}</p>
        <p className="mt-3 text-xs text-surface-muted">{SKU_TRUST_LINE}</p>
      </section>

      <section className="section container-narrow border-t border-surface-border">
        <p className="section-label">What’s included</p>
        <h2 className="font-display text-2xl font-bold">
          {purchaseMode === 'single' && selectedSingle
            ? `Your piece: ${SKU_LABELS[selectedSingle] ?? selectedSingle}`
            : 'Full kit contents'}
        </h2>
        <p className="mt-3 text-surface-muted leading-relaxed max-w-xl">
          {purchaseMode === 'single'
            ? 'This is the piece that ships if you chose “Single piece.” Want the full kit? Scroll back to “Choose your offer.”'
            : emotional.boxBody}
        </p>
        <div className="mt-8">
          {purchaseMode === 'single' && selectedSingle ? (
            <WhatsInBox includes={[selectedSingle]} boxCount={1} />
          ) : (
            <WhatsInBox includes={product.includes} boxCount={selectedTier.tier} />
          )}
        </div>
      </section>

      <section className="section container-narrow border-t border-surface-border">
        <p className="section-label">How to use</p>
        <h2 className="font-display text-2xl font-bold">Suggested home routine</h2>
        <p className="mt-4 text-surface-muted leading-relaxed max-w-2xl">{emotional.howBody}</p>
        <p className="mt-3 text-xs text-surface-muted border-t border-surface-border pt-3">
          At-home comfort devices only, not medical treatment. Experience varies. See a clinician for
          medical concerns.
        </p>
        <p className="mt-4 text-sm text-surface-muted">
          <Link to="/returns" className="text-rose-brand underline">
            30-day returns
          </Link>
          {' · '}
          <Link to="/policies#shipping" className="text-rose-brand underline">
            Shipping
          </Link>
          {' · '}
          <Link to="/contact" className="text-rose-brand underline">
            Contact
          </Link>
        </p>
      </section>

      <section className="container-narrow py-8 border-t border-surface-border">
        <PaymentMethods variant="row" showCaption />
      </section>

      <ProductMobileStickyBar
        offerSectionId="purchase-offer"
        priceLabel={formatUsd(stickyPrice)}
        detailLine={stickyDetail}
        ctaLabel="Choose your offer"
        onCta={() => scrollToSection('purchase-offer', { behavior: 'smooth' })}
      />
    </div>
  )
}
