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
      .catch((e) => onError(e instanceof Error ? e.message : 'خطأ'))
  }, [onError])

  if (!form) return <p className="text-sm text-slate-400">جاري التحميل…</p>

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
      onError(e instanceof Error ? e.message : 'فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-slate-400 leading-relaxed">
        البيكسلات تُحمَّل تلقائياً على المتجر من قاعدة البيانات (بدون إعادة بناء). بعد الحفظ، حدّثي صفحة المتجر
        لتفعيل التتبع: PageView، ViewContent، AddToCart، InitiateCheckout، Purchase.
      </p>
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <label className="block text-xs text-slate-400">
          رابط المتجر (للماكروهات)
          <input
            value={form.shop_url}
            onChange={(e) => setForm({ ...form, shop_url: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            dir="ltr"
          />
        </label>
        <label className="block text-xs text-slate-400">
          Meta Pixel ID
          <input
            value={form.meta_pixel_id}
            onChange={(e) => setForm({ ...form, meta_pixel_id: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono"
            dir="ltr"
            placeholder="1234567890"
          />
        </label>
        <label className="block text-xs text-slate-400">
          TikTok Pixel ID
          <input
            value={form.tiktok_pixel_id}
            onChange={(e) => setForm({ ...form, tiktok_pixel_id: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono"
            dir="ltr"
          />
        </label>
        <label className="block text-xs text-slate-400">
          Snapchat Pixel ID
          <input
            value={form.snap_pixel_id}
            onChange={(e) => setForm({ ...form, snap_pixel_id: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono"
            dir="ltr"
          />
        </label>
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-60"
        >
          {saving ? 'جاري الحفظ…' : 'حفظ البيكسلات'}
        </button>
        {saved && <p className="text-sm text-emerald-400">تم الحفظ. حدّثي المتجر لتحميل البيكسل الجديد.</p>}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-xs text-slate-400">
        <p className="font-semibold text-slate-200 mb-2">أحداث تُرسل تلقائياً</p>
        <ul className="list-disc list-inside space-y-1">
          <li>PageView عند فتح الموقع</li>
          <li>ViewContent في صفحة المنتج</li>
          <li>AddToCart عند الإضافة للسلة</li>
          <li>InitiateCheckout عند فتح الطلب</li>
          <li>Purchase بعد تأكيد الطلب</li>
        </ul>
        <p className="mt-3">CAPI (السيرفر) ما زال من متغيرات API على Easypanel إن احتجتِه.</p>
      </div>
    </div>
  )
}
