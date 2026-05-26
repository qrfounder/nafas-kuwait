import { getApiBase } from './apiBase'

export type StorePixels = {
  meta: string
  tiktok: string
  snap: string
}

export type StoreRedirect = {
  id: string
  from_path: string
  to_path: string
  to_path_raw?: string
  status_code: number
  note?: string | null
}

export type StoreProduct = {
  slug: string
  title_ar: string
  subtitle_ar: string
  base_price: number
  anchor_single: number
  tiers: { tier: number; label_ar: string; price: number; anchor: number; badge: string | null }[]
  includes: string[]
  post_upsell: { sku: string; title_ar: string; anchor: number; price: number }
  active?: boolean
}

export type StoreSku = {
  sku: string
  label_ar: string
  hint_ar: string
  price: number
  anchor: number
  quantity: number
  active: boolean
  image_url: string
}

export type StoreBootstrap = {
  shop_url: string
  pixels: StorePixels
  redirects: StoreRedirect[]
  products: StoreProduct[]
  skus: StoreSku[]
  macro_help: Record<string, string>
}

let cached: StoreBootstrap | null = null

export async function fetchStoreBootstrap(): Promise<StoreBootstrap> {
  const res = await fetch(`${getApiBase()}/api/store/bootstrap`)
  if (!res.ok) throw new Error('تعذّر تحميل إعدادات المتجر')
  const data = (await res.json()) as StoreBootstrap
  cached = data
  return data
}

export function getCachedBootstrap(): StoreBootstrap | null {
  return cached
}
