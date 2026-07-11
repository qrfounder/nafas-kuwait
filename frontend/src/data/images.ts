/** Product imagery paths (PNG keys → WebP served via OptimizedImage + manifest). */

const local = (path: string) => `/products/${path}`
const emotional = (path: string) => `/products/emotional/${path}`

export const IMAGES = {
  hero: emotional('home/hero.png'),
  heroAlt: emotional('home/pain-back.png'),

  products: {
    'cycle-relief': emotional('cycle-relief/hero.png'),
    'body-relief': emotional('body-relief/hero.png'),
    'mother-gift': emotional('mother-gift/hero.png'),
  } as Record<string, string>,

  skus: {
    'period-belt': local('period-belt.png'),
    lumbar: local('lumbar.png'),
    neck: local('neck.png'),
    'head-massager': local('head-massager.png'),
    'knee-sleeves': local('knee-sleeves.png'),
    'gift-box': local('gift-box.png'),
  } as Record<string, string>,

  /** Homepage comfort-theme cards */
  pain: {
    cycle: emotional('home/pain-cycle.png'),
    back: emotional('home/pain-back.png'),
    neck: emotional('home/pain-neck.png'),
  },
}

export function productImage(slug: string): string {
  return IMAGES.products[slug] ?? IMAGES.hero
}

export function skuImage(sku: string): string {
  return IMAGES.skus[sku] ?? IMAGES.hero
}

export function skuShowcaseImage(sku: string): string {
  return `/products/emotional/sku/${sku}-showcase.png`
}
