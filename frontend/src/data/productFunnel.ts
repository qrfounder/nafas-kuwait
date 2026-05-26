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
  title_ar: 'النظام الكامل: دورة، جسم، وهدية أمي',
  subtitle_ar:
    'ثلاث بوكسات في طلب واحد. للي تبين تغطين كل زاوية من أول مرة، وبسعر أوفر من الشراء منفصل.',
  price: 193.5,
  anchor: 232.3,
  savings_usd: 38.8,
  badge_ar: 'وفّري ١٢ د.ك',
}

export const PRODUCT_FUNNEL: Record<string, ProductFunnelConfig> = {
  'cycle-relief': {
    addons: [
      {
        sku: 'head-massager',
        title_ar: SKU_LABELS['head-massager'],
        price: 52,
        reason_ar: 'بعد المغص، صداع أو نوم متقطع؟ عصابة الرأس تكمل الروتين',
      },
      {
        sku: 'knee-sleeves',
        title_ar: SKU_LABELS['knee-sleeves'],
        price: 48,
        reason_ar: 'ركبة متعبة بعد المشي أو لأمك؟ قطعة خفيفة تضاف للبوكس',
      },
    ],
    siblings: [
      {
        slug: 'body-relief',
        headline_ar: 'ظهرج ورقبتج من التكييف؟',
        sub_ar: 'ممدد ومدلك وعصابة رأس، نظام يومي بعد الشغل',
        badge: 'يكمل الدورة',
      },
      {
        slug: 'mother-gift',
        headline_ar: 'تبي تهادين أمك بنفس الطلب؟',
        sub_ar: 'حزام وركبة وظهر وتغليف، هدية تُستخدم',
        badge: 'الأكثر هدية',
      },
    ],
    bestDealTier: 2,
    bestDealLabel_ar: '٣ بوكسات، وفّري أكثر لكِ ولأختج',
  },
  'body-relief': {
    addons: [
      {
        sku: 'period-belt',
        title_ar: SKU_LABELS['period-belt'],
        price: 56,
        reason_ar: 'ألم الدورة يجي فجأة؟ حزام حرارة يخلي البوكس جاهز',
      },
      {
        sku: 'knee-sleeves',
        title_ar: SKU_LABELS['knee-sleeves'],
        price: 48,
        reason_ar: 'ركبة بعد المشي أو الدرج؟ دعامة خفيفة مع النظام',
      },
    ],
    siblings: [
      {
        slug: 'cycle-relief',
        headline_ar: 'المغص الشهري يوقفج أحياناً؟',
        sub_ar: 'حزام حرارة وظهر ورقبة، الأكثر طلباً في الكويت',
        badge: 'الأكثر طلباً',
      },
      {
        slug: 'mother-gift',
        headline_ar: 'هدية لأمك بنفس الطلب',
        sub_ar: 'بوكس جاهز: ركبة وراحة وتغليف',
        badge: 'للعائلة',
      },
    ],
    bestDealTier: 2,
    bestDealLabel_ar: '٣ بوكسات، للبيت أو لمن تحبين',
  },
  'mother-gift': {
    addons: [
      {
        sku: 'neck',
        title_ar: SKU_LABELS.neck,
        price: 54,
        reason_ar: 'أمك تسند رقبتها طويل؟ مدلك لاصق يكمل الهدية',
      },
      {
        sku: 'head-massager',
        title_ar: SKU_LABELS['head-massager'],
        price: 56,
        reason_ar: 'صداع بعد يوم طويل؟ عصابة قبل النوم',
      },
    ],
    siblings: [
      {
        slug: 'cycle-relief',
        headline_ar: 'وأنتِ بعد، الدورة تستاهل نفس الاهتمام',
        sub_ar: 'حزام وظهر ورقبة، راحة لج أيضاً',
        badge: 'لج أيضاً',
      },
      {
        slug: 'body-relief',
        headline_ar: 'ظهرج من الشغل والتكييف؟',
        sub_ar: 'نظام الجسم: ممدد ومدلك وعصابة',
        badge: 'للشغل',
      },
    ],
    bestDealTier: 2,
    bestDealLabel_ar: '٣ بوكسات، للعائلة أو المناسبة القادمة',
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
