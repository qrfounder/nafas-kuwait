import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Product, Tier } from '../data/products'
import {
  CROSS_SELLS,
  SINGLE_SKU_PRICES,
  SKU_LABELS,
  singlesInBundle,
} from '../data/products'

export type PurchaseMode = 'bundle' | 'single'

export interface CartLine {
  sku: string
  title_ar: string
  qty: number
  price_usd: number
  line_type: 'product' | 'cross_sell' | 'single' | 'checkout_extra'
}

interface CartContextValue {
  product: Product | null
  tier: Tier | null
  singleSku: string | null
  /** Quantity for single-SKU line (1–3). Only used when purchaseMode === 'single'. */
  singleQty: number
  purchaseMode: PurchaseMode | null
  crossSells: Record<string, boolean>
  lines: CartLine[]
  cartOpen: boolean
  checkoutOpen: boolean
  subtotal: number
  itemCount: number
  setCartOpen: (v: boolean) => void
  setCheckoutOpen: (v: boolean) => void
  setBundle: (product: Product, tier: Tier) => void
  setSinglePiece: (product: Product, sku: string, qty?: number) => void
  toggleCrossSell: (sku: string) => void
  clearCart: () => void
  rebuildLines: () => CartLine[]
  /** Checkout context: bundle tier or 1 for single piece */
  offerTier: number
}

const CartContext = createContext<CartContextValue | null>(null)

function buildBundleLines(product: Product, tier: Tier): CartLine[] {
  return [
    {
      sku: product.slug,
      title_ar: `${product.title_ar}, ${tier.label_ar}`,
      qty: tier.tier,
      price_usd: tier.price,
      line_type: 'product',
    },
  ]
}

function singleLineTitle(sku: string, qty: number): string {
  const name = SKU_LABELS[sku] ?? sku
  if (qty <= 1) return name
  return `${name} (${qty} pieces)`
}

function buildSingleLine(sku: string, qty: number): CartLine | null {
  const p = SINGLE_SKU_PRICES[sku]
  if (!p) return null
  const q = Math.min(3, Math.max(1, Math.floor(qty)))
  return {
    sku,
    title_ar: singleLineTitle(sku, q),
    qty: q,
    price_usd: p.price * q,
    line_type: 'single',
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [tier, setTier] = useState<Tier | null>(null)
  const [singleSku, setSingleSku] = useState<string | null>(null)
  const [singleQty, setSingleQty] = useState(1)
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode | null>(null)
  const [crossSells, setCrossSells] = useState<Record<string, boolean>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const lines = useMemo(() => {
    if (!product) return []
    let base: CartLine[] = []
    if (purchaseMode === 'bundle' && tier) {
      base = buildBundleLines(product, tier)
    } else if (purchaseMode === 'single' && singleSku) {
      const line = buildSingleLine(singleSku, singleQty)
      base = line ? [line] : []
    }

    const bundleSkus = new Set(product.includes)
    const extras =
      purchaseMode === 'single' && singleSku
        ? singlesInBundle(product)
            .filter((s) => s.sku !== singleSku && crossSells[s.sku])
            .map((s) => ({
              sku: s.sku,
              title_ar: s.title_ar,
              qty: 1,
              price_usd: s.price,
              line_type: 'cross_sell' as const,
            }))
        : CROSS_SELLS.filter((c) => crossSells[c.sku] && !bundleSkus.has(c.sku)).map((c) => ({
            sku: c.sku,
            title_ar: c.title_ar,
            qty: 1,
            price_usd: c.price,
            line_type: 'cross_sell' as const,
          }))

    return [...base, ...extras]
  }, [product, tier, singleSku, singleQty, purchaseMode, crossSells])

  const subtotal = lines.reduce((s, l) => s + l.price_usd, 0)
  const itemCount = lines.length
  const offerTier = purchaseMode === 'bundle' && tier ? tier.tier : 1

  const setBundle = useCallback((p: Product, t: Tier) => {
    setProduct(p)
    setTier(t)
    setSingleSku(null)
    setSingleQty(1)
    setPurchaseMode('bundle')
    setCrossSells({})
  }, [])

  const setSinglePiece = useCallback((p: Product, sku: string, qty = 1) => {
    if (!SINGLE_SKU_PRICES[sku]) return
    setProduct(p)
    setTier(null)
    setSingleSku(sku)
    setSingleQty(Math.min(3, Math.max(1, Math.floor(qty))))
    setPurchaseMode('single')
    setCrossSells({})
  }, [])

  const toggleCrossSell = useCallback((sku: string) => {
    setCrossSells((prev) => ({ ...prev, [sku]: !prev[sku] }))
  }, [])

  const clearCart = useCallback(() => {
    setProduct(null)
    setTier(null)
    setSingleSku(null)
    setSingleQty(1)
    setPurchaseMode(null)
    setCrossSells({})
  }, [])

  const rebuildLines = useCallback(() => lines, [lines])

  const value: CartContextValue = {
    product,
    tier,
    singleSku,
    singleQty,
    purchaseMode,
    crossSells,
    lines,
    cartOpen,
    checkoutOpen,
    setCartOpen,
    setCheckoutOpen,
    setBundle,
    setSinglePiece,
    toggleCrossSell,
    subtotal,
    itemCount,
    clearCart,
    rebuildLines,
    offerTier,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart outside provider')
  return ctx
}

export { SKU_LABELS }
