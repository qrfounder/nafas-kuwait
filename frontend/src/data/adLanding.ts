/**
 * Ad-safe landing at /product/test — TikTok & Snapchat policy aligned.
 * After approval, redirect /product/test → real slug in Mojourney (Redirects).
 */
export const AD_LANDING_SLUG = 'test'

/** Shown in shop catalog; hidden from collection/home. */
export const isAdLandingSlug = (slug: string) => slug === AD_LANDING_SLUG

export const AD_LANDING_COPY = {
  brand: 'نفس',
  title_ar: 'مجموعة نفس للراحة المنزلية',
  subtitle_ar: 'ثلاث قطع للاستخدام اليومي في البيت: حرارة لاسلكية، ممدد ظهر، مدلك رقبة لاصق.',
  disclaimer_ar:
    'منتجات للراحة والاسترخاء المنزلي فقط. ليست أدوية ولا أجهزة طبية ولا بديلاً عن استشارة الطبيب. النتائج تختلف من شخص لآخر.',
  shipping_ar: 'توصيل داخل الكويت. الدفع عند الاستلام (كاش أو KNET حسب المندوب).',
  confirm_ar: 'نؤكد الطلب والعنوان بمكالمة هاتفية قبل الشحن.',
  company_ar: 'نفس — الكويت',
} as const
