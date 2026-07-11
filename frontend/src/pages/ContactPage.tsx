import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { submitContact } from '../lib/api'
import { BUSINESS, formatAddressLines, hasPhysicalAddress } from '../data/business'

export function ContactPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const addressLines = formatAddressLines()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await submitContact({
        name: String(fd.get('name')),
        phone: String(fd.get('phone') || ''),
        email: String(fd.get('email') || '') || undefined,
        message: String(fd.get('message')),
      })
      setSent(true)
    } catch {
      setError(`We could not send your message. Please try again or email ${BUSINESS.supportEmail}.`)
    }
  }

  return (
    <div className="container-narrow max-w-lg py-12">
      <div className="flex justify-start mb-4">
        <Logo compact />
      </div>
      <p className="section-label">Contact</p>
      <h1 className="section-title mb-6">Customer service</h1>

      <div className="card p-5 mb-8 space-y-3 text-sm">
        <p>
          <span className="text-surface-muted">Email · </span>
          <a href={`mailto:${BUSINESS.supportEmail}`} className="text-rose-brand font-medium underline">
            {BUSINESS.supportEmail}
          </a>
        </p>
        {BUSINESS.supportPhone ? (
          <p>
            <span className="text-surface-muted">Phone · </span>
            <a href={`tel:${BUSINESS.supportPhone}`} className="text-ink font-medium" dir="ltr">
              {BUSINESS.supportPhone}
            </a>
          </p>
        ) : null}
        {hasPhysicalAddress() ? (
          <div>
            <p className="text-surface-muted mb-1">Business address</p>
            {addressLines.map((line) => (
              <p key={line} className="text-ink font-medium">
                {line}
              </p>
            ))}
            {BUSINESS.legalName ? <p className="text-xs text-surface-muted mt-1">{BUSINESS.legalName}</p> : null}
          </div>
        ) : (
          <p className="text-xs text-surface-muted leading-relaxed border-t border-surface-border pt-3">
            Prefer email for the fastest reply. Phone and mailing address will appear here once published.
          </p>
        )}
        <p className="text-xs text-surface-muted">
          Returns:{' '}
          <Link to="/returns" className="text-rose-brand underline">
            /returns
          </Link>
        </p>
      </div>

      {sent ? (
        <p className="text-trust-green font-medium">Thanks. We received your message and will reply soon.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 card p-6">
          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full border border-surface-border rounded-lg px-3 py-2.5 text-sm"
          />
          <input
            name="phone"
            placeholder="Phone (e.g. 555-123-4567)"
            className="w-full border border-surface-border rounded-lg px-3 py-2.5 text-sm"
            dir="ltr"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border border-surface-border rounded-lg px-3 py-2.5 text-sm"
            dir="ltr"
          />
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Your message"
            className="w-full border border-surface-border rounded-lg px-3 py-2.5 text-sm"
          />
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Send message
          </button>
        </form>
      )}
    </div>
  )
}
