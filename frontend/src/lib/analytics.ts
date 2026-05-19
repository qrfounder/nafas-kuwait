declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
    ttq?: { track: (...args: unknown[]) => void; load: (id: string) => void; page: () => void }
    snaptr?: (...args: unknown[]) => void
    __lastEventId?: string
  }
}

function newEventId(): string {
  const id = crypto.randomUUID()
  window.__lastEventId = id
  return id
}

export function getLastEventId(): string {
  return window.__lastEventId || crypto.randomUUID()
}

function loadScript(src: string, id: string): void {
  if (document.getElementById(id)) return
  const s = document.createElement('script')
  s.id = id
  s.async = true
  s.src = src
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
  window.ttq = window.ttq || { track: () => {}, load: () => {}, page: () => {} }
  loadScript('https://analytics.tiktok.com/i18n/pixel/events.js', 'tt-pixel')
  window.ttq.load(pixelId)
  window.ttq.page()
}

function initSnap(pixelId: string) {
  const tr: ((...args: unknown[]) => void) & { queue?: unknown[] } = function (...args) {
    tr.queue?.push(args)
  }
  tr.queue = []
  window.snaptr = tr
  loadScript('https://sc-static.net/scevent.min.js', 'snap-pixel')
  window.snaptr?.('init', pixelId, {})
  window.snaptr?.('track', 'PAGE_VIEW')
}

let loaded = false

export function initAnalyticsDeferred(): void {
  const run = () => {
    if (loaded) return
    loaded = true
    const meta = import.meta.env.VITE_META_PIXEL_ID
    const tt = import.meta.env.VITE_TIKTOK_PIXEL_ID
    const snap = import.meta.env.VITE_SNAP_PIXEL_ID
    if (meta) initMeta(meta)
    if (tt) initTikTok(tt)
    if (snap) initSnap(snap)
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(run, { timeout: 2500 })
  } else {
    setTimeout(run, 2500)
  }
}

export function trackViewContent(slug: string, value: number) {
  const eventId = newEventId()
  window.fbq?.('track', 'ViewContent', { content_ids: [slug], value, currency: 'USD' }, { eventID: eventId })
  window.ttq?.track('ViewContent', { content_id: slug, value, currency: 'USD' })
  return eventId
}

export function trackAddToCart(value: number, slug: string) {
  const eventId = newEventId()
  window.fbq?.('track', 'AddToCart', { value, currency: 'USD', content_ids: [slug] }, { eventID: eventId })
  window.ttq?.track('AddToCart', { value, currency: 'USD', content_id: slug })
  return eventId
}

export function trackInitiateCheckout(value: number) {
  const eventId = newEventId()
  window.fbq?.('track', 'InitiateCheckout', { value, currency: 'USD' }, { eventID: eventId })
  window.ttq?.track('InitiateCheckout', { value, currency: 'USD' })
  return eventId
}

export function trackPurchase(value: number, eventId: string) {
  window.fbq?.('track', 'Purchase', { value, currency: 'USD' }, { eventID: eventId })
  window.ttq?.track('CompletePayment', { value, currency: 'USD' })
  window.snaptr?.('track', 'PURCHASE', { price: value, currency: 'USD', client_dedup_id: eventId })
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
  }
}
