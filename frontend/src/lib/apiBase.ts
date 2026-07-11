/**
 * Resolve API base URL. Build-time VITE_API_URL wins unless it points at localhost
 * while the storefront is on production. common Easypanel misconfig that blocks all orders.
 */
export function getApiBase(): string {
  const fromEnv = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
  const host = typeof window !== 'undefined' ? window.location.hostname : ''

  const productionApi = 'https://api.naffas.shop'
  const productionHosts = new Set(['naffas.shop', 'www.naffas.shop', 'nafas.shop', 'www.nafas.shop'])

  if (productionHosts.has(host)) {
    if (!fromEnv || /localhost|127\.0\.0\.1/i.test(fromEnv)) return productionApi
    return fromEnv
  }

  return fromEnv || 'http://localhost:8000'
}

export async function pingApiHealth(timeoutMs = 8000): Promise<boolean> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), timeoutMs)
    const res = await fetch(`${getApiBase()}/health`, { signal: ctrl.signal })
    clearTimeout(t)
    return res.ok
  } catch {
    return false
  }
}
