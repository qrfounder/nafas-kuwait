/**
 * Single source for GMC business identity.
 * Fill LEGAL_* / address / phone with your real US entity before Merchant Center verification.
 * Do not invent a street address. fake addresses also fail GMC.
 */
export const BUSINESS = {
  brandName: 'Nafas',
  legalName: '', // e.g. "Nafas LLC"
  supportEmail: 'support@naffas.shop',
  supportPhone: '', // e.g. "+1-555-0100"
  addressLine1: '',
  addressLine2: '',
  city: '',
  region: '', // state code e.g. "CA"
  postalCode: '',
  country: 'US',
  shopUrl: 'https://naffas.shop',
  returnsUrl: 'https://naffas.shop/returns',
  shippingUrl: 'https://naffas.shop/policies#shipping',
  policiesUrl: 'https://naffas.shop/policies',
}

export function hasPhysicalAddress(): boolean {
  return Boolean(BUSINESS.addressLine1 && BUSINESS.city && BUSINESS.region && BUSINESS.postalCode)
}

export function formatAddressLines(): string[] {
  if (!hasPhysicalAddress()) return []
  const lines: string[] = [BUSINESS.addressLine1]
  if (BUSINESS.addressLine2) lines.push(BUSINESS.addressLine2)
  lines.push(`${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`)
  lines.push('United States')
  return lines
}
