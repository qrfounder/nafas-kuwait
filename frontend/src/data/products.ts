export interface Tier {
  tier: number
  /** Display label (English). Field name kept for API/DB compatibility. */
  label_ar: string
  price: number
  anchor: number
  badge: string | null
}

/**
 * All `price` / `anchor` values are USD (customer-facing).
 * Wellness / comfort positioning only, not medical treatment claims (GMC/Shopping safe).
 */
export interface Product {
  slug: string
  title_ar: string
  subtitle_ar: string
  /** Longer feed/landing description (English). */
  description_en: string
  base_price: number
  anchor_single: number
  tiers: Tier[]
  includes: string[]
  post_upsell: { sku: string; title_ar: string; anchor: number; price: number }
  google_product_category: string
  brand: string
  condition: 'new'
  /** Manufacturer part number for Merchant Center when GTIN is unavailable. */
  mpn: string
  identifier_exists: boolean
  gtin: string | null
  shipping_weight_lb: number
}

/** Accurate SKU names. home comfort devices, not medical devices. */
export const SKU_LABELS: Record<string, string> = {
  'period-belt': 'Wireless warming belt (USB rechargeable)',
  lumbar: 'Lower-back stretch arch',
  neck: 'Adhesive pulse massager for neck & shoulders',
  'head-massager': 'Electric headband massager',
  'knee-sleeves': 'Compression knee sleeves (pair)',
  'gift-box': 'Gift-ready packaging',
}

export const SKU_HINTS: Record<string, string> = {
  'period-belt': 'Wireless; 3 heat & vibration modes; USB charging',
  lumbar: 'Plastic arch; 3 height levels; no electricity',
  neck: 'Small adhesive pad with pulses, not a large pillow',
  'head-massager': 'Forehead band; gentle pulses; 2 modes; USB charging',
  'knee-sleeves': 'Knit compression; patella support; non-slip; pair',
  'gift-box': 'Ready-to-gift packaging',
}

export const SKU_TRUST_LINE =
  'At-home comfort devices, not medical treatment. Each piece is different: heat, stretch arch, adhesive massager, headband, or knit knee sleeves, depending on the kit.'

export const BRAND = 'Nafas'

export function getUsageSteps(slug: string): string {
  switch (slug) {
    case 'cycle-relief':
      return '1) Warming belt on the lower abdomen (15–20 minutes) 2) Back arch on the floor after long sitting 3) Neck adhesive massager before bed.'
    case 'body-relief':
      return '1) Back arch 10–15 minutes after desk or AC time 2) Neck adhesive massager during screen time 3) Headband massager on the forehead before bed (about 15 minutes).'
    case 'mother-gift':
      return '1) Warming belt for comfort at home 2) Compression knee sleeves (pair) 3) Back stretch arch, gift-ready box included.'
    default:
      return 'Use each piece for 10–20 minutes as it feels comfortable. For home comfort only, not a substitute for medical care.'
  }
}

export const PRODUCTS: Product[] = [
  {
    slug: 'test',
    title_ar: 'Nafas Home Comfort Kit',
    subtitle_ar: 'At-home comfort devices: heat, back stretch, neck massager (not medical treatment)',
    description_en:
      'A three-piece Nafas comfort kit with a wireless warming belt, lower-back stretch arch, and adhesive neck massager. Designed for everyday home use. Not a medical device.',
    base_price: 77.4,
    anchor_single: 112.9,
    tiers: [
      { tier: 1, label_ar: '1 kit', price: 77.4, anchor: 77.4, badge: null },
      { tier: 2, label_ar: '2 kits', price: 96.8, anchor: 96.8, badge: null },
      { tier: 3, label_ar: '3 kits', price: 119.4, anchor: 119.4, badge: null },
    ],
    includes: ['period-belt', 'lumbar', 'neck'],
    post_upsell: { sku: 'head-massager', title_ar: 'Electric headband massager', anchor: 52, price: 52 },
    google_product_category: '2330',
    brand: BRAND,
    condition: 'new',
    mpn: 'NF-TEST-KIT',
    identifier_exists: false,
    gtin: null,
    shipping_weight_lb: 2.4,
  },
  {
    slug: 'cycle-relief',
    title_ar: 'Cycle Comfort Kit',
    subtitle_ar: 'Heat and stretch tools for comfortable days at home',
    description_en:
      'Nafas Cycle Comfort Kit includes a wireless warming belt, lower-back stretch arch, and adhesive neck & shoulder massager. Built for everyday home comfort during your cycle. Ships in the USA. At-home comfort devices only, not medical devices.',
    base_price: 77.4,
    anchor_single: 112.9,
    tiers: [
      { tier: 1, label_ar: '1 kit for you', price: 77.4, anchor: 77.4, badge: null },
      { tier: 2, label_ar: '2 kits to share', price: 96.8, anchor: 96.8, badge: null },
      { tier: 3, label_ar: '3 kits for the family', price: 119.4, anchor: 119.4, badge: 'Most popular' },
    ],
    includes: ['period-belt', 'lumbar', 'neck'],
    post_upsell: { sku: 'head-massager', title_ar: 'Electric headband massager', anchor: 52, price: 52 },
    google_product_category: '2330',
    brand: BRAND,
    condition: 'new',
    mpn: 'NF-CYCLE-KIT',
    identifier_exists: false,
    gtin: null,
    shipping_weight_lb: 2.4,
  },
  {
    slug: 'body-relief',
    title_ar: 'Body Ease Kit',
    subtitle_ar: 'Desk days, long drives, and screen time: stretch and massage tools for home',
    description_en:
      'Nafas Body Ease Kit includes a lower-back stretch arch, adhesive neck massager, and electric headband massager. For everyday muscle tension from sitting, AC offices, and phones. At-home comfort devices only, not medical devices.',
    base_price: 77.4,
    anchor_single: 112.9,
    tiers: [
      { tier: 1, label_ar: '1 kit for you', price: 77.4, anchor: 77.4, badge: null },
      { tier: 2, label_ar: '2 kits', price: 96.8, anchor: 96.8, badge: null },
      { tier: 3, label_ar: '3 kits', price: 119.4, anchor: 119.4, badge: 'Most popular' },
    ],
    includes: ['lumbar', 'neck', 'head-massager'],
    post_upsell: { sku: 'knee-sleeves', title_ar: 'Compression knee sleeves (pair)', anchor: 48, price: 48 },
    google_product_category: '2330',
    brand: BRAND,
    condition: 'new',
    mpn: 'NF-BODY-KIT',
    identifier_exists: false,
    gtin: null,
    shipping_weight_lb: 2.6,
  },
  {
    slug: 'mother-gift',
    title_ar: 'Mom Gift Kit',
    subtitle_ar: 'A thoughtful comfort box for the woman who rarely asks for help',
    description_en:
      'Nafas Mom Gift Kit includes a wireless warming belt, compression knee sleeves (pair), lower-back stretch arch, and gift-ready packaging. A practical present for everyday comfort at home. At-home comfort devices only, not medical devices.',
    base_price: 77.4,
    anchor_single: 112.9,
    tiers: [
      { tier: 1, label_ar: '1 gift-ready kit', price: 77.4, anchor: 77.4, badge: null },
      { tier: 2, label_ar: '2 kits for you and mom', price: 96.8, anchor: 96.8, badge: null },
      { tier: 3, label_ar: '3 kits for the family', price: 119.4, anchor: 119.4, badge: 'Most popular' },
    ],
    includes: ['period-belt', 'knee-sleeves', 'lumbar', 'gift-box'],
    post_upsell: { sku: 'lumbar', title_ar: 'Extra back stretch arch', anchor: 44, price: 44 },
    google_product_category: '2330',
    brand: BRAND,
    condition: 'new',
    mpn: 'NF-MOM-KIT',
    identifier_exists: false,
    gtin: null,
    shipping_weight_lb: 2.8,
  },
]

export const CROSS_SELLS = [
  { sku: 'knee-sleeves', title_ar: 'Compression knee sleeves (pair)', price: 48 },
  { sku: 'lumbar', title_ar: 'Extra back stretch arch', price: 44 },
  { sku: 'head-massager', title_ar: 'Electric headband massager', price: 52 },
]

export const SINGLE_SKU_PRICES: Record<string, { price: number; anchor: number }> = {
  'period-belt': { price: 62, anchor: 62 },
  lumbar: { price: 55, anchor: 55 },
  neck: { price: 60, anchor: 60 },
  'head-massager': { price: 64, anchor: 64 },
  'knee-sleeves': { price: 58, anchor: 58 },
  'gift-box': { price: 40, anchor: 40 },
}

export function getSingleSkuPrice(sku: string) {
  return SINGLE_SKU_PRICES[sku]
}

export function sumSinglePrices(skus: string[]) {
  return skus.reduce((s, sku) => s + (SINGLE_SKU_PRICES[sku]?.price ?? 0), 0)
}

export type SkuCatalogEntry = {
  sku: string
  title_ar: string
  hint_ar: string
  price: number
  anchor: number
}

export function singlesInBundle(product: Product, catalog?: Record<string, SkuCatalogEntry>) {
  return product.includes
    .filter((sku) => catalog?.[sku] || SINGLE_SKU_PRICES[sku])
    .map((sku) => {
      const c = catalog?.[sku]
      const fallback = SINGLE_SKU_PRICES[sku]
      return {
        sku,
        title_ar: c?.title_ar ?? SKU_LABELS[sku],
        hint_ar: c?.hint_ar ?? SKU_HINTS[sku] ?? '',
        price: c?.price ?? fallback?.price ?? 0,
        anchor: c?.anchor ?? fallback?.anchor ?? 0,
      }
    })
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getCatalogProducts() {
  return PRODUCTS.filter((p) => p.slug !== 'test')
}

export const ENTRY_BUNDLE_PRICE_USD = Math.min(
  ...getCatalogProducts().map((p) => p.tiers[0]?.price ?? p.base_price),
)
