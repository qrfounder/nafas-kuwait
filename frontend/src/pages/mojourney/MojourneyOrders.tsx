import { useState } from 'react'
import {
  downloadAdminOrdersCsv,
  getStoredAdminKey,
  type AdminOrderRow,
} from '../../lib/mojourneyApi'

const EXPORT_OPTIONS = [
  { value: '25', label: 'Last 25' },
  { value: '50', label: 'Last 50' },
  { value: '100', label: 'Last 100' },
  { value: '250', label: 'Last 250' },
  { value: '500', label: 'Last 500' },
  { value: 'all', label: 'All orders' },
] as const

function packLabel(tier: number): string {
  if (tier === 3) return '5'
  if (tier === 2) return '3'
  return '1'
}

export function MojourneyOrders({
  orders,
  onError,
}: {
  orders: AdminOrderRow[] | null
  onError: (msg: string) => void
}) {
  const [limit, setLimit] = useState('100')
  const [busy, setBusy] = useState(false)

  const download = async () => {
    const k = getStoredAdminKey()
    if (!k) return
    setBusy(true)
    onError('')
    try {
      await downloadAdminOrdersCsv(k, limit)
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Download failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs text-slate-400">
          Download
          <select
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="mt-1 block rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          >
            {EXPORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void download()}
          className="rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
        >
          {busy ? 'Preparing…' : 'Download spreadsheet'}
        </button>
        <p className="text-xs text-slate-500 pb-2">CSV, opens in Excel and Google Sheets. Arabic names stay readable.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Order</th>
              <th className="px-3 py-3 font-medium">Name</th>
              <th className="px-3 py-3 font-medium">Phone</th>
              <th className="px-3 py-3 font-medium">City</th>
              <th className="px-3 py-3 font-medium">SKU</th>
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
                <td className="px-3 py-2.5 font-mono text-xs text-amber-200/80">{o.product_slug}</td>
                <td className="px-3 py-2.5 text-slate-300">{packLabel(o.offer_tier)}</td>
                <td className="px-3 py-2.5 tabular-nums">{o.total_usd.toFixed(0)}</td>
                <td className="px-3 py-2.5 text-xs">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders && orders.length === 0 && <p className="p-6 text-slate-500 text-sm">No orders in database yet.</p>}
      </div>
    </div>
  )
}
