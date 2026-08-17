import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ApiStatusBanner } from './ApiStatusBanner'
import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from './CartDrawer'
import { CheckoutModal } from './CheckoutModal'
import { OrganizationJsonLd } from './ProductJsonLd'

export function Layout() {
  useEffect(() => {
    if (document.getElementById('us-fonts')) return
    const link = document.createElement('link')
    link.id = 'us-fonts'
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap'
    document.head.appendChild(link)
  }, [])

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
