const ITEMS = [
  { label: 'Stripe checkout', detail: 'Cards & wallets' },
  { label: 'Ships USA', detail: '3–7 business days' },
  { label: 'Free shipping $100+', detail: '$5.99 under $100' },
  { label: '30-day returns', detail: 'Unused or defective' },
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
