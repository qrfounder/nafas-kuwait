import { Link } from 'react-router-dom'
import { PaymentMethods } from './PaymentMethods'
import { BusinessTrust } from './BusinessTrust'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="bg-ink text-cream/90 mt-auto border-t border-white/5">
      <div className="container-narrow py-12 grid md:grid-cols-3 gap-10">
        <div>
          <Logo variant="footer" className="mb-4" />
          <p className="text-sm text-cream/70 leading-relaxed">
            نظام راحة للمرأة في الكويت. ادفعي عند الباب وتأكيد هاتفي قبل الشحن.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white text-sm mb-3">روابط</p>
          <ul className="space-y-2 text-sm text-cream/75">
            <li>
              <Link to="/collection" className="hover:text-white transition-colors">
                المجموعة
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                من نحن
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                تواصل
              </Link>
            </li>
            <li>
              <Link to="/policies" className="hover:text-white transition-colors">
                السياسات
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white text-sm mb-3">السياسات</p>
          <ul className="space-y-2 text-sm text-cream/65 leading-relaxed">
            <li>
              <Link to="/policies" className="hover:text-white transition-colors">
                الشحن، الدفع، الاستبدال
              </Link>
            </li>
            <li>تأكيد هاتفي قبل الشحن</li>
            <li>استبدال خلال 7 أيام عند وجود عيب</li>
            <li>منتجات راحة، ليست علاجاً طبياً</li>
          </ul>
        </div>
      </div>
      <div>
        <PaymentMethods variant="footer" />
        <div className="mt-4">
          <BusinessTrust compact />
        </div>
      </div>
      <p className="text-center text-xs text-cream/45 pb-6">
        © {new Date().getFullYear()} Nafas، nafas.shop
      </p>
    </footer>
  )
}
