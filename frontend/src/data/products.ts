export interface Tier {
  tier: number
  label_ar: string
  price: number
  anchor: number
  badge: string | null
}

/**
 * All `price` / `anchor` values are internal list units (see `usdToKwd` in currency.ts).
 * Display to customers is always in د.ك. Sweet spot: singles ~17–20 د.ك avg on hero SKUs;
 * bundle tier 1 below sum of singles (clear savings) to lift confirmation; multi-tier
 * steps lift AOV without shocking COD totals.
 */
export interface Product {
  slug: string
  title_ar: string
  subtitle_ar: string
  base_price: number
  anchor_single: number
  tiers: Tier[]
  includes: string[]
  post_upsell: { sku: string; title_ar: string; anchor: number; price: number }
}

/** Accurate SKU names، matches warehouse items (الدفع عند الاستلام-safe wording). */
export const SKU_LABELS: Record<string, string> = {
  'period-belt': 'حزام حرارة لاسلكي للدورة',
  lumbar: 'ممدد ومقوم أسفل الظهر',
  neck: 'مدلك كهربائي لاصق، رقبة وكتف',
  'head-massager': 'عصابة مساج الرأس الكهربائية',
  'knee-sleeves': 'دعامة ضغط للركبة (تريكو)',
  'gift-box': 'تغليف هدية فاخر',
}

/** Short line under each SKU on product pages (expectation-setting). */
export const SKU_HINTS: Record<string, string> = {
  'period-belt': 'لاسلكي، ٣ أوضاع حرارة واهتزاز، يشحن بالكابل',
  lumbar: 'بلاستيك، ٣ مستويات، بدون كهرباء',
  neck: 'لوحة لاصقة صغيرة، نبضات، مو وسادة كبيرة',
  'head-massager': 'عصابة على الجبهة، نبضات خفيفة، وضعان، يشحن بالكابل',
  'knee-sleeves': 'تريكو ضغط، حماية الرضفة، مانع انزلاق، زوج للركبتين',
  'gift-box': 'تغليف هدية جاهز',
}

export const SKU_TRUST_LINE =
  'أجهزة راحة منزلية، مو علاج طبي. كل قطعة مختلفة: حرارة، ممدد، مدلك لاصق، عصابة رأس، أو دعامة ركبة تريكو، حسب البوكس.'

export function getUsageSteps(slug: string): string {
  switch (slug) {
    case 'cycle-relief':
      return '١) حزام الحرارة اللاسلكي على البطن (١٥-٢٠ دقيقة) ٢) ممدد الظهر على الأرض بعد التكييف ٣) مدلك الرقبة اللاصق قبل النوم.'
    case 'body-relief':
      return '١) ممدد الظهر ١٠-١٥ دقيقة بعد التكييف ٢) مدلك الرقبة اللاصق مع التلفون ٣) عصابة مساج الرأس على الجبهة قبل النوم (١٥ دقيقة).'
    case 'mother-gift':
      return '١) حزام حرارة لأمك أو لكِ ٢) دعامة ضغط للركبتين (تريكو) ٣) ممدد الظهر، بوكس هدية جاهز للتغليف.'
    default:
      return 'استخدمي كل قطعة ١٠-٢٠ دقيقة حسب راحتج، راحة منزلية فقط.'
  }
}

export const PRODUCTS: Product[] = [
  {
    slug: 'test',
    title_ar: 'مجموعة نفس للراحة المنزلية',
    subtitle_ar: 'أجهزة راحة منزلية — حرارة، ممدد ظهر، مدلك رقبة (ليس علاجاً طبياً)',
    base_price: 125,
    anchor_single: 177,
    tiers: [
      { tier: 1, label_ar: 'بوكس واحد', price: 125, anchor: 177, badge: null },
      { tier: 2, label_ar: 'بوكسين', price: 209, anchor: 250, badge: null },
      { tier: 3, label_ar: '3 بوكسات', price: 279, anchor: 375, badge: null },
    ],
    includes: ['period-belt', 'lumbar', 'neck'],
    post_upsell: { sku: 'head-massager', title_ar: 'عصابة مساج الرأس الكهربائية', anchor: 74, price: 52 },
  },
  {
    slug: 'cycle-relief',
    title_ar: 'نظام راحة الدورة',
    subtitle_ar: 'الألم اللي تتحملينه بصمت كل شهر، فيه حل بالبيت',
    base_price: 125,
    anchor_single: 177,
    tiers: [
      { tier: 1, label_ar: 'بوكس واحد، لكِ', price: 125, anchor: 177, badge: null },
      { tier: 2, label_ar: 'بوكسين، لكِ ولأختك', price: 209, anchor: 250, badge: 'وفّري ١٣ د.ك' },
      { tier: 3, label_ar: '3 بوكسات، للعائلة', price: 279, anchor: 375, badge: 'الأكثر طلباً' },
    ],
    includes: ['period-belt', 'lumbar', 'neck'],
    post_upsell: { sku: 'head-massager', title_ar: 'عصابة مساج الرأس الكهربائية', anchor: 74, price: 52 },
  },
  {
    slug: 'body-relief',
    title_ar: 'راحة الجسم',
    subtitle_ar: 'التكييف يريحك من الحر ويقتل ظهرك ورقبتك',
    base_price: 128,
    anchor_single: 179,
    tiers: [
      { tier: 1, label_ar: 'بوكس واحد، لكِ', price: 128, anchor: 179, badge: null },
      { tier: 2, label_ar: 'بوكسين', price: 214, anchor: 256, badge: 'وفّري ١٣ د.ك' },
      { tier: 3, label_ar: '3 بوكسات', price: 294, anchor: 384, badge: 'الأكثر طلباً' },
    ],
    includes: ['lumbar', 'neck', 'head-massager'],
    post_upsell: { sku: 'knee-sleeves', title_ar: 'دعامة ضغط للركبة، زوج لأمك', anchor: 67, price: 48 },
  },
  {
    slug: 'mother-gift',
    title_ar: 'هدية أمي',
    subtitle_ar: 'أمك ما تشتكي، أنتِ اللي تعرفين ألم ركبها',
    base_price: 149,
    anchor_single: 215,
    tiers: [
      { tier: 1, label_ar: 'بوكس واحد، هدية', price: 149, anchor: 215, badge: null },
      { tier: 2, label_ar: 'بوكسين، لكِ ولأمك', price: 254, anchor: 298, badge: 'وفّري ١٤ د.ك' },
      { tier: 3, label_ar: '3 بوكسات، للعائلة', price: 349, anchor: 447, badge: 'الأكثر طلباً' },
    ],
    includes: ['period-belt', 'knee-sleeves', 'lumbar', 'gift-box'],
    post_upsell: { sku: 'lumbar', title_ar: 'ممدد ظهر إضافي لأمك', anchor: 64, price: 44 },
  },
]

export const CROSS_SELLS = [
  { sku: 'knee-sleeves', title_ar: 'دعامة ضغط للركبة، زوج', price: 48 },
  { sku: 'lumbar', title_ar: 'ممدد ظهر إضافي', price: 44 },
  { sku: 'head-massager', title_ar: 'عصابة مساج الرأس الكهربائية', price: 52 },
]

/** Standalone piece pricing (internal list units → د.ك via currency). ~17–20 د.ك on hero SKUs. */
export const SINGLE_SKU_PRICES: Record<string, { price: number; anchor: number }> = {
  'period-belt': { price: 62, anchor: 72 },
  lumbar: { price: 55, anchor: 64 },
  neck: { price: 60, anchor: 69 },
  'head-massager': { price: 64, anchor: 74 },
  'knee-sleeves': { price: 58, anchor: 67 },
  'gift-box': { price: 40, anchor: 48 },
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

/** Storefront listing (excludes ad-only landing slug). */
export function getCatalogProducts() {
  return PRODUCTS.filter((p) => p.slug !== 'test')
}

/** Lowest bundle tier-1 price (for homepage «من … د.ك»). */
export const ENTRY_BUNDLE_PRICE_USD = Math.min(
  ...getCatalogProducts().map((p) => p.tiers[0]?.price ?? p.base_price),
)
