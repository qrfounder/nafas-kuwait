const ITEMS = [
  'ادفعي عند الباب بعد ما تشوفين الطرد',
  'نتصل قبل الشحن ونأكد العنوان',
  'استبدال خلال ٧ أيام إذا في عيب',
  'ما نطلب رقم بطاقة عند الطلب',
]

export function MicroTrust() {
  return (
    <ul className="mt-4 pt-4 border-t border-surface-border space-y-2">
      {ITEMS.map((text) => (
        <li key={text} className="flex items-start gap-2 text-xs text-surface-muted">
          <svg className="w-3.5 h-3.5 text-trust-green shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1-6.5 6.5z" />
          </svg>
          {text}
        </li>
      ))}
    </ul>
  )
}
