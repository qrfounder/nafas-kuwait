import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '../lib/scroll'

/**
 * Scroll to a section once when landing with a hash (e.g. #purchase-offer).
 * Does not re-scroll when unrelated state inside the page changes (tier, mode, etc.).
 */
export function useHashSectionScroll(sectionId: string, ready: boolean) {
  const { pathname, hash } = useLocation()
  const scrolledKey = useRef<string | null>(null)
  const routeKey = `${pathname}${hash}`

  useEffect(() => {
    scrolledKey.current = null
  }, [routeKey])

  useEffect(() => {
    if (!ready || !hash) return
    const target = hash.replace(/^#/, '')
    if (target !== sectionId) return
    if (scrolledKey.current === routeKey) return
    scrollToSection(sectionId, { behavior: 'instant', maxAttempts: 16 })
    scrolledKey.current = routeKey
  }, [ready, routeKey, hash, sectionId])
}
