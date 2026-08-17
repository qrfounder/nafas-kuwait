import { Routes, Route } from 'react-router-dom'
import { AnalyticsTracker } from './components/AnalyticsTracker'
import { LiveHeartbeat } from './components/LiveHeartbeat'
import { ScrollToTop } from './components/ScrollToTop'
import { Layout } from './components/Layout'
import { KsaLandingPage } from './pages/KsaLandingPage'
import { CollectionPage } from './pages/CollectionPage'
import { AdSafeProductPage } from './pages/AdSafeProductPage'
import { ProductPage } from './pages/ProductPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PoliciesPage } from './pages/PoliciesPage'
import { ReturnsPage } from './pages/ReturnsPage'
import { ThankYouPage } from './pages/ThankYouPage'
import { MojourneyPage } from './pages/MojourneyPage'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AnalyticsTracker />
      <LiveHeartbeat />
      <Routes>
        <Route path="/" element={<KsaLandingPage />} />
        <Route element={<Layout />}>
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/product/test" element={<AdSafeProductPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
        </Route>
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/mojourney" element={<MojourneyPage />} />
      </Routes>
    </>
  )
}
