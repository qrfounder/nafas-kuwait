import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTop } from '../lib/scroll'

/** On route change, always start at the top (hero + header visible first). */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    scrollToTop('instant')
  }, [pathname])

  return null
}
