import { useEffect, useState } from 'react'
import {
  fetchAdminProducts,
  getStoredAdminKey,
  saveAdminProduct,
  type AdminProduct,
} from '../../lib/mojourneyApi'

function copyText(text: string) {
  void navigator.clipboard.writeText(text).catch(() => {})
}

export function MojourneyProductsAdmin({ onError }: { onError: (msg: string) => void }) {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    title_ar: '',
    subtitle_ar: '',
    base_price: 0,
    anchor_single: 0,
    active: true,
    tier1_price: 0,
    tier1_anchor: 0,
  })
  const [saving, setSaving] = useState(false)

  const load = () => {
    const k = getStoredAdminKey()
    if (!k) return
    fetchAdminProducts(k)
      .then((list) => {
        setProducts(list)
        if (list.length && !selected) pick(list[0])
      })
      .catch((e) => onError(e instanceof Error ? e.message : 'خطأ'))
  }

  const pick = (p: AdminProduct) => {
    setSelected(p.slug)
    const t1 = p.tiers[0]
    setDraft({
      title_ar: p.title_ar,
      subtitle_ar: p.subtitle_ar,
      base_price: p.base_price,
      anchor_single: p.anchor_single,
      active: p.active,
      tier1_price: t1?.price ?? p.base_price,
      tier1_anchor: t1?.anchor ?? p.anchor_single,
    })
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const save = async () => {
    const k = getStoredAdminKey()
    if (!k || !selected) return
    const p = products.find((x) => x.slug === selected)
    if (!p) return
    const tiers = [...p.tiers]
    if (tiers[0]) {
      tiers[0] = { ...tiers[0], price: draft.tier1_price, anchor: draft.tier1_anchor }
    }
    setSaving(true)
    onError('')
    try {
      await saveAdminProduct(k, selected, {
        title_ar: draft.title_ar,
        subtitle_ar: draft.subtitle_ar,
        base_price: draft.base_price,
        anchor_single: draft.anchor_single,
        active: draft.active,
        tiers_json: JSON.stringify(tiers),
      })
      load()
    } catch (e) {
      onError(e instanceof Error ? e.message : 'فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const current = products.find((p) => p.slug === selected)

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        تعديل العناوين والأسعار يظهر على المتجر فوراً (يُدمج مع الكتالوج الأساسي). الروابط ثابتة حسب slug.
      </p>
      <div className="flex flex-col lg:flex-row gap-6">
        <ul className="lg:w-56 shrink-0 space-y-1">
          {products.map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => pick(p)}
                className={`w-full text-right rounded-lg px-3 py-2 text-sm ${
                  selected === p.slug ? 'bg-slate-800 text-amber-200' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                {p.title_ar}
                {p.has_override && <span className="text-xs text-emerald-400 mr-1"> •</span>}
              </button>
            </li>
          ))}
        </ul>

        {current && (
          <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 max-w-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-white">{current.title_ar}</h3>
              <a
                href={current.product_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-400 hover:underline"
                dir="ltr"
              >
                فتح الصفحة
              </a>
            </div>
            <p className="text-xs text-slate-500 font-mono" dir="ltr">
              /product/{current.slug}
            </p>
            <button
              type="button"
              onClick={() => copyText(current.product_url)}
              className="text-xs text-amber-400 hover:underline"
            >
              نسخ رابط المنتج
            </button>

            <label className="block text-xs text-slate-400">
              العنوان
              <input
                value={draft.title_ar}
                onChange={(e) => setDraft({ ...draft, title_ar: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-slate-400">
              الوصف القصير
              <input
                value={draft.subtitle_ar}
                onChange={(e) => setDraft({ ...draft, subtitle_ar: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-slate-400 block">
                سعر أساسي (وحدة داخلية)
                <input
                  type="number"
                  value={draft.base_price}
                  onChange={(e) => setDraft({ ...draft, base_price: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                />
              </label>
              <label className="text-xs text-slate-400 block">
                مرجع فردي
                <input
                  type="number"
                  value={draft.anchor_single}
                  onChange={(e) => setDraft({ ...draft, anchor_single: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                />
              </label>
              <label className="text-xs text-slate-400 block">
                سعر البوكس (المستوى ١)
                <input
                  type="number"
                  value={draft.tier1_price}
                  onChange={(e) => setDraft({ ...draft, tier1_price: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                />
              </label>
              <label className="text-xs text-slate-400 block">
                مرجع البوكس (المستوى ١)
                <input
                  type="number"
                  value={draft.tier1_anchor}
                  onChange={(e) => setDraft({ ...draft, tier1_anchor: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-white"
                />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
              />
              المنتج ظاهر في المتجر
            </label>
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
            >
              {saving ? 'جاري الحفظ…' : 'حفظ التعديلات'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
