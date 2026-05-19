export function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="text-gold-accent text-sm tracking-tight" aria-label={`${count} من 5`}>
      {'★'.repeat(count)}
    </span>
  )
}
