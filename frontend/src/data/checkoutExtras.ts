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
    title_ar: 'Priority fulfillment',
    desc_ar:
      'We move your order to the front of the packing queue within 24 hours of payment. Delivery to your door still typically takes 3–7 business days depending on location and carrier.',
    price_usd: 7,
    recommended: true,
  },
  delivery_protection: {
    sku: 'delivery_protection',
    title_ar: 'Faster damage follow-up',
    desc_ar:
      'Replacement or return for defects is covered by our store policy for all orders. This option prioritizes your case if something arrives damaged in transit.',
    price_usd: 5,
  },
}

/** Order: speed bump first (clear queue story), then damage handling. */
export const CHECKOUT_EXTRAS_ORDER: CheckoutExtraKey[] = ['priority_delivery', 'delivery_protection']
