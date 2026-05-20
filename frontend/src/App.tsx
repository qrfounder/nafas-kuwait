import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CollectionPage } from './pages/CollectionPage'
import { ProductPage } from './pages/ProductPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PoliciesPage } from './pages/PoliciesPage'
import { ThankYouPage } from './pages/ThankYouPage'
import { MojourneyPage } from './pages/MojourneyPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
      </Route>
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/mojourney" element={<MojourneyPage />} />
    </Routes>
  )
}
