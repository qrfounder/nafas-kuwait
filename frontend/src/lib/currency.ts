/** Prices in the catalog are USD. Display is always USD for the US store. */

export function formatUsd(usd: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: usd % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(usd)
}

/** @deprecated Use formatUsd. kept for any leftover imports during migration */
export function formatKwd(usd: number): string {
  return formatUsd(usd)
}

export function formatPricePrimary(usd: number): string {
  return formatUsd(usd)
}

export function formatPriceWithUsdHint(usd: number): string {
  return formatUsd(usd)
}

/** Flat continental US shipping (Merchant Center shipping attribute). */
export const US_SHIPPING_USD = 5.99
export const FREE_SHIPPING_THRESHOLD_USD = 100

export function shippingForSubtotal(subtotalUsd: number): number {
  return subtotalUsd >= FREE_SHIPPING_THRESHOLD_USD ? 0 : US_SHIPPING_USD
}
