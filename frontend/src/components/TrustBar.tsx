export function TrustBar() {
  const items = [
    { label: 'ادفعي عند الباب', sub: 'بدون بطاقة' },
    { label: 'توصيل الكويت', sub: 'غالباً ١–٧ أيام' },
    { label: 'تأكيد هاتفي', sub: 'قبل الشحن' },
  ]

  return (
    <div className="bg-white border-b border-surface-border">
      <div className="container-narrow h-9 flex items-center justify-center gap-6 md:gap-10 text-[11px] md:text-xs text-surface-muted">
        {items.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-trust-green shrink-0" aria-hidden />
            <span>
              <span className="font-semibold text-ink">{item.label}</span>
              <span className="hidden sm:inline text-surface-muted">، {item.sub}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
