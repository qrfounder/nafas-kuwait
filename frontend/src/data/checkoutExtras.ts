/** Checkout bump offers (optional). Copy matches real policy: returns for defects are standard; bumps add priority handling / queue. */

export type CheckoutExtraKey = 'priority_delivery' | 'delivery_protection'

export const CHECKOUT_EXTRAS: Record<
  CheckoutExtraKey,
  {
    sku: CheckoutExtraKey
    title_ar: string
    desc_ar: string
    price_usd: number
    recommended?: boolean
  }
> = {
  priority_delivery: {
    sku: 'priority_delivery',
    title_ar: 'أولوية في تجهيز الطلب',
    desc_ar:
      'نطلّع طلبج في مقدمة قائمة التجهيز خلال ٢٤ ساعة من تأكيد المكالمة. موعد وصول الطرد للبيت يختلف: غالباً بين يوم وسبعة أيام حسب المنطقة والمندوب.',
    price_usd: 7,
    recommended: true,
  },
  delivery_protection: {
    sku: 'delivery_protection',
    title_ar: 'متابعة مُسرَّعة لو تلف بالشحن',
    desc_ar:
      'استبدال أو إرجاع عند العيب أو التلف من سياسة المتجر لكل الطلبات. هالخيار يخصّص مسار أسرع في المتابعة لو صار ضرر أثناء النقل.',
    price_usd: 5,
  },
}

/** Order: speed bump first (clear queue story), then damage handling. */
export const CHECKOUT_EXTRAS_ORDER: CheckoutExtraKey[] = ['priority_delivery', 'delivery_protection']
