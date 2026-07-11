/**
 * Ad-safe landing at /product/test. TikTok & Snapchat policy aligned.
 * After approval, redirect /product/test → real slug in Mojourney (Redirects).
 */
export const AD_LANDING_SLUG = 'test'

/** Shown in shop catalog; hidden from collection/home. */
export const isAdLandingSlug = (slug: string) => slug === AD_LANDING_SLUG

export const AD_LANDING_COPY = {
  brand: 'Nafas',
  title_ar: 'Nafas Home Comfort Kit',
  subtitle_ar:
    'Three pieces for everyday home use: wireless warming belt, back stretch arch, and adhesive neck massager.',
  disclaimer_ar:
    'For at-home comfort and relaxation only. Not medicine, not a medical device, and not a substitute for seeing a clinician. Results vary.',
  shipping_ar:
    'Ships across the United States. Prepaid with Stripe. Typical delivery 3–7 business days after payment.',
  confirm_ar: 'You will receive an order confirmation email and tracking when your package ships.',
  company_ar: 'Nafas. USA',
} as const
