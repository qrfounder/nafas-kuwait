import { Outlet } from 'react-router-dom'
import { ApiStatusBanner } from './ApiStatusBanner'
import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from './CartDrawer'
import { CheckoutModal } from './CheckoutModal'
import { OrganizationJsonLd } from './ProductJsonLd'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <OrganizationJsonLd />
      <ApiStatusBanner />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <CheckoutModal />
    </div>
  )
}
