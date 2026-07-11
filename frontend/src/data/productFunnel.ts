import type { Product } from './products'
import { PRODUCTS, SKU_LABELS } from './products'

export type AddonOffer = {
  sku: string
  title_ar: string
  price: number
  reason_ar: string
}

export type SiblingBundleOffer = {
  slug: string
  headline_ar: string
  sub_ar: string
  badge?: string
}

export type ProductFunnelConfig = {
  addons: AddonOffer[]
  siblings: SiblingBundleOffer[]
  bestDealTier: number
  bestDealLabel_ar: string
}

const ALL_SKUS = ['period-belt', 'lumbar', 'neck', 'head-massager', 'knee-sleeves', 'gift-box'] as const

export const COMPLETE_SYSTEM_IMAGE = '/products/emotional/complete-system.png'

export const COMPLETE_PACKAGE = {
  id: 'complete-nafas',
  title_ar: 'Complete system: Cycle, Body & Mom Gift',
  subtitle_ar:
    'Three kits in one order. Cover every zone from the start. better value than buying separately.',
  price: 193.5,
  anchor: 232.3,
  savings_usd: 38.8,
  badge_ar: 'Save $39',
}

export const PRODUCT_FUNNEL: Record<string, ProductFunnelConfig> = {
  'cycle-relief': {
    addons: [
      {
        sku: 'head-massager',
        title_ar: SKU_LABELS['head-massager'],
        price: 52,
        reason_ar: 'After a tough cycle day. headband massager rounds out the routine',
      },
      {
        sku: 'knee-sleeves',
        title_ar: SKU_LABELS['knee-sleeves'],
        price: 48,
        reason_ar: 'Tired knees after walking. or for mom? A light add-on for the kit',
      },
    ],
    siblings: [
      {
        slug: 'body-relief',
        headline_ar: 'Desk back and neck tightness?',
        sub_ar: 'Arch, adhesive massager, and headband. a daily after-work system',
        badge: 'Pairs with Cycle',
      },
      {
        slug: 'mother-gift',
        headline_ar: 'Gift mom in the same order?',
        sub_ar: 'Warming belt, knee sleeves, back arch, gift packaging',
        badge: 'Most gifted',
      },
    ],
    bestDealTier: 2,
    bestDealLabel_ar: '3 kits. better value for you and a sister',
  },
  'body-relief': {
    addons: [
      {
        sku: 'period-belt',
        title_ar: SKU_LABELS['period-belt'],
        price: 56,
        reason_ar: 'Cycle days sneak up? A warming belt keeps the kit ready',
      },
      {
        sku: 'knee-sleeves',
        title_ar: SKU_LABELS['knee-sleeves'],
        price: 48,
        reason_ar: 'Knees after stairs or walks? Light sleeves with the system',
      },
    ],
    siblings: [
      {
        slug: 'cycle-relief',
        headline_ar: 'Monthly discomfort that pauses your plans?',
        sub_ar: 'Warming belt, back arch, neck massager. our most popular kit',
        badge: 'Most popular',
      },
      {
        slug: 'mother-gift',
        headline_ar: 'A gift for mom in the same order',
        sub_ar: 'Ready kit: knees, comfort tools, gift packaging',
        badge: 'For family',
      },
    ],
    bestDealTier: 2,
    bestDealLabel_ar: '3 kits for home',
  },
  'mother-gift': {
    addons: [
      {
        sku: 'neck',
        title_ar: SKU_LABELS.neck,
        price: 54,
        reason_ar: 'Mom rubs her neck after long days? Adhesive massager completes the gift',
      },
      {
        sku: 'head-massager',
        title_ar: SKU_LABELS['head-massager'],
        price: 56,
        reason_ar: 'Tension after a long day? Headband before bed',
      },
    ],
    siblings: [
      {
        slug: 'cycle-relief',
        headline_ar: 'And for you. cycle days deserve care too',
        sub_ar: 'Warming belt, back, and neck. comfort for you as well',
        badge: 'For you too',
      },
      {
        slug: 'body-relief',
        headline_ar: 'Back from work and AC?',
        sub_ar: 'Body kit: arch, adhesive massager, headband',
        badge: 'For workdays',
      },
    ],
    bestDealTier: 2,
    bestDealLabel_ar: '3 kits for family',
  },
}

export function getFunnel(slug: string): ProductFunnelConfig | undefined {
  return PRODUCT_FUNNEL[slug]
}

export function allCatalogSkus(): string[] {
  return [...ALL_SKUS]
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function addonsForCart(bundleSlugs: string[]): AddonOffer[] {
  const inBundle = new Set<string>()
  for (const slug of bundleSlugs) {
    const p = PRODUCTS.find((x) => x.slug === slug)
    p?.includes.forEach((sku) => inBundle.add(sku))
  }
  const seen = new Set<string>()
  const out: AddonOffer[] = []
  for (const slug of bundleSlugs) {
    const funnel = PRODUCT_FUNNEL[slug]
    if (!funnel) continue
    for (const a of funnel.addons) {
      if (!inBundle.has(a.sku) && !seen.has(a.sku)) {
        seen.add(a.sku)
        out.push(a)
      }
    }
  }
  return out
}
