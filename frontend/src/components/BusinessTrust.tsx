/** GCC COD authority signals — reduces perceived risk (CRO trust layer). */
export function BusinessTrust({ compact }: { compact?: boolean }) {
  const items = [
    { label: 'تجارة إلكترونية', value: 'متجر كويتي — nafas.shop' },
    { label: 'الدفع', value: 'COD فقط — بدون بطاقة أونلاين' },
    { label: 'التوصيل', value: 'شركاء شحن داخل الكويت' },
    { label: 'الدعم', value: 'واتساب + تأكيد هاتفي' },
  ]

  if (compact) {
    return (
      <p className="text-[11px] text-surface-muted text-center">
        متجر نفس · كويت · دفع عند الاستلام · منتجات راحة وليست علاجاً طبياً
      </p>
    )
  }

  return (
    <section className="bg-white border border-surface-border rounded-xl p-5">
      <p className="section-label mb-3">لماذا تثقين بنا</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-surface-muted">{item.label}</p>
            <p className="text-sm font-medium text-ink mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
