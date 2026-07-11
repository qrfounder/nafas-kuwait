/** FAQ + order steps only. No fabricated customer reviews (GMC misrepresentation policy). */

import { BUSINESS } from './business'
import { FREE_SHIPPING_THRESHOLD_USD, US_SHIPPING_USD, formatUsd } from '../lib/currency'

export const ORDER_STEPS = [
  {
    step: '1',
    title: 'Choose your kit',
    desc: 'Pick a bundle or a single piece. Prices shown in USD include clear tier options.',
  },
  {
    step: '2',
    title: 'Checkout securely',
    desc: 'Enter your US shipping address and pay with Stripe (Visa, Mastercard, Amex, Apple Pay).',
  },
  {
    step: '3',
    title: 'We ship from the US',
    desc: 'Orders fulfill from our US warehouse / 3PL. Typical delivery is 3–7 business days after payment.',
  },
  {
    step: '4',
    title: 'Enjoy at home',
    desc: 'Use for everyday comfort. 30-day returns on unused/defective items. See Returns policy.',
  },
]

export const FAQ_ITEMS = [
  {
    q: 'How do I pay?',
    a: 'Checkout is prepaid via Stripe. We accept Visa, Mastercard, American Express, and Apple Pay where Stripe supports them. We do not offer cash on delivery.',
  },
  {
    q: 'Do you ship across the United States?',
    a: `Yes. We ship to addresses in the 50 US states from US warehouse / 3PL partners. Flat shipping of ${formatUsd(US_SHIPPING_USD)} applies under ${formatUsd(FREE_SHIPPING_THRESHOLD_USD)} subtotal; free shipping at ${formatUsd(FREE_SHIPPING_THRESHOLD_USD)}+ subtotal. Typical delivery is 3–7 business days after payment.`,
  },
  {
    q: 'Who operates this store?',
    a: `The store brand is ${BUSINESS.brandName}. The legal business is ${BUSINESS.legalName}, ${BUSINESS.addressLine1}, ${BUSINESS.addressLine2}, ${BUSINESS.city} ${BUSINESS.postalCode}, ${BUSINESS.countryName}. Customer service: ${BUSINESS.supportEmail} · ${BUSINESS.supportPhoneDisplay}. We sell and ship to the ${BUSINESS.salesCountryName}.`,
  },
  {
    q: 'Do the pieces match the photos?',
    a: 'Yes. Site photos show the actual product types. Each kit lists every included piece before you buy.',
  },
  {
    q: 'Can I order a single piece?',
    a: 'Yes. On the product page, choose the “Single piece” tab and select the item you want.',
  },
  {
    q: 'Is this medical treatment?',
    a: 'No. These are at-home comfort devices (heat, stretch, massage, compression). They are not intended to diagnose, treat, cure, or prevent any disease. See a clinician for medical concerns.',
  },
  {
    q: 'What is your return policy?',
    a: `Contact us within 30 days for unused items in original packaging or defective items. Full details: ${BUSINESS.returnsUrl}`,
  },
]
