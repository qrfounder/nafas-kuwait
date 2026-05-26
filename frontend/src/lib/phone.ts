/** Kuwait: 8-digit national number (mobile or landline) → stored as 965XXXXXXXX */

const KW_LOCAL_RE = /^[2-9]\d{7}$/

export function normalizeKuwaitPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '')
  if (!digits) return null

  if (digits.startsWith('00965')) digits = digits.slice(2)
  if (digits.startsWith('965')) {
    if (digits.length === 11 && KW_LOCAL_RE.test(digits.slice(3))) return digits
    if (digits.length > 11) digits = digits.slice(0, 11)
    if (digits.length === 11 && KW_LOCAL_RE.test(digits.slice(3))) return digits
    return null
  }

  if (digits.startsWith('0') && digits.length === 9) digits = digits.slice(1)

  if (digits.length === 8 && KW_LOCAL_RE.test(digits)) return `965${digits}`

  if (digits.length > 8) {
    if (digits.startsWith('965') && digits.length >= 11) {
      const cand = digits.slice(0, 11)
      if (KW_LOCAL_RE.test(cand.slice(3))) return cand
    }
  }

  return null
}

export function validateKuwaitPhone(raw: string): { ok: boolean; error: string; normalized?: string } {
  const normalized = normalizeKuwaitPhone(raw)
  if (normalized) return { ok: true, error: '', normalized }
  return {
    ok: false,
    error: 'أدخلي رقم جوال أو أرضي كويتي (8 أرقام). مثال: 51234567 أو 22334455',
  }
}
