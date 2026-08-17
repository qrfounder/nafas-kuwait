import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnalyticsTracker } from './components/AnalyticsTracker'
import { LiveHeartbeat } from './components/LiveHeartbeat'
import { ScrollToTop } from './components/ScrollToTop'
import { KsaLandingPage } from './pages/KsaLandingPage'

const Layout = lazy(() => import('./components/Layout').then((m) => ({ default: m.Layout })))
const CollectionPage = lazy(() => import('./pages/CollectionPage').then((m) => ({ default: m.CollectionPage })))
const AdSafeProductPage = lazy(() =>
  import('./pages/AdSafeProductPage').then((m) => ({ default: m.AdSafeProductPage })),
)
const ProductPage = lazy(() => import('./pages/ProductPage').then((m) => ({ default: m.ProductPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const PoliciesPage = lazy(() => import('./pages/PoliciesPage').then((m) => ({ default: m.PoliciesPage })))
const ReturnsPage = lazy(() => import('./pages/ReturnsPage').then((m) => ({ default: m.ReturnsPage })))
const ThankYouPage = lazy(() => import('./pages/ThankYouPage').then((m) => ({ default: m.ThankYouPage })))
const MojourneyPage = lazy(() => import('./pages/MojourneyPage').then((m) => ({ default: m.MojourneyPage })))

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AnalyticsTracker />
      <LiveHeartbeat />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<KsaLandingPage />} />
          <Route path="/product/official" element={<KsaLandingPage />} />
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
          <Route path="/mojo" element={<MojourneyPage />} />
          <Route path="/mojourney" element={<MojourneyPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
