import { useState } from 'react'
import { FAQ_ITEMS } from '../data/socialProof'

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section">
      <div className="container-narrow max-w-2xl">
        <p className="section-label text-center">أسئلة شائعة</p>
        <h2 className="section-title text-center mb-8">قبل ما تطلبين</h2>
        <ul className="space-y-2">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <li key={item.q} className="card overflow-hidden">
                <button
                  type="button"
                  className="w-full text-right px-5 py-4 flex justify-between items-center gap-4 font-medium text-ink hover:bg-cream/50 transition-colors"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <span className="text-surface-muted text-lg shrink-0" aria-hidden>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm text-surface-muted leading-relaxed border-t border-surface-border pt-3">
                    {item.a}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
