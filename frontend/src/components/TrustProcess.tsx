import { ORDER_STEPS } from '../data/socialProof'

export function TrustProcess() {
  return (
    <section className="section bg-white border-y border-surface-border">
      <div className="container-narrow">
        <p className="section-label text-center">كيف يصل طلبج</p>
        <h2 className="section-title text-center mb-10">عملية واضحة — بدون مفاجآت</h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ORDER_STEPS.map((step) => (
            <li key={step.step} className="card p-5">
              <span
                className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-rose-light text-rose-brand font-display font-bold text-sm"
                aria-hidden
              >
                {step.step}
              </span>
              <h3 className="font-semibold text-ink mt-3">{step.title}</h3>
              <p className="text-sm text-surface-muted mt-1 leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
