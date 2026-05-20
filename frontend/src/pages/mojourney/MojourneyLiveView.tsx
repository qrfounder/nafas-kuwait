import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchAdminLive,
  getStoredAdminKey,
  type LiveSnapshot,
} from '../../lib/mojourneyApi'
import { LiveGlobe } from './LiveGlobe'

function Sparkline({ values, accent }: { values: number[]; accent: string }) {
  const max = Math.max(...values, 1)
  const w = 120
  const h = 28
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w
      const y = h - (v / max) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg width={w} height={h} className="opacity-80">
      <polyline fill="none" strokeWidth="2" className={accent} points={pts} />
    </svg>
  )
}

const STAGE_LABEL: Record<string, string> = {
  browsing: 'Browsing',
  cart: 'Active cart',
  checkout: 'Checking out',
  purchased: 'Purchased',
}

function stageBadge(stage: string) {
  const colors: Record<string, string> = {
    browsing: 'bg-sky-500/20 text-sky-200',
    cart: 'bg-amber-500/20 text-amber-200',
    checkout: 'bg-orange-500/20 text-orange-200',
    purchased: 'bg-violet-500/20 text-violet-200',
  }
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${colors[stage] ?? colors.browsing}`}>
      {STAGE_LABEL[stage] ?? stage}
    </span>
  )
}

export function MojourneyLiveView({ onError }: { onError: (msg: string) => void }) {
  const [snap, setSnap] = useState<LiveSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatedAgo, setUpdatedAgo] = useState(0)

  const load = useCallback(async () => {
    const k = getStoredAdminKey()
    if (!k) return
    try {
      const data = await fetchAdminLive(k)
      setSnap(data)
      setUpdatedAgo(0)
      onError('')
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Failed to load live view')
    } finally {
      setLoading(false)
    }
  }, [onError])

  useEffect(() => {
    void load()
    const poll = window.setInterval(() => void load(), 3000)
    const tick = window.setInterval(() => setUpdatedAgo((s) => s + 1), 1000)
    return () => {
      window.clearInterval(poll)
      window.clearInterval(tick)
    }
  }, [load])

  const sessionSeries = useMemo(
    () => snap?.hourly_sessions.map((p) => p.sessions) ?? [],
    [snap],
  )
  const orderSeries = useMemo(
    () => snap?.hourly_orders.map((p) => p.orders) ?? [],
    [snap],
  )

  const filteredVisitors = useMemo(() => {
    if (!snap) return []
    const q = search.trim().toLowerCase()
    if (!q) return snap.visitors
    return snap.visitors.filter((v) => {
      const blob = [v.city, v.country, v.path, v.utm_source, v.product_slug, v.ip_address, v.stage]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return blob.includes(q)
    })
  }, [snap, search])

  const funnel = snap?.funnel ?? { browsing: 0, cart: 0, checkout: 0, purchased: 0 }

  return (
    <div className="space-y-4 -mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400" />
          </span>
          <p className="text-sm text-slate-400">
            Live · refreshed {updatedAgo < 5 ? 'just now' : `${updatedAgo}s ago`}
          </p>
        </div>
        <input
          type="search"
          placeholder="Search location, path, UTM…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white w-full max-w-xs"
        />
      </div>

      {loading && !snap && <p className="text-sm text-slate-500">Loading live data…</p>}

      <div className="grid lg:grid-cols-[minmax(280px,360px)_1fr] gap-6 items-start">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-xs text-slate-500 mb-1">Visitors right now</p>
              <p className="text-4xl font-bold text-white tabular-nums">{snap?.visitors_now ?? 0}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs text-slate-500 mb-1">Total sales (today)</p>
              <p className="text-xl font-bold text-white tabular-nums">
                ${(snap?.today_sales_usd ?? 0).toFixed(2)}
              </p>
              <Sparkline values={orderSeries} accent="stroke-violet-400" />
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs text-slate-500 mb-1">Sessions (today)</p>
              <p className="text-xl font-bold text-white tabular-nums">{snap?.today_sessions ?? 0}</p>
              <Sparkline values={sessionSeries} accent="stroke-sky-400" />
            </div>
            <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs text-slate-500 mb-1">Orders (today)</p>
              <p className="text-xl font-bold text-amber-200 tabular-nums">{snap?.today_orders ?? 0}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Customer behavior</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-white tabular-nums">{funnel.cart ?? 0}</p>
                <p className="text-[10px] text-slate-500 mt-1">Active carts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tabular-nums">{funnel.checkout ?? 0}</p>
                <p className="text-[10px] text-slate-500 mt-1">Checking out</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-200 tabular-nums">{funnel.purchased ?? 0}</p>
                <p className="text-[10px] text-slate-500 mt-1">Purchased</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Sessions by location</p>
            {snap && snap.locations.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {snap.locations.map((loc, i) => (
                  <li key={i} className="flex justify-between gap-2 text-slate-300">
                    <span className="truncate">
                      {loc.city || 'Unknown'}
                      {loc.country ? `, ${loc.country}` : ''}
                    </span>
                    <span className="tabular-nums text-slate-400 shrink-0">{loc.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No active visitors with location yet.</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">New vs returning (now)</p>
            <div className="flex gap-4 text-sm">
              <span>
                <span className="text-white font-semibold tabular-nums">{snap?.new_now ?? 0}</span>{' '}
                <span className="text-slate-500">new</span>
              </span>
              <span>
                <span className="text-amber-200 font-semibold tabular-nums">{snap?.returning_now ?? 0}</span>{' '}
                <span className="text-slate-500">returning</span>
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-4 min-h-[420px] flex flex-col items-center justify-center">
          <LiveGlobe
            markers={(snap?.markers ?? []).map((m) => ({ lat: m.lat, lng: m.lng, stage: m.stage }))}
            width={480}
            height={480}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60">
          <h3 className="text-sm font-semibold text-white">Active visitors</h3>
          <p className="text-xs text-slate-500 mt-0.5">City, country, page, funnel stage, UTM — updates every few seconds</p>
        </div>
        <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="sticky top-0 bg-slate-900 text-slate-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2 font-medium">Location</th>
                <th className="px-3 py-2 font-medium">Stage</th>
                <th className="px-3 py-2 font-medium">Page</th>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">UTM</th>
                <th className="px-3 py-2 font-medium">IP</th>
                <th className="px-3 py-2 font-medium">Ago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredVisitors.map((v) => (
                <tr key={v.session_id} className="hover:bg-slate-900/50">
                  <td className="px-3 py-2 text-slate-200 whitespace-nowrap">
                    {v.city || '—'}
                    {v.country ? `, ${v.country}` : ''}
                    {v.is_returning && (
                      <span className="ml-1 text-[10px] text-amber-400/90">returning</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{stageBadge(v.stage)}</td>
                  <td className="px-3 py-2 font-mono text-xs text-slate-400 max-w-[200px] truncate" title={v.path}>
                    {v.path}
                  </td>
                  <td className="px-3 py-2 text-slate-400 text-xs">{v.product_slug || '—'}</td>
                  <td className="px-3 py-2 text-slate-400 text-xs">{v.utm_source || '—'}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-slate-500">{v.ip_address || '—'}</td>
                  <td className="px-3 py-2 text-slate-500 tabular-nums text-xs">{v.seconds_ago}s</td>
                </tr>
              ))}
            </tbody>
          </table>
          {snap && filteredVisitors.length === 0 && (
            <p className="p-6 text-sm text-slate-500 text-center">
              {search ? 'No visitors match your search.' : 'No visitors on the site right now. Open the storefront in another tab to test.'}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
        Live sessions are held in API memory (~90s idle). Restarting the API clears the map; today&apos;s totals still come from the database.
        Geo uses Cloudflare headers when deployed behind CF, otherwise IP lookup + country centroids.
      </p>
    </div>
  )
}
