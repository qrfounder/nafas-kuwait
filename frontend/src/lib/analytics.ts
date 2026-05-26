import { usdToKwd } from './currency'
import { trackStoreEvent } from './visitorAnalytics'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
    ttq?: TikTokPixel
    snaptr?: (...args: unknown[]) => void
    __lastEventId?: string
  }
}

type TikTokPixel = {
  track: (...args: unknown[]) => void
  load: (id: string) => void
  page: () => void
  _queue?: unknown[][]
}

export function newEventId(): string {
  const id = crypto.randomUUID()
  window.__lastEventId = id
  return id
}

export function getLastEventId(): string {
  return window.__lastEventId || crypto.randomUUID()
}

/** Ad platforms: send KWD amounts to match storefront display. */
function kwdPayload(usd: number) {
  return { value: usdToKwd(usd), currency: 'KWD' as const }
}

function loadScript(src: string, id: string, onload?: () => void): void {
  if (document.getElementById(id)) {
    onload?.()
    return
  }
  const s = document.createElement('script')
  s.id = id
  s.async = true
  s.src = src
  if (onload) s.onload = onload
  document.head.appendChild(s)
}

function initMeta(pixelId: string) {
  if (!window.fbq) {
    const n: (...args: unknown[]) => void = function (...args) {
      // @ts-expect-error queue
      n.queue.push(args)
    }
    // @ts-expect-error queue
    n.queue = []
    window.fbq = n
    if (!window._fbq) window._fbq = n
    loadScript('https://connect.facebook.net/en_US/fbevents.js', 'fb-pixel')
  }
  window.fbq?.('init', pixelId)
  window.fbq?.('track', 'PageView')
}

function initTikTok(pixelId: string) {
  const queue: unknown[][] = []
  const stub: TikTokPixel = {
    _queue: queue,
    track: (...args: unknown[]) => {
      queue.push(['track', ...args])
    },
    page: () => {
      queue.push(['page'])
    },
    load: (id: string) => {
      loadScript('https://analytics.tiktok.com/i18n/pixel/events.js', 'tt-pixel', () => {
        const live = window.ttq
        if (!live || live === stub) return
        live.load(id)
        live.page()
        for (const item of queue) {
          const [cmd, ...rest] = item
          if (cmd === 'track') live.track(...rest)
          else if (cmd === 'page') live.page()
        }
        queue.length = 0
      })
    },
  }
  window.ttq = stub
  stub.load(pixelId)
}

function initSnap(pixelId: string) {
  const tr: ((...args: unknown[]) => void) & { queue?: unknown[] } = function (...args) {
    tr.queue?.push(args)
  }
  tr.queue = []
  window.snaptr = tr
  loadScript('https://sc-static.net/scevent.min.js', 'snap-pixel', () => {
    window.snaptr?.('init', pixelId, {})
    window.snaptr?.('track', 'PAGE_VIEW')
  })
}

let loaded = false

export function initAnalyticsFromPixels(pixels: { meta?: string; tiktok?: string; snap?: string }): void {
  const run = () => {
    if (loaded) return
    loaded = true
    const meta = pixels.meta || import.meta.env.VITE_META_PIXEL_ID
    const tt = pixels.tiktok || import.meta.env.VITE_TIKTOK_PIXEL_ID
    const snap = pixels.snap || import.meta.env.VITE_SNAP_PIXEL_ID
    if (meta) initMeta(meta)
    if (tt) initTikTok(tt)
    if (snap) initSnap(snap)
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(run, { timeout: 800 })
  } else {
    setTimeout(run, 400)
  }
}

/** @deprecated use StoreProvider bootstrap; kept for Mojourney-only loads */
export function initAnalyticsDeferred(): void {
  initAnalyticsFromPixels({})
}

export function trackViewContent(slug: string, valueUsd: number) {
  const { value, currency } = kwdPayload(valueUsd)
  trackStoreEvent('view_content', { product_slug: slug, value })
  const eventId = newEventId()
  window.fbq?.('track', 'ViewContent', { content_ids: [slug], value, currency }, { eventID: eventId })
  window.ttq?.track('ViewContent', { content_id: slug, value, currency })
  window.snaptr?.('track', 'VIEW_CONTENT', { item_ids: [slug], price: value, currency })
  return eventId
}

export function trackAddToCart(valueUsd: number, slug: string) {
  const { value, currency } = kwdPayload(valueUsd)
  trackStoreEvent('add_to_cart', { product_slug: slug.split(':')[0], value })
  const eventId = newEventId()
  window.fbq?.('track', 'AddToCart', { value, currency, content_ids: [slug] }, { eventID: eventId })
  window.ttq?.track('AddToCart', { value, currency, content_id: slug })
  window.snaptr?.('track', 'ADD_CART', { price: value, currency, item_ids: [slug] })
  return eventId
}

export function trackInitiateCheckout(valueUsd: number) {
  const { value, currency } = kwdPayload(valueUsd)
  trackStoreEvent('checkout_visit', { value })
  const eventId = newEventId()
  window.fbq?.('track', 'InitiateCheckout', { value, currency }, { eventID: eventId })
  window.ttq?.track('InitiateCheckout', { value, currency })
  window.snaptr?.('track', 'START_CHECKOUT', { price: value, currency })
  return eventId
}

export function trackPurchase(valueUsd: number, eventId: string) {
  const { value, currency } = kwdPayload(valueUsd)
  window.fbq?.('track', 'Purchase', { value, currency }, { eventID: eventId })
  window.ttq?.track('CompletePayment', { value, currency })
  window.snaptr?.('track', 'PURCHASE', { price: value, currency, client_dedup_id: eventId })
}

export function getAttribution() {
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_campaign: params.get('utm_campaign'),
    source: params.get('utm_source') || 'direct',
    fbp: document.cookie.match(/_fbp=([^;]+)/)?.[1] || null,
    fbc: document.cookie.match(/_fbc=([^;]+)/)?.[1] || null,
    ttclid: params.get('ttclid'),
    sc_click_id: params.get('ScCid') || params.get('sccid'),
  }
}
