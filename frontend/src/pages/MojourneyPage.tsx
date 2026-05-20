import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MojourneyPixels } from './mojourney/MojourneyPixels'
import { MojourneyProductsAdmin } from './mojourney/MojourneyProductsAdmin'
import { MojourneyRedirects } from './mojourney/MojourneyRedirects'
import { PRODUCTS } from '../data/products'
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

type Section = 'overview' | 'orders' | 'products' | 'redirects' | 'links' | 'tracking'

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'orders', label: 'الطلبات' },
  { id: 'products', label: 'المنتجات' },
  { id: 'redirects', label: 'التحويلات' },
  { id: 'links', label: 'روابط UTM' },
  { id: 'tracking', label: 'البيكسل والتتبع' },
]

function copyText(text: string) {
  void navigator.clipboard.writeText(text).catch(() => {})
}

type LoginMode = 'loading' | 'password' | 'apikey' | 'none'

export function MojourneyPage() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [loginMode, setLoginMode] = useState<LoginMode>('loading')
  const [unlocked, setUnlocked] = useState(() => Boolean(getStoredAdminKey()))
  const [section, setSection] = useState<Section>('overview')
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
        if (!cancelled) setLoginMode('none')
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
      setError(e instanceof Error ? e.message : 'خطأ')
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
      setError(e instanceof Error ? e.message : 'خطأ')
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
      setError(err instanceof Error ? err.message : 'خطأ')
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

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6" dir="rtl">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
          <h1 className="font-display text-2xl font-bold text-white mb-1">Mojourney</h1>
          {loginMode === 'loading' && <p className="text-sm text-slate-400 mb-6">جاري التحميل…</p>}
          {loginMode === 'none' && (
            <p className="text-sm text-rose-200/90 mb-6">
              السيرفر غير مهيأ: عيّني <span className="font-mono text-xs">MOJOURNEY_ADMIN_PASSWORD</span> أو{' '}
              <span className="font-mono text-xs">ADMIN_API_KEY</span> في <span className="font-mono text-xs">backend/.env</span>.
            </p>
          )}
          {loginMode === 'password' && (
            <>
              <p className="text-sm text-slate-400 mb-6">لوحة داخلية — اسم مستخدم وكلمة مرور (قابلة للتغيير من السيرفر).</p>
              <form onSubmit={onUnlock} className="space-y-4">
                <label className="block text-sm text-slate-300">
                  اسم المستخدم
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500/60"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  كلمة المرور
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
                  {authLoading ? 'جاري التحقق…' : 'دخول'}
                </button>
              </form>
            </>
          )}
          {loginMode === 'apikey' && (
            <>
              <p className="text-sm text-slate-400 mb-6">لوحة داخلية — أدخلي مفتاح الإدارة المطابق لـ ADMIN_API_KEY في السيرفر.</p>
              <form onSubmit={onUnlock} className="space-y-4">
                <label className="block text-sm text-slate-300">
                  مفتاح الإدارة
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
                  {authLoading ? 'جاري التحقق…' : 'دخول'}
                </button>
              </form>
            </>
          )}
          <p className="mt-6 text-xs text-slate-500 leading-relaxed">
            الجلسة تُحفظ في المتصفح فقط (sessionStorage) حتى إغلاق التاب. لا تشاركين رابط هذه الصفحة علناً.
          </p>
          <Link to="/" className="mt-4 inline-block text-sm text-amber-400/90 hover:text-amber-300">
            ← العودة للمتجر
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row" dir="rtl">
      <aside className="border-b md:border-b-0 md:border-l border-slate-800 md:w-56 shrink-0 md:min-h-screen p-4 flex flex-col gap-1">
        <div className="mb-4 px-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Nafas</p>
          <p className="font-display text-lg font-bold text-white">Mojourney</p>
        </div>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className={`rounded-lg px-3 py-2 text-right text-sm transition-colors ${
              section === s.id ? 'bg-slate-800 text-amber-200' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            {s.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => void onLogout()}
          className="rounded-lg px-3 py-2 text-right text-sm text-slate-400 hover:bg-slate-800/60"
        >
          خروج
        </button>
        <Link to="/" className="rounded-lg px-3 py-2 text-sm text-amber-400/90 hover:bg-slate-800/60">
          المتجر
        </Link>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h2 className="font-display text-xl md:text-2xl font-bold text-white">
            {SECTIONS.find((x) => x.id === section)?.label}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {ping && (
              <span className={ping.admin_configured ? 'text-emerald-400/90' : 'text-amber-400/90'}>
                API {ping.ok ? '●' : '○'}{' '}
                {ping.password_login
                  ? 'تسجيل دخول بكلمة مرور'
                  : ping.admin_configured
                    ? 'مفتاح API فقط'
                    : 'غير مهيأ'}
              </span>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}
        {loading && <p className="text-sm text-slate-400 mb-4">جاري التحميل…</p>}

        {section === 'overview' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-xs text-slate-500 mb-1">إجمالي الطلبات</p>
                <p className="text-3xl font-bold text-white">{summary?.total ?? '—'}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-xs text-slate-500 mb-1">آخر ٢٤ ساعة</p>
                <p className="text-3xl font-bold text-amber-200">{summary?.last_24h ?? '—'}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-xs text-slate-500 mb-2">حسب الحالة</p>
                <div className="flex flex-wrap gap-2">
                  {summary?.by_status &&
                    Object.entries(summary.by_status).map(([st, n]) => (
                      <span key={st} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200">
                        {st}: {n}
                      </span>
                    ))}
                  {summary && Object.keys(summary.by_status).length === 0 && (
                    <span className="text-sm text-slate-500">لا بيانات بعد</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              الطلبات تُسجَّل مع حقول التتبع (utm_source، utm_campaign، المصدر) عند إتمام الطلب من الواجهة. راجعي تبويب
              «الطلبات والعملاء» للتفاصيل و«روابط الحملات» لبناء روابط جديدة.
            </p>
          </div>
        )}

        {section === 'orders' && (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-full text-sm text-right">
              <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-3 font-medium">التاريخ</th>
                  <th className="px-3 py-3 font-medium">الطلب</th>
                  <th className="px-3 py-3 font-medium">الاسم</th>
                  <th className="px-3 py-3 font-medium">الجوال</th>
                  <th className="px-3 py-3 font-medium">المنتج</th>
                  <th className="px-3 py-3 font-medium">$</th>
                  <th className="px-3 py-3 font-medium">utm</th>
                  <th className="px-3 py-3 font-medium">حالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders?.map((o) => (
                  <tr key={o.order_number} className="hover:bg-slate-900/40">
                    <td className="px-3 py-2.5 whitespace-nowrap text-slate-300">
                      {new Date(o.created_at).toLocaleString('ar-KW')}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-amber-200/90">{o.order_number}</td>
                    <td className="px-3 py-2.5 text-slate-200">{o.customer_name}</td>
                    <td className="px-3 py-2.5 font-mono text-xs" dir="ltr">
                      {o.customer_phone}
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">
                      {o.product_slug}
                      {o.upsell_accepted && <span className="text-emerald-400 text-xs mr-1">+upsell</span>}
                    </td>
                    <td className="px-3 py-2.5" dir="ltr">
                      {o.total_usd.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-400 max-w-[140px] truncate" title={o.utm_campaign || ''}>
                      {o.utm_source || '—'} / {o.utm_campaign || '—'}
                    </td>
                    <td className="px-3 py-2.5 text-xs">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders && orders.length === 0 && <p className="p-6 text-slate-500 text-sm">لا طلبات في القاعدة بعد.</p>}
          </div>
        )}

        {section === 'products' && <MojourneyProductsAdmin onError={setError} />}

        {section === 'redirects' && <MojourneyRedirects onError={setError} />}

        {section === 'links' && (
          <div className="space-y-8 max-w-3xl">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">منشئ روابط مع UTM</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-slate-400 block">
                  المسار
                  <select
                    value={linkPath}
                    onChange={(e) => setLinkPath(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                  >
                    <option value="/">الرئيسية /</option>
                    <option value="/collection">المجموعة</option>
                    <option value="/about">من نحن</option>
                    <option value="/contact">تواصل</option>
                    <option value="/policies">السياسات</option>
                    {PRODUCTS.map((p) => (
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
                  utm_content (اختياري)
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
              <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs break-all text-amber-100/90" dir="ltr">
                {builtCampaignUrl}
              </div>
              <button
                type="button"
                onClick={() => copyText(builtCampaignUrl)}
                className="rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
              >
                نسخ الرابط
              </button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">اختصارات</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>
                  <strong className="text-slate-200">شكراً بعد الطلب:</strong>{' '}
                  <span className="font-mono text-xs" dir="ltr">
                    {baseUrl}/thank-you?order=NF-…
                  </span>{' '}
                  (يُولَّد لكل عميلة — للدعم فقط)
                </li>
              </ul>
            </div>
          </div>
        )}

        {section === 'tracking' && <MojourneyPixels onError={setError} />}
      </main>
    </div>
  )
}
