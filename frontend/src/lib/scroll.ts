export type ScrollBehaviorOption = ScrollBehavior | 'instant'

const HEADER_SCROLL_MARGIN = 96 /** matches scroll-mt-24 */

/** Scroll to page top (use on route changes). */
export function scrollToTop(behavior: ScrollBehaviorOption = 'instant') {
  window.scrollTo({ top: 0, left: 0, behavior: behavior as ScrollBehavior })
}

function isSectionVisible(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top >= HEADER_SCROLL_MARGIN - 8 && rect.top < window.innerHeight * 0.55
}

/** Scroll to a section by id; retries until the element exists (async pages). */
export function scrollToSection(
  id: string,
  opts?: {
    behavior?: ScrollBehaviorOption
    maxAttempts?: number
    /** Skip scroll if the section is already in a comfortable viewport position. */
    onlyIfNeeded?: boolean
    block?: ScrollLogicalPosition
  },
) {
  const behavior = opts?.behavior ?? 'instant'
  const max = opts?.maxAttempts ?? 12
  const block = opts?.block ?? (opts?.onlyIfNeeded ? 'nearest' : 'start')
  let attempts = 0

  const run = () => {
    const el = document.getElementById(id)
    if (el) {
      if (opts?.onlyIfNeeded && isSectionVisible(el)) return
      el.scrollIntoView({ behavior: behavior as ScrollBehavior, block })
      return
    }
    if (++attempts < max) requestAnimationFrame(run)
  }
  run()
}

/** Remember scroll position across a state update inside a container (e.g. tier/mode toggle). */
export function preserveScrollPosition(run: () => void) {
  const y = window.scrollY
  run()
  requestAnimationFrame(() => {
    window.scrollTo({ top: y, left: 0, behavior: 'instant' })
  })
}
