import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Product, Tier } from '../data/products'
import { CROSS_SELLS, SKU_LABELS } from '../data/products'

export interface CartLine {
  sku: string
  title_ar: string
  qty: number
  price_usd: number
  line_type: 'product' | 'cross_sell'
}

interface CartState {
  product: Product | null
  tier: Tier | null
  crossSells: Record<string, boolean>
  lines: CartLine[]
}

interface CartContextValue extends CartState {
  cartOpen: boolean
  checkoutOpen: boolean
  setCartOpen: (v: boolean) => void
  setCheckoutOpen: (v: boolean) => void
  setBundle: (product: Product, tier: Tier) => void
  toggleCrossSell: (sku: string) => void
  subtotal: number
  itemCount: number
  clearCart: () => void
  rebuildLines: () => CartLine[]
}

const CartContext = createContext<CartContextValue | null>(null)

function buildProductLines(product: Product, tier: Tier): CartLine[] {
  const qty = tier.tier
  return [
    {
      sku: product.slug,
      title_ar: `${product.title_ar} — ${tier.label_ar}`,
      qty,
      price_usd: tier.price,
      line_type: 'product',
    },
  ]
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [tier, setTier] = useState<Tier | null>(null)
  const [crossSells, setCrossSells] = useState<Record<string, boolean>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const lines = useMemo(() => {
    if (!product || !tier) return []
    const base = buildProductLines(product, tier)
    const extra = CROSS_SELLS.filter((c) => crossSells[c.sku]).map((c) => ({
      sku: c.sku,
      title_ar: c.title_ar,
      qty: 1,
      price_usd: c.price,
      line_type: 'cross_sell' as const,
    }))
    return [...base, ...extra]
  }, [product, tier, crossSells])

  const subtotal = lines.reduce((s, l) => s + l.price_usd, 0)
  const itemCount = lines.length

  const setBundle = useCallback((p: Product, t: Tier) => {
    setProduct(p)
    setTier(t)
    setCrossSells({})
  }, [])

  const toggleCrossSell = useCallback((sku: string) => {
    setCrossSells((prev) => ({ ...prev, [sku]: !prev[sku] }))
  }, [])

  const clearCart = useCallback(() => {
    setProduct(null)
    setTier(null)
    setCrossSells({})
  }, [])

  const rebuildLines = useCallback(() => lines, [lines])

  const value: CartContextValue = {
    product,
    tier,
    crossSells,
    lines,
    cartOpen,
    checkoutOpen,
    setCartOpen,
    setCheckoutOpen,
    setBundle,
    toggleCrossSell,
    subtotal,
    itemCount,
    clearCart,
    rebuildLines,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart outside provider')
  return ctx
}

export { SKU_LABELS }
