import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection, scrollToTop } from '../lib/scroll'

/**
 * On every route change: scroll to top, or to the hash target section once it exists.
 * Product CTAs use `/product/:slug#purchase-offer`.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const sectionId = hash ? hash.replace(/^#/, '') : ''
    if (sectionId) {
      scrollToSection(sectionId, { behavior: 'instant', maxAttempts: 16, block: 'start' })
      return
    }
    scrollToTop('instant')
  }, [pathname, hash])

  return null
}
