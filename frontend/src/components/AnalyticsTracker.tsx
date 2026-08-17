import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackStoreEvent } from '../lib/visitorAnalytics'

/** Records page views on every route change (storefront only). */
export function AnalyticsTracker() {
  const location = useLocation()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (location.pathname.startsWith('/mojourney') || location.pathname.startsWith('/mojo')) return
    const path = location.pathname + location.search
    if (lastPath.current === path) return
    lastPath.current = path

    trackStoreEvent('page_view', { path })
  }, [location.pathname, location.search])

  return null
}
