export type ScrollBehaviorOption = ScrollBehavior | 'instant'

/** Scroll to page top (use on route changes). */
export function scrollToTop(behavior: ScrollBehaviorOption = 'instant') {
  window.scrollTo({ top: 0, left: 0, behavior: behavior as ScrollBehavior })
}

/** Scroll to a section by id; retries until the element exists (async pages). */
export function scrollToSection(
  id: string,
  opts?: { behavior?: ScrollBehaviorOption; maxAttempts?: number },
) {
  const behavior = opts?.behavior ?? 'instant'
  const max = opts?.maxAttempts ?? 12
  let attempts = 0

  const run = () => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: behavior as ScrollBehavior, block: 'start' })
      return
    }
    if (++attempts < max) requestAnimationFrame(run)
  }
  run()
}
