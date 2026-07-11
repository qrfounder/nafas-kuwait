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

/** Stripe checkout create-order response. */
export type OrderOut = {
  order_number?: string
  checkout_url?: string
  [key: string]: unknown
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
  if (!data || typeof data !== 'object') return 'Request failed'
  const d = (data as { detail?: unknown }).detail
  if (typeof d === 'string') return d
  if (Array.isArray(d) && d[0] && typeof d[0] === 'object' && 'msg' in d[0]) {
    return String((d[0] as { msg: string }).msg)
  }
  return 'Request failed'
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
      'Could not reach the server. Check your connection and try again, or email support@naffas.shop.',
      'network',
    )
  }

  const data = await parseJsonSafe(res)
  if (!res.ok) {
    const msg = detailMessage(data)
    throw new ApiRequestError(
      res.status === 422
        ? 'Please check your name (at least 2 characters) and a valid US phone number.'
        : msg,
      res.status === 422 ? 'validation' : 'server',
    )
  }
  if (!data || typeof data !== 'object') {
    throw new ApiRequestError('Unexpected server response. Please try again.', 'server')
  }
  return data as Record<string, unknown>
}

export async function createOrder(body: Record<string, unknown>): Promise<OrderOut> {
  return (await apiPost('/api/orders', body)) as OrderOut
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
    throw new ApiRequestError('Could not reach the server.', 'network')
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
