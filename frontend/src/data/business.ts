/**
 * Single source for GMC business identity.
 * Must match Merchant Center → Business info exactly.
 * Sell-to market is the United States; registered business address is Morocco.
 */
export const BUSINESS = {
  brandName: 'Nafas',
  /** Exact Merchant Center business name */
  legalName: 'Naffas',
  supportEmail: 'support@naffas.shop',
  supportPhone: '',
  /** Exact Merchant Center street lines */
  addressLine1: 'Douar Oubaha Tamraght',
  addressLine2: 'AOURIR BANLIEUE',
  city: 'Agadir',
  region: 'Agadir',
  postalCode: '80023',
  /** ISO country of the registered business address */
  country: 'MA',
  countryName: 'Morocco',
  /** Primary Shopping destination (Merchant Center Countries) */
  salesCountry: 'US',
  salesCountryName: 'United States',
  shopUrl: 'https://naffas.shop',
  returnsUrl: 'https://naffas.shop/returns',
  shippingUrl: 'https://naffas.shop/policies#shipping',
  policiesUrl: 'https://naffas.shop/policies',
}

export function hasPhysicalAddress(): boolean {
  return Boolean(BUSINESS.addressLine1 && BUSINESS.city && BUSINESS.postalCode && BUSINESS.country)
}

/** Multi-line postal address matching GMC business details. */
export function formatAddressLines(): string[] {
  if (!hasPhysicalAddress()) return []
  const lines: string[] = [BUSINESS.addressLine1]
  if (BUSINESS.addressLine2) lines.push(BUSINESS.addressLine2)
  const cityLine = [BUSINESS.city, BUSINESS.region, BUSINESS.postalCode].filter(Boolean).join(' ')
  lines.push(cityLine)
  lines.push(BUSINESS.countryName)
  return lines
}
