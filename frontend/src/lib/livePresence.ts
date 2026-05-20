import { getSessionId, getVisitorId } from './visitorAnalytics'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const HAS_VISITED_KEY = 'nafas_has_visited'

export type LiveStage = 'browsing' | 'cart' | 'checkout' | 'purchased'

export function isReturningVisitor(): boolean {
  try {
    return localStorage.getItem(HAS_VISITED_KEY) === '1'
  } catch {
    return false
  }
}

export function markVisitorSeen(): void {
  try {
    localStorage.setItem(HAS_VISITED_KEY, '1')
  } catch {
    /* ignore */
  }
}

function utmSource(): string | null {
  try {
    return new URLSearchParams(window.location.search).get('utm_source')
  } catch {
    return null
  }
}

export function inferLiveStage(opts: {
  path: string
  itemCount: number
  checkoutOpen: boolean
}): LiveStage {
  if (opts.path.startsWith('/thank-you')) return 'purchased'
  if (opts.checkoutOpen) return 'checkout'
  if (opts.itemCount > 0) return 'cart'
  return 'browsing'
}

export function sendLiveHeartbeat(opts: {
  path: string
  stage: LiveStage
  product_slug?: string | null
}): void {
  const returning = isReturningVisitor()
  if (!returning) markVisitorSeen()

  const body = {
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    path: opts.path,
    stage: opts.stage,
    is_returning: returning,
    utm_source: utmSource(),
    product_slug: opts.product_slug ?? null,
  }

  void fetch(`${API}/api/analytics/heartbeat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {})
}
