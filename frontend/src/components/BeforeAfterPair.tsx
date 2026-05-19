import type { EmotionalFrame } from '../data/productEmotionalImages'
import { EmotionalImage } from './EmotionalImage'

type Props = {
  before: EmotionalFrame
  after: EmotionalFrame
}

export function BeforeAfterPair({ before, after }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="relative">
        <span className="absolute top-3 right-3 z-10 text-[10px] font-bold uppercase tracking-wide bg-ink/70 text-white px-2 py-1 rounded">
          قبل
        </span>
        <EmotionalImage frame={before} aspect="4/3" showCaption={false} variant="before" />
        <p className="mt-2 text-xs text-surface-muted text-center leading-snug">{before.caption_ar}</p>
      </div>
      <div className="relative">
        <span className="absolute top-3 right-3 z-10 text-[10px] font-bold uppercase tracking-wide bg-rose-brand text-white px-2 py-1 rounded">
          بعد
        </span>
        <EmotionalImage frame={after} aspect="4/3" showCaption={false} variant="after" />
        <p className="mt-2 text-xs text-rose-brand text-center font-medium leading-snug">{after.caption_ar}</p>
      </div>
    </div>
  )
}
