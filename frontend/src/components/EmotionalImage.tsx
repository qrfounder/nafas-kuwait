import type { EmotionalFrame } from '../data/productEmotionalImages'
import { OptimizedImage } from './OptimizedImage'
import { toWebp } from '../lib/optimizedImage'

const moodStyles: Record<EmotionalFrame['mood'], string> = {
  fear: 'from-slate-900/50 to-transparent',
  shame: 'from-ink/60 to-transparent',
  guilt: 'from-rose-brand/40 to-transparent',
  relief: 'from-trust-green/30 to-transparent',
  hope: 'from-rose-brand/25 to-gold-accent/10',
  love: 'from-rose-brand/35 to-gold-accent/15',
}

type Props = {
  frame: EmotionalFrame
  aspect?: '4/3' | '16/10' | '21/9'
  priority?: boolean
  showCaption?: boolean
  variant?: 'default' | 'before' | 'after'
  className?: string
}

const aspectClass = {
  '4/3': 'aspect-[4/3]',
  '16/10': 'aspect-[16/10]',
  '21/9': 'aspect-[21/9]',
}

export function EmotionalImage({
  frame,
  aspect = '4/3',
  priority,
  showCaption = true,
  variant = 'default',
  className = '',
}: Props) {
  const border =
    variant === 'before'
      ? 'ring-2 ring-surface-muted/40'
      : variant === 'after'
        ? 'ring-2 ring-rose-brand/30'
        : ''

  return (
    <figure
      className={`relative overflow-hidden rounded-xl border border-surface-border shadow-card ${aspectClass[aspect]} ${border} ${className}`}
    >
      <OptimizedImage
        src={frame.src}
        alt={frame.alt}
        pictureClassName="absolute inset-0 block w-full h-full"
        className="absolute inset-0 w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onError={(ev) => {
          const img = ev.currentTarget
          if (!img.dataset.fallback) {
            img.dataset.fallback = '1'
            const fallback = toWebp('/products/emotional/home/hero.png')
            img.src = fallback
            const pic = img.closest('picture')
            pic?.querySelectorAll('source').forEach((s) => {
              s.srcset = fallback
            })
          }
        }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${moodStyles[frame.mood]} pointer-events-none`} />
      {showCaption && (
        <figcaption className="absolute bottom-0 inset-x-0 p-4 text-white">
          <p className="text-sm md:text-base font-display font-bold drop-shadow-md leading-snug">
            {frame.caption_ar}
          </p>
        </figcaption>
      )}
    </figure>
  )
}
