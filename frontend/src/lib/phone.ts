export function normalizeKuwaitPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  let d = digits
  if (d.startsWith('00965')) d = d.slice(2)
  if (d.startsWith('965')) {
    /* ok */
  } else if (d.length === 8 && ['5', '6', '9'].includes(d[0])) {
    d = '965' + d
  } else return null
  if (/^965[569]\d{7}$/.test(d)) return d
  return null
}

export function validateKuwaitPhone(raw: string): { ok: boolean; error: string } {
  if (normalizeKuwaitPhone(raw)) return { ok: true, error: '' }
  return { ok: false, error: 'رقم الكويت غير صحيح. أدخلي 8 أرقام تبدأ بـ 5 أو 6 أو 9' }
}
