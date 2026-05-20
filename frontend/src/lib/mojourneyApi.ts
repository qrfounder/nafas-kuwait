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
