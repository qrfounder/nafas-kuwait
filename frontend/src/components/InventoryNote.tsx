type Props = {
  stockLeft: number
  compact?: boolean
}

/** Subtle stock note، no fake viewer counts */
export function InventoryNote({ stockLeft, compact }: Props) {
  if (stockLeft > 20) return null

  return (
    <p
      className={`text-surface-muted ${compact ? 'text-xs' : 'text-sm'} flex items-center gap-2`}
      role="status"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-rose-brand/60 shrink-0" aria-hidden />
      الكمية محدودة هذا الأسبوع، متبقي تقريباً {stockLeft} بوكس
    </p>
  )
}
