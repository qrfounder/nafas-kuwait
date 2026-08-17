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

/** Ad platforms: amounts in the campaign currency. */
function moneyPayload(amount: number, currency: 'USD' | 'SAR' = 'USD') {
  return { value: amount, currency }
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
  if (loaded) return
  const meta = pixels.meta || import.meta.env.VITE_META_PIXEL_ID
  const tt = pixels.tiktok || import.meta.env.VITE_TIKTOK_PIXEL_ID
  const snap = pixels.snap || import.meta.env.VITE_SNAP_PIXEL_ID
  if (!meta && !tt && !snap) return
  loaded = true
  if (meta) initMeta(meta)
  if (tt) initTikTok(tt)
  if (snap) initSnap(snap)
  window.dispatchEvent(new Event('nafas-pixels-ready'))
}

/** @deprecated use StoreProvider bootstrap; kept for Mojourney-only loads */
export function initAnalyticsDeferred(): void {
  initAnalyticsFromPixels({})
}

export function trackViewContent(slug: string, value: number, currency: 'USD' | 'SAR' = 'USD') {
  const money = moneyPayload(value, currency)
  trackStoreEvent('view_content', { product_slug: slug, value })
  const eventId = newEventId()
  window.fbq?.('track', 'ViewContent', { content_ids: [slug], ...money }, { eventID: eventId })
  window.ttq?.track('ViewContent', { content_id: slug, ...money })
  window.snaptr?.('track', 'VIEW_CONTENT', { item_ids: [slug], price: money.value, currency: money.currency })
  return eventId
}

export function trackAddToCart(value: number, slug: string, currency: 'USD' | 'SAR' = 'USD') {
  const money = moneyPayload(value, currency)
  trackStoreEvent('add_to_cart', { product_slug: slug.split(':')[0], value })
  const eventId = newEventId()
  window.fbq?.('track', 'AddToCart', { ...money, content_ids: [slug] }, { eventID: eventId })
  window.ttq?.track('AddToCart', { ...money, content_id: slug })
  window.snaptr?.('track', 'ADD_CART', { price: money.value, currency: money.currency, item_ids: [slug] })
  return eventId
}

export function trackInitiateCheckout(value: number, currency: 'USD' | 'SAR' = 'USD') {
  const money = moneyPayload(value, currency)
  trackStoreEvent('checkout_visit', { value })
  const eventId = newEventId()
  window.fbq?.('track', 'InitiateCheckout', money, { eventID: eventId })
  window.ttq?.track('InitiateCheckout', money)
  window.snaptr?.('track', 'START_CHECKOUT', { price: money.value, currency: money.currency })
  return eventId
}

export function trackPurchase(value: number, eventId: string, currency: 'USD' | 'SAR' = 'USD') {
  const money = moneyPayload(value, currency)
  window.fbq?.('track', 'Purchase', money, { eventID: eventId })
  window.ttq?.track('CompletePayment', money)
  window.snaptr?.('track', 'PURCHASE', { price: money.value, currency: money.currency, client_dedup_id: eventId })
}

const ATTR_KEY = 'ksa_ad_attr'

export function getAttribution() {
  const params = new URLSearchParams(window.location.search)
  const fresh = {
    utm_source: params.get('utm_source'),
    utm_campaign: params.get('utm_campaign'),
    ttclid: params.get('ttclid'),
    fbclid: params.get('fbclid'),
  }
  let stored: Record<string, string | null> = {}
  try {
    stored = JSON.parse(sessionStorage.getItem(ATTR_KEY) || '{}') as Record<string, string | null>
  } catch {
    stored = {}
  }
  if (Object.values(fresh).some(Boolean)) {
    const merged = { ...stored, ...Object.fromEntries(Object.entries(fresh).filter(([, v]) => v)) }
    try {
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(merged))
    } catch {
      /* private mode */
    }
    stored = merged
  }
  const fbclid = fresh.fbclid || stored.fbclid
  const fbcCookie = document.cookie.match(/_fbc=([^;]+)/)?.[1] || null
  const fbc = fbcCookie || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : null)
  return {
    utm_source: fresh.utm_source || stored.utm_source || null,
    utm_campaign: fresh.utm_campaign || stored.utm_campaign || null,
    source: fresh.utm_source || stored.utm_source || 'direct',
    fbp: document.cookie.match(/_fbp=([^;]+)/)?.[1] || null,
    fbc,
    ttclid: fresh.ttclid || stored.ttclid || null,
    sc_click_id: params.get('ScCid') || params.get('sccid'),
  }
}
