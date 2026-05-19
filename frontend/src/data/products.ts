export interface Tier {
  tier: number
  label_ar: string
  price: number
  anchor: number
  badge: string | null
}

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

/** Accurate SKU names — matches warehouse items (COD-safe wording). */
export const SKU_LABELS: Record<string, string> = {
  'period-belt': 'حزام حرارة لاسلكي للدورة (USB)',
  lumbar: 'ممدد ومقوم أسفل الظهر',
  neck: 'مدلك كهربائي لاصق — رقبة وكتف',
  'head-massager': 'عصابة مساج الرأس الكهربائية',
  'knee-sleeves': 'دعامة ضغط للركبة (تريكو)',
  'gift-box': 'تغليف هدية فاخر',
}

/** Short line under each SKU on product pages (expectation-setting). */
export const SKU_HINTS: Record<string, string> = {
  'period-belt': 'لاسلكي · ٣ أوضاع حرارة واهتزاز · يشحن USB',
  lumbar: 'بلاستيك · ٣ مستويات · بدون كهرباء',
  neck: 'لوحة لاصقة صغيرة · نبضات · مو وسادة كبيرة',
  'head-massager': 'عصابة على الجبهة · نبضات خفيفة · وضعان · يشحن USB',
  'knee-sleeves': 'تريكو ضغط · حماية الرضفة · مانع انزلاق · زوج للركبتين',
  'gift-box': 'تغليف هدية جاهز',
}

export const SKU_TRUST_LINE =
  'أجهزة راحة منزلية — مو علاج طبي. كل قطعة مختلفة: حرارة، ممدد، مدلك لاصق، عصابة رأس، أو دعامة ركبة تريكو — حسب البوكس.'

export function getUsageSteps(slug: string): string {
  switch (slug) {
    case 'cycle-relief':
      return '١) حزام الحرارة اللاسلكي على البطن (١٥–٢٠ دقيقة) ٢) ممدد الظهر على الأرض بعد التكييف ٣) مدلك الرقبة اللاصق قبل النوم.'
    case 'body-relief':
      return '١) ممدد الظهر ١٠–١٥ دقيقة بعد التكييف ٢) مدلك الرقبة اللاصق مع التلفون ٣) عصابة مساج الرأس على الجبهة قبل النوم (١٥ دقيقة).'
    case 'mother-gift':
      return '١) حزام حرارة لأمك أو لكِ ٢) دعامة ضغط للركبتين (تريكو) ٣) ممدد الظهر — بوكس هدية جاهز للتغليف.'
    default:
      return 'استخدمي كل قطعة ١٠–٢٠ دقيقة حسب راحتج — راحة منزلية فقط.'
  }
}

export const PRODUCTS: Product[] = [
  {
    slug: 'cycle-relief',
    title_ar: 'نظام راحة الدورة',
    subtitle_ar: 'الألم اللي تتحملينه بصمت كل شهر — فيه حل بالبيت',
    base_price: 49,
    anchor_single: 98,
    tiers: [
      { tier: 1, label_ar: 'بوكس واحد — لكِ', price: 49, anchor: 98, badge: null },
      { tier: 2, label_ar: 'بوكسين — لكِ ولأختك', price: 89, anchor: 196, badge: 'وفّري $9' },
      { tier: 3, label_ar: '3 بوكسات — للعائلة', price: 129, anchor: 294, badge: 'الأكثر طلباً' },
    ],
    includes: ['period-belt', 'lumbar', 'neck'],
    post_upsell: { sku: 'head-massager', title_ar: 'عصابة مساج الرأس الكهربائية', anchor: 78, price: 39 },
  },
  {
    slug: 'body-relief',
    title_ar: 'راحة الجسم',
    subtitle_ar: 'التكييف يريحك من الحر ويقتل ظهرك ورقبتك',
    base_price: 52,
    anchor_single: 104,
    tiers: [
      { tier: 1, label_ar: 'بوكس واحد — لكِ', price: 52, anchor: 104, badge: null },
      { tier: 2, label_ar: 'بوكسين', price: 94, anchor: 208, badge: 'وفّري $10' },
      { tier: 3, label_ar: '3 بوكسات', price: 138, anchor: 312, badge: 'الأكثر طلباً' },
    ],
    includes: ['lumbar', 'neck', 'head-massager'],
    post_upsell: { sku: 'knee-sleeves', title_ar: 'دعامة ضغط للركبة — زوج لأمك', anchor: 58, price: 29 },
  },
  {
    slug: 'mother-gift',
    title_ar: 'هدية أمي',
    subtitle_ar: 'أمك ما تشتكي — أنتِ اللي تعرفين ألم ركبها',
    base_price: 55,
    anchor_single: 118,
    tiers: [
      { tier: 1, label_ar: 'بوكس واحد — هدية', price: 55, anchor: 118, badge: null },
      { tier: 2, label_ar: 'بوكسين — لكِ ولأمك', price: 99, anchor: 236, badge: 'وفّري $11' },
      { tier: 3, label_ar: '3 بوكسات — للعائلة', price: 145, anchor: 354, badge: 'الأكثر طلباً' },
    ],
    includes: ['period-belt', 'knee-sleeves', 'lumbar', 'gift-box'],
    post_upsell: { sku: 'lumbar', title_ar: 'ممدد ظهر إضافي لأمك', anchor: 48, price: 24 },
  },
]

export const CROSS_SELLS = [
  { sku: 'knee-sleeves', title_ar: 'دعامة ضغط للركبة — زوج', price: 12 },
  { sku: 'lumbar', title_ar: 'ممدد ظهر إضافي', price: 10 },
  { sku: 'head-massager', title_ar: 'عصابة مساج الرأس الكهربائية', price: 15 },
]

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug)
}
