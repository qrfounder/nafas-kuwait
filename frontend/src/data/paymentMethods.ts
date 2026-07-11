/**
 * Official payment mark SVGs (Shopify activemerchant/payment_icons, MIT).
 * @see https://github.com/activemerchant/payment_icons
 */

export type PaymentMethod = {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

/** Stripe checkout: major cards + wallets (no COD / KNET). */
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'visa',
    src: '/payments/visa.svg',
    alt: 'Visa',
    width: 38,
    height: 24,
  },
  {
    id: 'mastercard',
    src: '/payments/mastercard.svg',
    alt: 'Mastercard',
    width: 38,
    height: 24,
  },
  {
    id: 'amex',
    src: '/payments/amex.svg',
    alt: 'American Express',
    width: 38,
    height: 24,
  },
  {
    id: 'apple-pay',
    src: '/payments/apple-pay.svg',
    alt: 'Apple Pay',
    width: 38,
    height: 24,
  },
]

/** Compact strip: cards most shoppers recognize. */
export const PAYMENT_METHODS_COMPACT = PAYMENT_METHODS.filter((m) =>
  ['visa', 'mastercard', 'amex', 'apple-pay'].includes(m.id),
)
