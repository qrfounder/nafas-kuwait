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

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cod',
    src: '/payments/cod.svg',
    alt: 'الدفع عند الاستلام، كاش',
    width: 38,
    height: 24,
  },
  {
    id: 'knet',
    src: '/payments/knet.svg',
    alt: 'KNET الكويت',
    width: 38,
    height: 24,
  },
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

/** Kuwait checkout: COD + KNET + cards (no Amex/Apple in compact strip). */
export const PAYMENT_METHODS_COMPACT = PAYMENT_METHODS.filter((m) =>
  ['cod', 'knet', 'visa', 'mastercard'].includes(m.id),
)
