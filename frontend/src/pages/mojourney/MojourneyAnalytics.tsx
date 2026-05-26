import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchAdminAnalytics,
  fetchAdminVisitors,
  getStoredAdminKey,
  type AnalyticsReport,
  type VisitorFunnelRow,
  type VisitorsReport,
} from '../../lib/mojourneyApi'

type Preset = 'today' | 'yesterday' | 'week' | 'month' | '90d' | 'custom'

const PRESETS: { id: Preset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'week', label: 'Last 7 days' },
  { id: 'month', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'custom', label: 'Custom range' },
]

const FUNNEL_STEPS: { key: keyof AnalyticsReport['funnel']; label: string; color: string }[] = [
  { key: 'page_view', label: 'Page view', color: 'bg-slate-500' },
  { key: 'view_content', label: 'Product view', color: 'bg-slate-400' },
  { key: 'add_to_cart', label: 'Add to cart', color: 'bg-amber-600' },
  { key: 'cart_view', label: 'Cart opened', color: 'bg-amber-500/80' },
  { key: 'checkout_visit', label: 'Checkout opened', color: 'bg-amber-500' },
  { key: 'checkout_form_start', label: 'Lead (name/phone started)', color: 'bg-amber-400' },
  { key: 'upsell_view', label: 'Post-checkout upsell shown', color: 'bg-violet-500' },
  { key: 'purchase', label: 'Purchase (thank-you page)', color: 'bg-emerald-500' },
]

function FunnelBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400 tabular-nums">
          {count} <span className="text-slate-500">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function StepCell({ done, label }: { done: boolean; label?: string }) {
  return (
    <td className="px-2 py-2 text-center" title={label}>
      {done ? (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
          ✓
        </span>
      ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-600 text-xs">
          —
        </span>
      )}
    </td>
  )
}

function upsellLabel(status: VisitorFunnelRow['upsell_status']) {
  if (status === 'accepted') return 'Yes'
  if (status === 'declined') return 'No'
  if (status === 'shown') return 'Shown'
  return '—'
}

export function MojourneyAnalytics({ onError }: { onError: (msg: string) => void }) {
  const [preset, setPreset] = useState<Preset>('week')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [report, setReport] = useState<AnalyticsReport | null>(null)
  const [visitors, setVisitors] = useState<VisitorsReport | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    const k = getStoredAdminKey()
    if (!k) return
    setLoading(true)
    onError('')
    try {
      const opts = {
        preset,
        from: preset === 'custom' ? from : undefined,
        to: preset === 'custom' ? to : undefined,
      }
      const [data, visitorData] = await Promise.all([
        fetchAdminAnalytics(k, opts),
        fetchAdminVisitors(k, { ...opts, limit: 1000 }),
      ])
      setReport(data)
      setVisitors(visitorData)
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Failed to load analytics')
      setReport(null)
      setVisitors(null)
    } finally {
      setLoading(false)
    }
  }, [preset, from, to, onError])

  useEffect(() => {
    if (preset === 'custom' && (!from || !to)) return
    void load()
  }, [load, preset, from, to])

  const funnelMax = report ? Math.max(report.funnel.page_view, 1) : 1

  const filteredVisitors = useMemo(() => {
    const rows = visitors?.visitors ?? []
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((v) => {
      const blob = [v.visitor_id, v.country, v.city, v.last_path, v.utm_source].filter(Boolean).join(' ').toLowerCase()
      return blob.includes(q)
    })
  }, [visitors, search])

  return (
    <div className="space-y-8 max-w-[1400px]">
      <p className="text-sm text-slate-400 leading-relaxed">
        First-party analytics: each visitor with city/country and full journey — page view → cart → checkout → lead →
        upsell → thank-you purchase. Data is stored on your API (not ad pixels).
      </p>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                preset === p.id ? 'bg-amber-500/90 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {preset === 'custom' && (
          <>
            <label className="text-xs text-slate-400">
              From
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 block rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <label className="text-xs text-slate-400">
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 block rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-white"
              />
            </label>
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-lg bg-amber-500/90 px-3 py-2 text-xs font-semibold text-slate-950"
            >
              Apply
            </button>
          </>
        )}
        {report && (
          <p className="text-xs text-slate-500 ml-auto">
            {new Date(report.range_from).toLocaleDateString()} — {new Date(report.range_to).toLocaleDateString()}
          </p>
        )}
      </div>

      {loading && <p className="text-sm text-slate-400">Loading analytics…</p>}

      {report && !loading && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Unique visitors" value={report.unique_visitors} />
            <StatCard label="Sessions" value={report.unique_sessions} />
            <StatCard label="Total events" value={report.total_events} />
            <StatCard
              label="Purchase rate"
              value={
                report.unique_visitors > 0
                  ? `${((report.funnel.purchase / report.unique_visitors) * 100).toFixed(1)}%`
                  : '—'
              }
              sub={`${report.funnel.purchase} purchases`}
            />
          </div>

          <section className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">All visitors — journey table</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {visitors?.total ?? 0} visitors in range
                  {filteredVisitors.length !== (visitors?.visitors.length ?? 0)
                    ? ` · showing ${filteredVisitors.length} filtered`
                    : ''}
                </p>
              </div>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city, country, path, UTM…"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white w-full sm:w-64"
              />
            </div>
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">Last seen</th>
                    <th className="px-3 py-2 font-medium">City</th>
                    <th className="px-3 py-2 font-medium">Country</th>
                    <th className="px-3 py-2 font-medium">Page</th>
                    <th className="px-2 py-2 font-medium text-center">View</th>
                    <th className="px-2 py-2 font-medium text-center">Product</th>
                    <th className="px-2 py-2 font-medium text-center">ATC</th>
                    <th className="px-2 py-2 font-medium text-center">Cart</th>
                    <th className="px-2 py-2 font-medium text-center">Checkout</th>
                    <th className="px-2 py-2 font-medium text-center">Lead</th>
                    <th className="px-2 py-2 font-medium text-center">Upsell</th>
                    <th className="px-2 py-2 font-medium text-center">Purchase</th>
                    <th className="px-3 py-2 font-medium">UTM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredVisitors.map((v) => (
                    <tr key={v.visitor_id} className="hover:bg-slate-900/40">
                      <td className="px-3 py-2 whitespace-nowrap text-slate-400">
                        {new Date(v.last_seen).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-slate-200">{v.city || '—'}</td>
                      <td className="px-3 py-2 text-slate-300">{v.country || '—'}</td>
                      <td
                        className="px-3 py-2 font-mono text-slate-400 max-w-[120px] truncate"
                        title={v.last_path || ''}
                      >
                        {v.last_path || '—'}
                      </td>
                      <StepCell done={v.page_view} label="Page view" />
                      <StepCell done={v.view_content} label="Product view" />
                      <StepCell done={v.add_to_cart} label="Add to cart" />
                      <StepCell done={v.cart_view} label="Cart opened" />
                      <StepCell done={v.checkout_visit} label="Checkout" />
                      <StepCell done={v.checkout_form_start} label="Lead form" />
                      <td className="px-2 py-2 text-center text-slate-300">{upsellLabel(v.upsell_status)}</td>
                      <StepCell done={v.purchase} label="Thank-you purchase" />
                      <td className="px-3 py-2 text-slate-500">{v.utm_source || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredVisitors.length === 0 && (
                <p className="p-6 text-slate-500 text-sm">
                  No visitors in this period yet. Open the storefront in another tab to test tracking.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Conversion funnel</h3>
            <p className="text-xs text-slate-500">Unique visitors per step (% of page views).</p>
            <div className="space-y-3 max-w-xl">
              {FUNNEL_STEPS.map((s) => (
                <FunnelBar
                  key={s.key}
                  label={s.label}
                  count={report.funnel[s.key] ?? 0}
                  max={funnelMax}
                  color={s.color}
                />
              ))}
            </div>
            {(report.funnel.upsell_accept > 0 || report.funnel.upsell_decline > 0) && (
              <p className="text-xs text-slate-500">
                Upsell: {report.funnel.upsell_accept} accepted · {report.funnel.upsell_decline} declined ·{' '}
                {report.funnel.upsell_view} shown
              </p>
            )}
          </section>

          {report.daily.length > 0 && (
            <section className="rounded-xl border border-slate-800 overflow-hidden">
              <h3 className="text-sm font-semibold text-white px-4 py-3 border-b border-slate-800 bg-slate-900/60">
                Daily breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-slate-900 text-slate-400 text-xs">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Visitors</th>
                      <th className="px-3 py-2">Page views</th>
                      <th className="px-3 py-2">Add to cart</th>
                      <th className="px-3 py-2">Checkout</th>
                      <th className="px-3 py-2">Form start</th>
                      <th className="px-3 py-2">Purchases</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {report.daily.map((d) => (
                      <tr key={d.date} className="hover:bg-slate-900/40">
                        <td className="px-3 py-2 font-mono text-xs">{d.date}</td>
                        <td className="px-3 py-2">{d.visitors}</td>
                        <td className="px-3 py-2">{d.page_views}</td>
                        <td className="px-3 py-2">{d.add_to_cart}</td>
                        <td className="px-3 py-2">{d.checkout_visit}</td>
                        <td className="px-3 py-2">{d.checkout_form_start}</td>
                        <td className="px-3 py-2 text-emerald-400">{d.purchases}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <GeoTable title="By country" rows={report.by_country} showCity={false} />
            <GeoTable title="By city" rows={report.by_city} showCity />
          </div>

          <section className="rounded-xl border border-slate-800 overflow-hidden">
            <h3 className="text-sm font-semibold text-white px-4 py-3 border-b border-slate-800 bg-slate-900/60">
              Recent activity (last 100 events)
            </h3>
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Time</th>
                    <th className="px-3 py-2">Event</th>
                    <th className="px-3 py-2">Path</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">IP</th>
                    <th className="px-3 py-2">Visitor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {report.recent_events.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-900/40">
                      <td className="px-3 py-2 whitespace-nowrap text-slate-400">
                        {new Date(e.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded bg-slate-800 px-1.5 py-0.5 text-amber-200/90">{e.event_type}</span>
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-300 max-w-[140px] truncate" title={e.path || ''}>
                        {e.path || '—'}
                        {e.product_slug && <span className="block text-slate-500">{e.product_slug}</span>}
                      </td>
                      <td className="px-3 py-2 text-slate-300">
                        {[e.city, e.country].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-400">{e.ip_address || '—'}</td>
                      <td className="px-3 py-2 font-mono text-slate-500 truncate max-w-[80px]" title={e.visitor_id}>
                        {e.visitor_id.slice(0, 8)}…
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {report.recent_events.length === 0 && (
                <p className="p-6 text-slate-500 text-sm">No events in this period yet.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}

function GeoTable({
  title,
  rows,
  showCity,
}: {
  title: string
  rows: AnalyticsReport['by_country']
  showCity: boolean
}) {
  return (
    <section className="rounded-xl border border-slate-800 overflow-hidden">
      <h3 className="text-sm font-semibold text-white px-4 py-3 border-b border-slate-800 bg-slate-900/60">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-900 text-slate-400 text-xs">
            <tr>
              <th className="px-3 py-2">{showCity ? 'City' : 'Country'}</th>
              {showCity && <th className="px-3 py-2">Country</th>}
              <th className="px-3 py-2">Visitors</th>
              <th className="px-3 py-2">Events</th>
              <th className="px-3 py-2">Purchases</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-slate-900/40">
                <td className="px-3 py-2 text-slate-200">{showCity ? r.city : r.country || 'Unknown'}</td>
                {showCity && <td className="px-3 py-2 text-slate-400">{r.country || '—'}</td>}
                <td className="px-3 py-2">{r.visitors}</td>
                <td className="px-3 py-2">{r.events}</td>
                <td className="px-3 py-2 text-emerald-400">{r.purchases}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-4 text-slate-500 text-sm">No geo data yet.</p>}
      </div>
    </section>
  )
}
