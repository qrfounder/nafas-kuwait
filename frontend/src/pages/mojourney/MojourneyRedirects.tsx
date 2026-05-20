import { useEffect, useState } from 'react'
import {
  createAdminRedirect,
  deleteAdminRedirect,
  fetchAdminRedirects,
  getStoredAdminKey,
  updateAdminRedirect,
  type AdminRedirect,
} from '../../lib/mojourneyApi'

const MACROS = [
  { k: '{{shop}}', d: 'Full shop URL' },
  { k: '{{product:cycle-relief}}', d: 'Product page (change slug)' },
  { k: '/product/test', d: 'Ad landing (before switch)' },
  { k: '/product/body-relief', d: 'Relative path' },
]

const emptyForm = (): Omit<AdminRedirect, 'id' | 'to_path_resolved'> => ({
  from_path: '/',
  to_path: '/collection',
  status_code: 302,
  enabled: true,
  note: '',
})

export function MojourneyRedirects({ onError }: { onError: (msg: string) => void }) {
  const [rows, setRows] = useState<AdminRedirect[]>([])
  const [form, setForm] = useState(emptyForm())
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = () => {
    const k = getStoredAdminKey()
    if (!k) return
    setLoading(true)
    fetchAdminRedirects(k)
      .then(setRows)
      .catch((e) => onError(e instanceof Error ? e.message : 'Failed to load redirects'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const save = async () => {
    const k = getStoredAdminKey()
    if (!k) return
    onError('')
    try {
      if (editId) {
        await updateAdminRedirect(k, editId, form)
      } else {
        await createAdminRedirect(k, form)
      }
      setForm(emptyForm())
      setEditId(null)
      load()
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  const remove = async (id: string) => {
    const k = getStoredAdminKey()
    if (!k || !confirm('Delete this redirect?')) return
    try {
      await deleteAdminRedirect(k, id)
      load()
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400 max-w-2xl">
        Shopify-style URL redirects. Use macros in the destination field.
      </p>
      <div className="flex flex-wrap gap-2 text-xs">
        {MACROS.map((m) => (
          <span key={m.k} className="rounded-md bg-slate-800 px-2 py-1 text-slate-300 font-mono">
            {m.k} <span className="text-slate-500 font-sans">— {m.d}</span>
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 grid gap-3 sm:grid-cols-2 max-w-3xl">
        <label className="text-xs text-slate-400 block">
          From path
          <input
            value={form.from_path}
            onChange={(e) => setForm({ ...form, from_path: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white font-mono"
            placeholder="/sale"
          />
        </label>
        <label className="text-xs text-slate-400 block">
          To path or macro
          <input
            value={form.to_path}
            onChange={(e) => setForm({ ...form, to_path: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white font-mono"
            placeholder="{{product:cycle-relief}}"
          />
        </label>
        <label className="text-xs text-slate-400 block">
          Redirect type
          <select
            value={form.status_code}
            onChange={(e) => setForm({ ...form, status_code: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
          >
            <option value={302}>302 Temporary</option>
            <option value={301}>301 Permanent</option>
          </select>
        </label>
        <label className="text-xs text-slate-400 block flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
          />
          Enabled
        </label>
        <label className="text-xs text-slate-400 block sm:col-span-2">
          Note
          <input
            value={form.note || ''}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
          />
        </label>
        <div className="sm:col-span-2 flex gap-2">
          <button
            type="button"
            onClick={() => void save()}
            className="rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            {editId ? 'Update redirect' : 'Add redirect'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null)
                setForm(emptyForm())
              }}
              className="text-sm text-slate-400 underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-900 text-slate-400 text-xs">
              <tr>
                <th className="px-3 py-3">From</th>
                <th className="px-3 py-3">To (resolved)</th>
                <th className="px-3 py-3">Code</th>
                <th className="px-3 py-3 w-28"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((r) => (
                <tr key={r.id} className={!r.enabled ? 'opacity-50' : ''}>
                  <td className="px-3 py-2 font-mono text-xs">{r.from_path}</td>
                  <td className="px-3 py-2 font-mono text-xs text-amber-200/90 break-all">{r.to_path_resolved}</td>
                  <td className="px-3 py-2">{r.status_code}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button
                      type="button"
                      className="text-amber-400 text-xs mr-2"
                      onClick={() => {
                        setEditId(r.id)
                        setForm({
                          from_path: r.from_path,
                          to_path: r.to_path,
                          status_code: r.status_code,
                          enabled: r.enabled,
                          note: r.note,
                        })
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="text-rose-400 text-xs" onClick={() => void remove(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="p-4 text-slate-500 text-sm">No redirects yet.</p>}
        </div>
      )}
    </div>
  )
}
