/** USD list prices → KWD display (Kuwait COD stores show د.ك first). */
export const USD_TO_KWD = 0.31

export function usdToKwd(usd: number): number {
  return Math.round(usd * USD_TO_KWD * 10) / 10
}

/** Primary price for Kuwait shoppers, e.g. "15.2 د.ك" */
export function formatKwd(usd: number): string {
  return `${usdToKwd(usd).toFixed(1)} د.ك`
}

/** Secondary reference for ad/ops alignment */
export function formatUsd(usd: number): string {
  return `$${usd}`
}

export function formatPricePrimary(usd: number): string {
  return formatKwd(usd)
}

export function formatPriceWithUsdHint(usd: number): string {
  return `${formatKwd(usd)} (≈ ${formatUsd(usd)})`
}
