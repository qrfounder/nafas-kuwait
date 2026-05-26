import { Outlet } from 'react-router-dom'
import { ApiStatusBanner } from './ApiStatusBanner'
import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from './CartDrawer'
import { CheckoutModal } from './CheckoutModal'
import { PostCheckoutUpsell } from './PostCheckoutUpsell'
import { useState } from 'react'

export function Layout() {
  const [upsellState, setUpsellState] = useState<{
    orderNumber: string
    upsell: { sku: string; title_ar: string; anchor: number; price: number }
  } | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      <ApiStatusBanner />
      <Header />
      <main className="flex-1">
        <Outlet context={{ setUpsellState }} />
      </main>
      <Footer />
      <CartDrawer />
      <CheckoutModal
        onSuccess={(orderNumber, postUpsell) => {
          if (postUpsell) {
            setUpsellState({ orderNumber, upsell: postUpsell })
          } else {
            window.location.href = `/thank-you?order=${orderNumber}`
          }
        }}
      />
      {upsellState && (
        <PostCheckoutUpsell
          orderNumber={upsellState.orderNumber}
          upsell={upsellState.upsell}
          onDone={() => setUpsellState(null)}
        />
      )}
    </div>
  )
}
