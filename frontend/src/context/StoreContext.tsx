import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCatalogProducts, PRODUCTS, type Product } from '../data/products'
import { fetchStoreBootstrap, type StoreBootstrap, type StoreProduct, type StoreSku } from '../lib/storeApi'
import { initAnalyticsFromPixels } from '../lib/analytics'

type StoreContextValue = {
  ready: boolean
  bootstrap: StoreBootstrap | null
  products: Product[]
  skus: StoreSku[]
  shopUrl: string
  getProduct: (slug: string) => Product | undefined
  getSku: (sku: string) => StoreSku | undefined
}

const StoreContext = createContext<StoreContextValue | null>(null)

function toProduct(p: StoreProduct): Product {
  return {
    slug: p.slug,
    title_ar: p.title_ar,
    subtitle_ar: p.subtitle_ar,
    base_price: p.base_price,
    anchor_single: p.anchor_single,
    tiers: p.tiers,
    includes: p.includes,
    post_upsell: p.post_upsell,
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bootstrap, setBootstrap] = useState<StoreBootstrap | null>(null)
  const [ready, setReady] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    fetchStoreBootstrap()
      .then((b) => {
        if (cancelled) return
        setBootstrap(b)
        initAnalyticsFromPixels(b.pixels)
        setReady(true)
      })
      .catch(() => {
        if (cancelled) return
        setBootstrap(null)
        initAnalyticsFromPixels({
          meta: import.meta.env.VITE_META_PIXEL_ID || '',
          tiktok: import.meta.env.VITE_TIKTOK_PIXEL_ID || '',
          snap: import.meta.env.VITE_SNAP_PIXEL_ID || '',
        })
        setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!bootstrap?.redirects?.length) return
    const path = location.pathname.replace(/\/$/, '') || '/'
    const hit = bootstrap.redirects.find((r) => {
      const from = r.from_path.replace(/\/$/, '') || '/'
      return from === path
    })
    if (!hit) return
    const dest = hit.to_path
    if (dest.startsWith('http')) {
      window.location.replace(dest)
      return
    }
    const destPath = dest.startsWith('/') ? dest : `/${dest}`
    navigate(location.hash ? `${destPath}${location.hash}` : destPath, { replace: true })
  }, [bootstrap, location.pathname, location.hash, navigate])

  const products = useMemo(() => {
    if (bootstrap?.products?.length) {
      return bootstrap.products.filter((p) => p.slug !== 'test').map(toProduct)
    }
    return getCatalogProducts()
  }, [bootstrap])

  const skus = useMemo(() => bootstrap?.skus ?? [], [bootstrap])

  const getSku = useCallback(
    (sku: string) => skus.find((s) => s.sku === sku && s.active),
    [skus],
  )

  const getProduct = useCallback(
    (slug: string) => {
      if (bootstrap?.products?.length) {
        const hit = bootstrap.products.find((p) => p.slug === slug)
        if (hit) return toProduct(hit)
      }
      const base = PRODUCTS.find((p) => p.slug === slug)
      return base
    },
    [bootstrap],
  )

  const value = useMemo(
    () => ({
      ready,
      bootstrap,
      products,
      skus,
      shopUrl: bootstrap?.shop_url || (typeof window !== 'undefined' ? window.location.origin : ''),
      getProduct,
      getSku,
    }),
    [ready, bootstrap, products, skus, getProduct, getSku],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore outside StoreProvider')
  return ctx
}

export function useStoreProducts() {
  return useStore().products
}
