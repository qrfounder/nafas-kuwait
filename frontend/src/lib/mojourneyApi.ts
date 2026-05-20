const STORAGE_KEY = 'mojourney_admin_key'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export class MojourneyAuthError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'MojourneyAuthError'
  }
}

export type AdminOrdersSummary = {
  total: number
  last_24h: number
  by_status: Record<string, number>
}

export type AdminOrderRow = {
  order_number: string
  created_at: string
  customer_name: string
  customer_phone: string
  governorate: string | null
  area: string | null
  product_slug: string
  offer_tier: number
  total_usd: number
  status: string
  utm_source: string | null
  utm_campaign: string | null
  source: string | null
  upsell_accepted: boolean
}

export function getStoredAdminKey(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredAdminKey(key: string) {
  sessionStorage.setItem(STORAGE_KEY, key.trim())
}

export function clearStoredAdminKey() {
  sessionStorage.removeItem(STORAGE_KEY)
}

async function parseAdminJson(res: Response) {
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    throw new MojourneyAuthError(
      typeof data.detail === 'string' ? data.detail : 'غير مصرّح',
      401,
    )
  }
  if (!res.ok) {
    throw new Error(typeof data.detail === 'string' ? data.detail : 'فشل الطلب')
  }
  return data
}

export async function adminPing(): Promise<{
  ok: boolean
  admin_configured: boolean
  password_login?: boolean
}> {
  const res = await fetch(`${API}/api/admin/ping`)
  if (!res.ok) throw new Error('تعذّر الاتصال بالـ API')
  return res.json()
}

export async function mojourneyLogin(username: string, password: string): Promise<string> {
  const res = await fetch(`${API}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.trim(), password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(typeof data.detail === 'string' ? data.detail : 'فشل تسجيل الدخول')
  }
  const token = data.session_token as string | undefined
  if (!token) throw new Error('استجابة غير متوقعة من السيرفر')
  return token
}

export async function mojourneyLogout(sessionToken: string | null) {
  if (!sessionToken) return
  try {
    await fetch(`${API}/api/admin/logout`, {
      method: 'POST',
      headers: { 'X-Admin-Key': sessionToken },
    })
  } catch {
    /* ignore */
  }
}

export async function fetchAdminSummary(key: string): Promise<AdminOrdersSummary> {
  const res = await fetch(`${API}/api/admin/summary`, {
    headers: { 'X-Admin-Key': key },
  })
  return parseAdminJson(res)
}

export async function fetchAdminOrders(key: string): Promise<AdminOrderRow[]> {
  const res = await fetch(`${API}/api/admin/orders?limit=200`, {
    headers: { 'X-Admin-Key': key },
  })
  return parseAdminJson(res)
}

export type AdminPixels = {
  shop_url: string
  meta_pixel_id: string
  tiktok_pixel_id: string
  snap_pixel_id: string
  updated_at?: string | null
}

export type AdminRedirect = {
  id: string
  from_path: string
  to_path: string
  to_path_resolved: string
  status_code: number
  enabled: boolean
  note: string | null
}

export type AdminProduct = {
  slug: string
  title_ar: string
  subtitle_ar: string
  base_price: number
  anchor_single: number
  active: boolean
  tiers: { tier: number; label_ar: string; price: number; anchor: number; badge: string | null }[]
  product_url: string
  has_override: boolean
  includes?: string[]
}

export type AdminSku = {
  sku: string
  label_ar: string
  hint_ar: string
  price: number
  anchor: number
  quantity: number
  active: boolean
  image_url: string
  has_override: boolean
}

function adminHeaders(key: string) {
  return { 'X-Admin-Key': key, 'Content-Type': 'application/json' }
}

export async function fetchAdminPixels(key: string): Promise<AdminPixels> {
  const res = await fetch(`${API}/api/admin/settings/pixels`, { headers: adminHeaders(key) })
  return parseAdminJson(res)
}

export async function saveAdminPixels(key: string, body: AdminPixels): Promise<AdminPixels> {
  const res = await fetch(`${API}/api/admin/settings/pixels`, {
    method: 'PUT',
    headers: adminHeaders(key),
    body: JSON.stringify(body),
  })
  return parseAdminJson(res)
}

export async function fetchAdminRedirects(key: string): Promise<AdminRedirect[]> {
  const res = await fetch(`${API}/api/admin/redirects`, { headers: adminHeaders(key) })
  return parseAdminJson(res)
}

export async function createAdminRedirect(
  key: string,
  body: Omit<AdminRedirect, 'id' | 'to_path_resolved'>,
): Promise<AdminRedirect> {
  const res = await fetch(`${API}/api/admin/redirects`, {
    method: 'POST',
    headers: adminHeaders(key),
    body: JSON.stringify(body),
  })
  return parseAdminJson(res)
}

export async function updateAdminRedirect(
  key: string,
  id: string,
  body: Omit<AdminRedirect, 'id' | 'to_path_resolved'>,
): Promise<AdminRedirect> {
  const res = await fetch(`${API}/api/admin/redirects/${id}`, {
    method: 'PUT',
    headers: adminHeaders(key),
    body: JSON.stringify(body),
  })
  return parseAdminJson(res)
}

export async function deleteAdminRedirect(key: string, id: string): Promise<void> {
  const res = await fetch(`${API}/api/admin/redirects/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(key),
  })
  await parseAdminJson(res)
}

export async function fetchAdminProducts(key: string): Promise<AdminProduct[]> {
  const res = await fetch(`${API}/api/admin/products`, { headers: adminHeaders(key) })
  return parseAdminJson(res)
}

export async function fetchAdminSkus(key: string): Promise<AdminSku[]> {
  const res = await fetch(`${API}/api/admin/skus`, { headers: adminHeaders(key) })
  return parseAdminJson(res)
}

export async function saveAdminSku(
  key: string,
  sku: string,
  body: Omit<AdminSku, 'sku' | 'image_url' | 'has_override'>,
): Promise<AdminSku> {
  const res = await fetch(`${API}/api/admin/skus/${sku}`, {
    method: 'PUT',
    headers: adminHeaders(key),
    body: JSON.stringify(body),
  })
  return parseAdminJson(res)
}

export type AnalyticsFunnel = {
  page_view: number
  view_content: number
  add_to_cart: number
  checkout_visit: number
  checkout_form_start: number
  purchase: number
}

export type AnalyticsReport = {
  range_from: string
  range_to: string
  preset: string
  unique_visitors: number
  unique_sessions: number
  total_events: number
  funnel: AnalyticsFunnel
  by_country: { country: string | null; city: string | null; visitors: number; events: number; purchases: number }[]
  by_city: { country: string | null; city: string | null; visitors: number; events: number; purchases: number }[]
  daily: {
    date: string
    visitors: number
    page_views: number
    add_to_cart: number
    checkout_visit: number
    checkout_form_start: number
    purchases: number
  }[]
  recent_events: {
    id: string
    created_at: string
    event_type: string
    path: string | null
    product_slug: string | null
    visitor_id: string
    ip_address: string | null
    country: string | null
    city: string | null
    value: number | null
  }[]
}

export async function fetchAdminAnalytics(
  key: string,
  opts: { preset?: string; from?: string; to?: string },
): Promise<AnalyticsReport> {
  const q = new URLSearchParams()
  if (opts.preset) q.set('preset', opts.preset)
  if (opts.from) q.set('from', opts.from)
  if (opts.to) q.set('to', opts.to)
  const res = await fetch(`${API}/api/admin/analytics/report?${q}`, { headers: adminHeaders(key) })
  return parseAdminJson(res)
}

export type LiveVisitor = {
  session_id: string
  visitor_id: string
  path: string
  stage: string
  country: string | null
  city: string | null
  lat: number | null
  lng: number | null
  ip_address: string | null
  is_returning: boolean
  utm_source: string | null
  product_slug: string | null
  last_seen: string
  seconds_ago: number
}

export type LiveMarker = {
  lat: number
  lng: number
  stage: string
  city: string | null
  country: string | null
}

export type LiveSnapshot = {
  updated_at: string
  visitors_now: number
  funnel: Record<string, number>
  visitors: LiveVisitor[]
  markers: LiveMarker[]
  locations: { city: string | null; country: string | null; count: number }[]
  today_orders: number
  today_sessions: number
  today_sales_usd: number
  returning_now: number
  new_now: number
  hourly_sessions: { hour: string; sessions: number; orders: number }[]
  hourly_orders: { hour: string; sessions: number; orders: number }[]
}

export async function fetchAdminLive(key: string): Promise<LiveSnapshot> {
  const res = await fetch(`${API}/api/admin/live/snapshot`, { headers: adminHeaders(key) })
  return parseAdminJson(res)
}

export async function saveAdminProduct(
  key: string,
  slug: string,
  body: {
    title_ar: string
    subtitle_ar: string
    base_price: number
    anchor_single: number
    active: boolean
    tiers_json: string | null
  },
): Promise<AdminProduct> {
  const res = await fetch(`${API}/api/admin/products/${slug}`, {
    method: 'PUT',
    headers: adminHeaders(key),
    body: JSON.stringify(body),
  })
  return parseAdminJson(res)
}
