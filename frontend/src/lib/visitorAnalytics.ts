const VISITOR_KEY = 'nafas_visitor_id'
const SESSION_KEY = 'nafas_session_id'

import { getApiBase } from './apiBase'

export type StoreEventType =
  | 'page_view'
  | 'view_content'
  | 'add_to_cart'
  | 'checkout_visit'
  | 'checkout_form_start'
  | 'purchase'

function uuid(): string {
  return crypto.randomUUID()
}

export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = uuid()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return uuid()
  }
}

export function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = uuid()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return uuid()
  }
}

function utmFromUrl(): Record<string, string | null> {
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get('utm_source'),
    utm_medium: p.get('utm_medium'),
    utm_campaign: p.get('utm_campaign'),
    utm_content: p.get('utm_content'),
  }
}

export function trackStoreEvent(
  eventType: StoreEventType,
  opts?: {
    path?: string
    product_slug?: string
    value?: number
    metadata?: Record<string, unknown>
  },
): void {
  const utm = utmFromUrl()
  const body = {
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    event_type: eventType,
    path: opts?.path ?? window.location.pathname,
    product_slug: opts?.product_slug ?? null,
    value: opts?.value ?? null,
    referrer: document.referrer || null,
    ...utm,
    metadata: opts?.metadata ?? null,
  }

  const url = `${getApiBase()}/api/analytics/track`
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' })
      if (navigator.sendBeacon(url, blob)) return
    }
  } catch {
    /* fall through */
  }

  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {})
}
