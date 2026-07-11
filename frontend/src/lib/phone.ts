/** US phone: 10-digit national number → stored as 1XXXXXXXXXX (E.164 without +). */

const US_LOCAL_RE = /^[2-9]\d{2}[2-9]\d{6}$/

export function normalizeUsPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '')
  if (!digits) return null

  if (digits.startsWith('001')) digits = digits.slice(3)
  if (digits.startsWith('1') && digits.length === 11) {
    const national = digits.slice(1)
    if (US_LOCAL_RE.test(national)) return digits
    return null
  }

  if (digits.length === 10 && US_LOCAL_RE.test(digits)) return `1${digits}`

  return null
}

export function validateUsPhone(raw: string): { ok: boolean; error: string; normalized?: string } {
  const normalized = normalizeUsPhone(raw)
  if (normalized) return { ok: true, error: '', normalized }
  return {
    ok: false,
    error: 'Enter a valid US phone number (10 digits). Example: 4155552671',
  }
}

/** @deprecated Use validateUsPhone */
export function validateKuwaitPhone(raw: string) {
  return validateUsPhone(raw)
}

/** @deprecated Use normalizeUsPhone */
export function normalizeKuwaitPhone(raw: string) {
  return normalizeUsPhone(raw)
}
