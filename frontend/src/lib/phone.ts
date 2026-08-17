/** US phone: 10-digit national number → stored as 1XXXXXXXXXX (E.164 without +). */

const US_LOCAL_RE = /^[2-9]\d{2}[2-9]\d{6}$/
const ARABIC_DIGITS: Record<string, string> = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
}

function toAsciiDigits(raw: string): string {
  return raw.replace(/[٠-٩۰-۹]/g, (ch) => ARABIC_DIGITS[ch] || ch)
}

export function normalizeSaudiPhone(raw: string): string | null {
  let digits = toAsciiDigits(raw).replace(/\D/g, '')
  if (digits.startsWith('00966')) digits = digits.slice(5)
  else if (digits.startsWith('966')) digits = digits.slice(3)
  if (/^05\d{8}$/.test(digits)) return digits
  if (/^5\d{8}$/.test(digits)) return `0${digits}`
  return null
}

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
