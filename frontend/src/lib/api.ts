import { getApiBase } from './apiBase'

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly kind: 'network' | 'server' | 'validation' = 'server',
  ) {
    super(message)
    this.name = 'ApiRequestError'
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) return null
  try {
    return await res.json()
  } catch {
    return null
  }
}

function detailMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return 'فشل الطلب'
  const d = (data as { detail?: unknown }).detail
  if (typeof d === 'string') return d
  if (Array.isArray(d) && d[0] && typeof d[0] === 'object' && 'msg' in d[0]) {
    return String((d[0] as { msg: string }).msg)
  }
  return 'فشل الطلب'
}

async function apiPost(path: string, body: Record<string, unknown>) {
  const url = `${getApiBase()}${path}`
  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ApiRequestError(
      'تعذّر الاتصال بالخادم. تحققي من الإنترنت وحاولي مرة أخرى، أو تواصلي معنا على واتساب.',
      'network',
    )
  }

  const data = await parseJsonSafe(res)
  if (!res.ok) {
    const msg = detailMessage(data)
    throw new ApiRequestError(
      res.status === 422
        ? 'تحققي من الاسم (حرفين على الأقل) ورقم الجوال أو الأرضي (8 أرقام كويتية).'
        : msg,
      res.status === 422 ? 'validation' : 'server',
    )
  }
  if (!data || typeof data !== 'object') {
    throw new ApiRequestError('استجابة غير متوقعة من الخادم. حاولي مرة أخرى.', 'server')
  }
  return data as Record<string, unknown>
}

export async function createOrder(body: Record<string, unknown>) {
  return apiPost('/api/orders', body)
}

export async function acceptUpsell(orderNumber: string, body: Record<string, unknown>) {
  const url = `${getApiBase()}/api/orders/${orderNumber}/upsell`
  let res: Response
  try {
    res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ApiRequestError('تعذّر الاتصال بالخادم.', 'network')
  }
  const data = await parseJsonSafe(res)
  if (!res.ok) {
    throw new ApiRequestError(detailMessage(data), 'server')
  }
  return data as Record<string, unknown>
}

export async function submitContact(body: Record<string, unknown>) {
  return apiPost('/api/contact', body)
}
