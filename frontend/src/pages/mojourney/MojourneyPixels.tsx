import { useEffect, useState } from 'react'
import {
  fetchAdminPixels,
  getStoredAdminKey,
  saveAdminPixels,
  type AdminPixels,
} from '../../lib/mojourneyApi'

export function MojourneyPixels({ onError }: { onError: (msg: string) => void }) {
  const [form, setForm] = useState<AdminPixels | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const k = getStoredAdminKey()
    if (!k) return
    fetchAdminPixels(k)
      .then(setForm)
      .catch((e) => onError(e instanceof Error ? e.message : 'Failed to load pixels'))
  }, [onError])

  if (!form) return <p className="text-sm text-slate-400">Loading…</p>

  const save = async () => {
    const k = getStoredAdminKey()
    if (!k) return
    setSaving(true)
    setSaved(false)
    onError('')
    try {
      const next = await saveAdminPixels(k, form)
      setForm(next)
      setSaved(true)
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-slate-400 leading-relaxed">
        Ad pixels load on the storefront from the database (no rebuild required). After saving, refresh the shop to
        activate tracking: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
      </p>
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <label className="block text-xs text-slate-400">
          Shop URL (for redirect macros)
          <input
            value={form.shop_url}
            onChange={(e) => setForm({ ...form, shop_url: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono"
          />
        </label>
        <label className="block text-xs text-slate-400">
          Meta Pixel ID
          <input
            value={form.meta_pixel_id}
            onChange={(e) => setForm({ ...form, meta_pixel_id: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono"
            placeholder="1234567890"
          />
        </label>
        <label className="block text-xs text-slate-400">
          TikTok Pixel ID
          <input
            value={form.tiktok_pixel_id}
            onChange={(e) => setForm({ ...form, tiktok_pixel_id: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono"
          />
        </label>
        <label className="block text-xs text-slate-400">
          Snapchat Pixel ID
          <input
            value={form.snap_pixel_id}
            onChange={(e) => setForm({ ...form, snap_pixel_id: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono"
          />
        </label>
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save pixels'}
        </button>
        {saved && <p className="text-sm text-emerald-400">Saved. Refresh the storefront to load new pixels.</p>}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-xs text-slate-400">
        <p className="font-semibold text-slate-200 mb-2">Events sent automatically</p>
        <ul className="list-disc list-inside space-y-1">
          <li>PageView on site load</li>
          <li>ViewContent on product pages</li>
          <li>AddToCart when adding to cart</li>
          <li>InitiateCheckout when opening checkout</li>
          <li>Purchase on thank-you page</li>
        </ul>
        <p className="mt-3">
          Server-side CAPI (Meta/TikTok/Snap) can still be configured via API env vars on Easypanel if needed.
        </p>
      </div>
    </div>
  )
}
