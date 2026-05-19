import { FormEvent, useState } from 'react'
import { submitContact } from '../lib/api'

export function ContactPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

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
      setError('ما قدرنا نرسل — جربي واتساب')
    }
  }

  return (
    <div className="container-narrow max-w-lg py-12">
      <p className="section-label">تواصل</p>
      <h1 className="section-title mb-6">تواصلي معنا</h1>
      {sent ? (
        <p className="text-trust-green font-medium">وصلتنا رسالتج — بنرد عليج قريب إن شاء الله</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 card p-6">
          <input
            name="name"
            required
            placeholder="اسمج"
            className="w-full border border-surface-border rounded-lg px-3 py-2.5 text-sm"
          />
          <input
            name="phone"
            placeholder="رقم الكويت"
            className="w-full border border-surface-border rounded-lg px-3 py-2.5 text-sm"
            dir="ltr"
          />
          <input
            name="email"
            type="email"
            placeholder="إيميل (اختياري)"
            className="w-full border border-surface-border rounded-lg px-3 py-2.5 text-sm"
            dir="ltr"
          />
          <textarea
            name="message"
            required
            rows={4}
            placeholder="رسالتج"
            className="w-full border border-surface-border rounded-lg px-3 py-2.5 text-sm"
          />
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            إرسال
          </button>
        </form>
      )}
      <p className="mt-8 text-sm text-surface-muted text-center">أو واتساب: +965 XXXX XXXX (حدّثي الرقم)</p>
    </div>
  )
}
