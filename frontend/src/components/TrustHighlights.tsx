const ITEMS = [
  { label: 'ادفعي عند الباب', detail: 'بدون بطاقة أونلاين' },
  { label: 'تأكيد هاتفي', detail: 'قبل الشحن' },
  { label: 'توصيل الكويت', detail: 'غالباً ١–٧ أيام' },
  { label: 'استبدال 7 أيام', detail: 'عند وجود عيب' },
]

export function TrustHighlights() {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {ITEMS.map((item) => (
        <li
          key={item.label}
          className="rounded-lg border border-surface-border bg-white px-3 py-3 text-center"
        >
          <p className="text-xs font-semibold text-ink">{item.label}</p>
          <p className="text-[10px] text-surface-muted mt-0.5">{item.detail}</p>
        </li>
      ))}
    </ul>
  )
}
