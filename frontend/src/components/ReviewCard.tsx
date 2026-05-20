import { Stars } from './Stars'
import type { Review } from '../data/socialProof'

/** RTL list style: text + stars on the left, portrait on the right. */
export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="card flex flex-row items-stretch gap-4 p-4 md:p-5">
      {/* RTL: first column = right side = customer photo */}
      <div className="shrink-0 order-1">
        <img
          src={review.avatar}
          alt={review.name}
          width={80}
          height={80}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover object-[center_20%] border-2 border-white shadow-sm ring-1 ring-surface-border/80"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* RTL: second column = left side = review content */}
      <div className="flex-1 min-w-0 order-2 flex flex-col justify-center text-right">
        <Stars count={review.rating} />
        <p className="mt-2 text-sm text-ink/90 leading-relaxed">{review.text}</p>
        <p className="mt-3 text-xs font-semibold text-ink">{review.name}</p>
        <p className="text-[11px] text-surface-muted mt-0.5">
          عميلة، {review.area} · {review.date} · {review.product}
        </p>
      </div>
    </article>
  )
}
