import { Link } from 'react-router-dom'
import { PaymentMethods } from './PaymentMethods'
import { BusinessIdentity } from './BusinessIdentity'
import { Logo } from './Logo'
import { BUSINESS } from '../data/business'
import { FREE_SHIPPING_THRESHOLD_USD, US_SHIPPING_USD, formatUsd } from '../lib/currency'

export function Footer() {
  return (
    <footer className="bg-ink text-cream/90 mt-auto border-t border-white/5">
      <div className="container-narrow py-12 grid md:grid-cols-3 gap-10">
        <div>
          <Logo variant="footer" className="mb-4" />
          <p className="text-sm text-cream/70 leading-relaxed">
            At-home comfort kits for everyday use. Ships across the United States. Secure Stripe checkout.
          </p>
          <div className="mt-4 text-cream/85">
            <BusinessIdentity compact className="[&_a]:text-cream [&_a:hover]:text-white" />
          </div>
        </div>
        <div>
          <p className="font-semibold text-white text-sm mb-3">Links</p>
          <ul className="space-y-2 text-sm text-cream/75">
            <li>
              <Link to="/collection" className="hover:text-white transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/policies" className="hover:text-white transition-colors">
                Policies
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-white transition-colors">
                Returns
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white text-sm mb-3">Customer care</p>
          <ul className="space-y-2 text-sm text-cream/65 leading-relaxed">
            <li>
              <Link to="/policies#shipping" className="hover:text-white transition-colors">
                Shipping {formatUsd(US_SHIPPING_USD)} · free {formatUsd(FREE_SHIPPING_THRESHOLD_USD)}+
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-white transition-colors">
                30-day returns
              </Link>
            </li>
            <li>US warehouse / 3PL fulfillment</li>
            <li>Comfort products, not medical devices</li>
          </ul>
        </div>
      </div>
      <div>
        <PaymentMethods variant="footer" />
      </div>
      <p className="text-center text-xs text-cream/45 pb-6 pt-4">
        © {new Date().getFullYear()} {BUSINESS.legalName} · brand {BUSINESS.brandName} · naffas.shop · Ships
        to the {BUSINESS.salesCountryName}
      </p>
    </footer>
  )
}
