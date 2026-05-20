import { ReviewCard } from './ReviewCard'
import { RatingSummary } from './RatingSummary'
import { reviewsForPage, type ReviewPage } from '../data/socialProof'

type Props = {
  page: ReviewPage
  title?: string
  subtitle?: string
  className?: string
}

export function ReviewsSection({
  page,
  title = 'تجارب من الكويت',
  subtitle = 'صور عميلات من الكويت. كل تعليق يجاوب سؤال كنتِ تسألينه قبل الطلب، بدون صور منتج.',
  className = 'section bg-cream',
}: Props) {
  const items = reviewsForPage(page)

  return (
    <section className={`${className}`.trim()}>
      <div className="container-narrow">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="section-label">آراء العملاء</p>
            <h2 className="section-title">{title}</h2>
            <p className="text-sm text-surface-muted mt-2 max-w-xl leading-relaxed">{subtitle}</p>
          </div>
          <RatingSummary />
        </div>
        <div className="w-full flex flex-col gap-3">
          {items.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>
    </section>
  )
}
