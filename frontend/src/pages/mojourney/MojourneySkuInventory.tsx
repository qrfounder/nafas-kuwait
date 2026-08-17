import { useEffect, useState } from 'react'
import {
  fetchAdminSkus,
  getStoredAdminKey,
  saveAdminSku,
  type AdminSku,
} from '../../lib/mojourneyApi'

type Draft = {
  label_ar: string
  hint_ar: string
  price: number
  anchor: number
  quantity: number
  active: boolean
}

export function MojourneySkuInventory({ onError }: { onError: (msg: string) => void }) {
  const [rows, setRows] = useState<AdminSku[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => {
    const k = getStoredAdminKey()
    if (!k) return
    setLoading(true)
    fetchAdminSkus(k)
      .then((list) => {
        setRows(list)
        if (list.length && !selected) selectRow(list[0])
      })
      .catch((e) => onError(e instanceof Error ? e.message : 'Failed to load SKUs'))
      .finally(() => setLoading(false))
  }

  const selectRow = (row: AdminSku) => {
    setSelected(row.sku)
    setDraft({
      label_ar: row.label_ar,
      hint_ar: row.hint_ar,
      price: row.price,
      anchor: row.anchor,
      quantity: row.quantity,
      active: row.active,
    })
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const save = async () => {
    const k = getStoredAdminKey()
    if (!k || !selected || !draft) return
    setSaving(true)
    onError('')
    try {
      const updated = await saveAdminSku(k, selected, draft)
      setRows((prev) => prev.map((r) => (r.sku === updated.sku ? updated : r)))
      selectRow(updated)
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const current = rows.find((r) => r.sku === selected)

  if (loading) return <p className="text-sm text-slate-400">Loading SKU inventory…</p>

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-3 py-3 w-16">Image</th>
              <th className="px-3 py-3">SKU</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Qty</th>
              <th className="px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((r) => (
              <tr
                key={r.sku}
                onClick={() => selectRow(r)}
                className={`cursor-pointer transition-colors ${
                  selected === r.sku ? 'bg-slate-800/80' : 'hover:bg-slate-900/50'
                }`}
              >
                <td className="px-3 py-2">
                  <img
                    src={r.image_url}
                    alt=""
                    className="w-12 h-12 object-contain rounded-md border border-slate-700 bg-slate-950 p-0.5"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </td>
                <td className="px-3 py-2 font-mono text-xs text-amber-200/90">{r.sku}</td>
                <td className="px-3 py-2 text-slate-200 max-w-[200px] truncate">
                  {r.label_ar}
                </td>
                <td className="px-3 py-2 tabular-nums text-slate-300">{r.price} ر.س</td>
                <td className="px-3 py-2 tabular-nums">
                  <span className={r.quantity <= 10 ? 'text-amber-400' : 'text-slate-300'}>{r.quantity}</span>
                </td>
                <td className="px-3 py-2">
                  {r.active ? (
                    <span className="text-emerald-400 text-xs">Active</span>
                  ) : (
                    <span className="text-slate-500 text-xs">Off</span>
                  )}
                  {r.has_override && <span className="text-emerald-400/80 text-xs ml-1">•</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {current && draft && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 max-w-2xl">
          <div className="flex flex-wrap gap-4 items-start mb-4">
            <img
              src={current.image_url}
              alt=""
              className="w-24 h-24 object-contain rounded-lg border border-slate-700 bg-slate-950 p-1"
            />
            <div>
              <p className="text-xs text-slate-500">Warehouse SKU (read-only)</p>
              <p className="font-mono text-amber-200">{current.sku}</p>
              <p className="text-xs text-slate-500 mt-2">Image path</p>
              <p className="font-mono text-xs text-slate-400 break-all">{current.image_url}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-xs text-slate-400 block sm:col-span-2">
              Display name
              <input
                value={draft.label_ar}
                onChange={(e) => setDraft({ ...draft, label_ar: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-slate-400 block sm:col-span-2">
              Short hint
              <input
                value={draft.hint_ar}
                onChange={(e) => setDraft({ ...draft, hint_ar: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-slate-400 block">
              Price (SAR)
              <input
                type="number"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-slate-400 block">
              Anchor / compare price
              <input
                type="number"
                value={draft.anchor}
                onChange={(e) => setDraft({ ...draft, anchor: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-slate-400 block">
              Stock quantity
              <input
                type="number"
                min={0}
                value={draft.quantity}
                onChange={(e) => setDraft({ ...draft, quantity: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
              />
            </label>
            <label className="flex items-end gap-2 text-sm text-slate-300 pb-2">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              />
              Available for sale
            </label>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="mt-4 rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save SKU'}
          </button>
        </div>
      )}
    </div>
  )
}
