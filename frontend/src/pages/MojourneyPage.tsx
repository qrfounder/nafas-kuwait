import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminShell, type AdminSection } from './mojourney/AdminShell'
import { MojourneyAnalytics } from './mojourney/MojourneyAnalytics'
import { MojourneyLiveView } from './mojourney/MojourneyLiveView'
import { MojourneyPixels } from './mojourney/MojourneyPixels'
import { MojourneyProductsHub } from './mojourney/MojourneyProductsHub'
import { MojourneyRedirects } from './mojourney/MojourneyRedirects'
import { AD_LANDING_SLUG } from '../data/adLanding'
import { getCatalogProducts } from '../data/products'

const CATALOG_FOR_LINKS = getCatalogProducts()
import {
  adminPing,
  clearStoredAdminKey,
  fetchAdminOrders,
  fetchAdminSummary,
  getStoredAdminKey,
  MojourneyAuthError,
  mojourneyLogin,
  mojourneyLogout,
  setStoredAdminKey,
  type AdminOrderRow,
  type AdminOrdersSummary,
} from '../lib/mojourneyApi'

function copyText(text: string) {
  void navigator.clipboard.writeText(text).catch(() => {})
}

type LoginMode = 'loading' | 'password' | 'apikey' | 'none' | 'unreachable'

export function MojourneyPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [loginMode, setLoginMode] = useState<LoginMode>('loading')
  const [unlocked, setUnlocked] = useState(() => Boolean(getStoredAdminKey()))

  useEffect(() => {
    const html = document.documentElement
    const prevLang = html.lang
    const prevDir = html.dir
    const prevTitle = document.title
    html.lang = 'en'
    html.dir = 'ltr'
    document.title = 'Mojourney Admin'
    return () => {
      html.lang = prevLang
      html.dir = prevDir
      document.title = prevTitle
    }
  }, [])
  const sectionFromHash = (): AdminSection => {
    const id = (typeof window !== 'undefined' ? window.location.hash : '').replace(/^#/, '')
    const allowed: AdminSection[] = [
      'overview',
      'live',
      'analytics',
      'orders',
      'products',
      'redirects',
      'links',
      'pixels',
    ]
    return allowed.includes(id as AdminSection) ? (id as AdminSection) : 'overview'
  }

  const [section, setSection] = useState<AdminSection>(() =>
    typeof window !== 'undefined' ? sectionFromHash() : 'overview',
  )

  const goSection = useCallback((s: AdminSection) => {
    setSection(s)
    if (typeof window !== 'undefined') {
      const next = s === 'overview' ? '' : `#${s}`
      if (window.location.hash !== next) window.location.hash = next
    }
  }, [])

  useEffect(() => {
    const onHash = () => setSection(sectionFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const [ping, setPing] = useState<{
    ok: boolean
    admin_configured: boolean
    password_login?: boolean
  } | null>(null)
  const [summary, setSummary] = useState<AdminOrdersSummary | null>(null)
  const [orders, setOrders] = useState<AdminOrderRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const baseUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return window.location.origin
  }, [])

  const refreshPing = useCallback(async () => {
    try {
      setPing(await adminPing())
    } catch {
      setPing(null)
    }
  }, [])

  useEffect(() => {
    void refreshPing()
  }, [refreshPing])

  useEffect(() => {
    if (unlocked) return
    let cancelled = false
    adminPing()
      .then((p) => {
        if (cancelled) return
        if (p.password_login) setLoginMode('password')
        else if (p.admin_configured) setLoginMode('apikey')
        else setLoginMode('none')
      })
      .catch(() => {
        if (!cancelled) setLoginMode('unreachable')
      })
    return () => {
      cancelled = true
    }
  }, [unlocked])

  const loadSummary = useCallback(async () => {
    const k = getStoredAdminKey()
    if (!k) return
    setLoading(true)
    setError(null)
    try {
      setSummary(await fetchAdminSummary(k))
    } catch (e) {
      if (e instanceof MojourneyAuthError) {
        clearStoredAdminKey()
        setUnlocked(false)
        setPassword('')
        setApiKey('')
      }
      setError(e instanceof Error ? e.message : 'Request failed')
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadOrders = useCallback(async () => {
    const k = getStoredAdminKey()
    if (!k) return
    setLoading(true)
    setError(null)
    try {
      setOrders(await fetchAdminOrders(k))
    } catch (e) {
      if (e instanceof MojourneyAuthError) {
        clearStoredAdminKey()
        setUnlocked(false)
        setPassword('')
        setApiKey('')
      }
      setError(e instanceof Error ? e.message : 'Request failed')
      setOrders(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!unlocked) return
    if (section === 'overview') void loadSummary()
    if (section === 'orders') void loadOrders()
  }, [unlocked, section, loadSummary, loadOrders])

  const onUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loginMode === 'password' && !password) return
    if (loginMode === 'apikey' && !apiKey.trim()) return
    setAuthLoading(true)
    setError(null)
    try {
      if (loginMode === 'password') {
        const token = await mojourneyLogin(username, password)
        setStoredAdminKey(token)
        setUnlocked(true)
      } else if (loginMode === 'apikey') {
        const trimmed = apiKey.trim()
        await fetchAdminSummary(trimmed)
        setStoredAdminKey(trimmed)
        setUnlocked(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const onLogout = async () => {
    const t = getStoredAdminKey()
    await mojourneyLogout(t)
    clearStoredAdminKey()
    setPassword('')
    setApiKey('')
    setUnlocked(false)
    setSummary(null)
    setOrders(null)
    void refreshPing()
    setLoginMode('loading')
    adminPing()
      .then((p) => {
        if (p.password_login) setLoginMode('password')
        else if (p.admin_configured) setLoginMode('apikey')
        else setLoginMode('none')
      })
      .catch(() => setLoginMode('none'))
  }

  const [linkPath, setLinkPath] = useState('/')
  const [utmSource, setUtmSource] = useState('instagram')
  const [utmMedium, setUtmMedium] = useState('social')
  const [utmCampaign, setUtmCampaign] = useState('nafas_spring')
  const [utmContent, setUtmContent] = useState('')

  const builtCampaignUrl = useMemo(() => {
    const path = linkPath.startsWith('/') ? linkPath : `/${linkPath}`
    const u = new URL(`${baseUrl}${path}`)
    u.searchParams.set('utm_source', utmSource)
    u.searchParams.set('utm_medium', utmMedium)
    u.searchParams.set('utm_campaign', utmCampaign)
    if (utmContent.trim()) u.searchParams.set('utm_content', utmContent.trim())
    return u.toString()
  }, [baseUrl, linkPath, utmSource, utmMedium, utmCampaign, utmContent])

  const apiStatus = ping && (
    <span className={ping.admin_configured ? 'text-emerald-400/90' : 'text-amber-400/90'}>
      API {ping.ok ? '●' : '○'}{' '}
      {ping.password_login ? 'Password login' : ping.admin_configured ? 'API key' : 'Not configured'}
    </span>
  )

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6" dir="ltr">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
          <h1 className="font-display text-2xl font-bold text-white mb-1">Mojourney Admin</h1>
          {loginMode === 'loading' && <p className="text-sm text-slate-400 mb-6">Loading…</p>}
          {loginMode === 'unreachable' && (
            <p className="text-sm text-rose-200/90 mb-6">
              The API is not reachable at <span className="font-mono text-xs">https://api.naffas.shop</span> (502).
              Open the <strong>api</strong> service in EasyPanel, check logs, set the domain to port <strong>8000</strong>,
              then redeploy. The login form appears only after that service is healthy.
            </p>
          )}
          {loginMode === 'none' && (
            <p className="text-sm text-rose-200/90 mb-6">
              {ping && !ping.ok ? (
                <>
                  Cannot reach the API. Check that <span className="font-mono text-xs">VITE_API_URL</span> points to{' '}
                  <span className="font-mono text-xs">https://api.naffas.shop</span> and redeploy the web service.
                </>
              ) : (
                <>
                  Server not configured: set{' '}
                  <span className="font-mono text-xs">MOJOURNEY_ADMIN_PASSWORD</span> or{' '}
                  <span className="font-mono text-xs">ADMIN_API_KEY</span> on the API service.
                </>
              )}
            </p>
          )}
          {loginMode === 'password' && (
            <>
              <p className="text-sm text-slate-400 mb-6">Sign in with your admin username and password.</p>
              <form onSubmit={onUnlock} className="space-y-4">
                <label className="block text-sm text-slate-300">
                  Username
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/60"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Password
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/60"
                  />
                </label>
                {error && <p className="text-sm text-rose-300">{error}</p>}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-lg bg-amber-500/90 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-60"
                >
                  {authLoading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            </>
          )}
          {loginMode === 'apikey' && (
            <>
              <p className="text-sm text-slate-400 mb-6">Enter the admin API key (ADMIN_API_KEY on the server).</p>
              <form onSubmit={onUnlock} className="space-y-4">
                <label className="block text-sm text-slate-300">
                  Admin API key
                  <input
                    type="password"
                    autoComplete="off"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/60"
                    placeholder="••••••••"
                  />
                </label>
                {error && <p className="text-sm text-rose-300">{error}</p>}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-lg bg-amber-500/90 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-60"
                >
                  {authLoading ? 'Verifying…' : 'Sign in'}
                </button>
              </form>
            </>
          )}
          <p className="mt-6 text-xs text-slate-500 leading-relaxed">
            Session is stored in this browser only (sessionStorage) until you close the tab. Do not share this URL
            publicly.
          </p>
          <Link to="/" className="mt-4 inline-block text-sm text-amber-400/90 hover:text-amber-300">
            ← Back to store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <AdminShell
      section={section}
      onSection={goSection}
      onLogout={() => void onLogout()}
      apiStatus={<div className="text-xs text-slate-400">{apiStatus}</div>}
    >
      {error && (
        <div className="mb-6 rounded-lg border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}
      {loading && section !== 'analytics' && section !== 'live' && (
        <p className="text-sm text-slate-400 mb-4">Loading…</p>
      )}

      {section === 'overview' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-xs text-slate-500 mb-1">Total orders</p>
              <p className="text-3xl font-bold text-white">{summary?.total ?? '. '}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-xs text-slate-500 mb-1">Last 24 hours</p>
              <p className="text-3xl font-bold text-amber-200">{summary?.last_24h ?? '. '}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-xs text-slate-500 mb-2">By status</p>
              <div className="flex flex-wrap gap-2">
                {summary?.by_status &&
                  Object.entries(summary.by_status).map(([st, n]) => (
                    <span key={st} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200">
                      {st}: {n}
                    </span>
                  ))}
                {summary && Object.keys(summary.by_status).length === 0 && (
                  <span className="text-sm text-slate-500">No orders yet</span>
                )}
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(
              [
                ['live', 'Live View'],
                ['analytics', 'Analytics'],
                ['orders', 'Orders'],
                ['products', 'Products & SKUs'],
                ['links', 'Campaign links'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => goSection(id)}
                className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3 text-left text-sm text-slate-300 hover:border-amber-500/40 hover:text-amber-200 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Ad landing URL:{' '}
            <span className="font-mono text-amber-200/90">{baseUrl}/product/{AD_LANDING_SLUG}</span>. after
            approval, redirect it in <strong className="text-slate-200">Redirects</strong>.
          </p>
        </div>
      )}

      {section === 'live' && <MojourneyLiveView onError={setError} />}

      {section === 'analytics' && <MojourneyAnalytics onError={setError} />}

      {section === 'orders' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Order</th>
                <th className="px-3 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Phone</th>
                <th className="px-3 py-3 font-medium">City</th>
                <th className="px-3 py-3 font-medium">Pack</th>
                <th className="px-3 py-3 font-medium">SAR</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders?.map((o) => (
                <tr key={o.order_number} className="hover:bg-slate-900/40">
                  <td className="px-3 py-2.5 whitespace-nowrap text-slate-300">
                    {new Date(o.created_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs text-amber-200/90">{o.order_number}</td>
                  <td className="px-3 py-2.5 text-slate-200">{o.customer_name}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{o.customer_phone}</td>
                  <td className="px-3 py-2.5 text-slate-300">{o.area || '—'}</td>
                  <td className="px-3 py-2.5 text-slate-300">
                    {o.offer_tier === 3 ? '5' : o.offer_tier === 2 ? '3' : '1'}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">{o.total_usd.toFixed(0)}</td>
                  <td className="px-3 py-2.5 text-xs">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders && orders.length === 0 && <p className="p-6 text-slate-500 text-sm">No orders in database yet.</p>}
        </div>
      )}

        {section === 'products' && <MojourneyProductsHub onError={setError} />}
      {section === 'redirects' && <MojourneyRedirects onError={setError} />}

      {section === 'links' && (
        <div className="space-y-8 max-w-3xl">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">UTM campaign link builder</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-slate-400 block">
                Path
                <select
                  value={linkPath}
                  onChange={(e) => setLinkPath(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                >
                  <option value="/">Home /</option>
                  <option value="/collection">Collection</option>
                  <option value="/about">About</option>
                  <option value="/contact">Contact</option>
                  <option value="/policies">Policies</option>
                  <option value={`/product/${AD_LANDING_SLUG}`}>Ad landing (/product/test)</option>
                  {CATALOG_FOR_LINKS.map((p) => (
                    <option key={p.slug} value={`/product/${p.slug}`}>
                      {p.title_ar}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-slate-400 block">
                utm_source
                <input
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                />
              </label>
              <label className="text-xs text-slate-400 block">
                utm_medium
                <input
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                />
              </label>
              <label className="text-xs text-slate-400 block">
                utm_campaign
                <input
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                />
              </label>
              <label className="text-xs text-slate-400 block sm:col-span-2">
                utm_content (optional)
                <input
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {['instagram', 'tiktok', 'snap', 'meta', 'whatsapp', 'twitter'].map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setUtmSource(src)}
                  className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                >
                  source: {src}
                </button>
              ))}
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs break-all text-amber-100/90">
              {builtCampaignUrl}
            </div>
            <button
              type="button"
              onClick={() => copyText(builtCampaignUrl)}
              className="rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
            >
              Copy link
            </button>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Notes</h3>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>
                <strong className="text-slate-200">Thank-you URL</strong> (per order):{' '}
                <span className="font-mono text-xs">{baseUrl}/thank-you?order=NF-…</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {section === 'pixels' && <MojourneyPixels onError={setError} />}
    </AdminShell>
  )
}
