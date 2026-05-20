import { Stars } from './Stars'
import { TRUST_STATS } from '../data/socialProof'

export function RatingSummary({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${compact ? 'text-sm' : ''}`}
      aria-label={`تقييم ${TRUST_STATS.rating} من 5`}
    >
      <Stars count={5} />
      <span className="font-semibold text-ink">{TRUST_STATS.rating}</span>
      <span className="text-surface-muted">
        ({TRUST_STATS.count}+ طلب{TRUST_STATS.kuwaitOnly ? '، الكويت' : ''})
      </span>
      {!compact && (
        <span className="w-full text-[11px] text-surface-muted mt-0.5">{TRUST_STATS.disclaimer}</span>
      )}
    </div>
  )
}
