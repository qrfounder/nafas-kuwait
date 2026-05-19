import { Stars } from './Stars'
import type { Review } from '../data/socialProof'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="card overflow-hidden flex flex-col">
      <div className="relative aspect-[16/10] bg-cream">
        <img
          src={review.photo}
          alt={review.photoCaption}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 text-[10px] bg-ink/70 text-white px-2 py-0.5 rounded">
          {review.photoCaption}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex gap-3">
          <div
            className="w-9 h-9 rounded-full bg-rose-light text-rose-brand flex items-center justify-center text-xs font-semibold shrink-0"
            aria-hidden
          >
            {review.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-ink">{review.name}</span>
              <span className="text-[10px] text-trust-green font-medium border border-trust-green/20 bg-trust-green/5 px-1.5 py-0.5 rounded">
                عميلة · {review.area}
              </span>
            </div>
            <p className="text-[11px] text-surface-muted mt-0.5">
              {review.date} · {review.product}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-surface-border">
          <Stars count={review.rating} />
          <p className="mt-2 text-sm text-ink/85 leading-relaxed">{review.text}</p>
        </div>
      </div>
    </article>
  )
}
