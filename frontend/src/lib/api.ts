const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function createOrder(body: Record<string, unknown>) {
  const res = await fetch(`${API}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    const d = data.detail
    const msg = typeof d === 'string' ? d : Array.isArray(d) ? d[0]?.msg : 'فشل الطلب'
    throw new Error(msg || 'فشل الطلب')
  }
  return data
}

export async function acceptUpsell(orderNumber: string, body: Record<string, unknown>) {
  const res = await fetch(`${API}/api/orders/${orderNumber}/upsell`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    const d = data.detail
    const msg = typeof d === 'string' ? d : Array.isArray(d) ? d[0]?.msg : 'فشل الإضافة'
    throw new Error(msg || 'فشل الإضافة')
  }
  return data
}

export async function submitContact(body: Record<string, unknown>) {
  const res = await fetch(`${API}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('فشل الإرسال')
  return res.json()
}
