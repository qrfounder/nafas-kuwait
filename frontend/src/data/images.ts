/** Product imagery — real SKUs in /public/products; bundles use lifestyle fallbacks */

const u = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const local = (path: string) => `/products/${path}`

export const IMAGES = {
  hero: local('period-belt.png'),
  heroAlt: local('lumbar.png'),

  products: {
    'cycle-relief': local('period-belt.png'),
    'body-relief': local('head-massager-lifestyle.png'),
    'mother-gift': local('knee-sleeves.png'),
  } as Record<string, string>,

  skus: {
    'period-belt': local('period-belt.png'),
    lumbar: local('lumbar.png'),
    neck: local('neck.png'),
    'head-massager': local('head-massager.png'),
    'knee-sleeves': local('knee-sleeves.png'),
    'gift-box': u('photo-1513885535751-8b923fbd345f', 600),
  } as Record<string, string>,

  pain: {
    cycle: local('period-belt.png'),
    back: local('lumbar.png'),
    neck: local('neck.png'),
  },

  reviews: {
    heat: local('period-belt.png'),
    gift: local('knee-sleeves-box.png'),
    box: u('photo-1584308663914-8258c762c90d', 500),
    massage: local('neck.png'),
    cod: u('photo-1586528116311-ad8dd3c8310d', 500),
    family: local('period-belt-lifestyle.png'),
  },
}

export function productImage(slug: string): string {
  return IMAGES.products[slug] ?? IMAGES.hero
}

export function skuImage(sku: string): string {
  return IMAGES.skus[sku] ?? IMAGES.hero
}
