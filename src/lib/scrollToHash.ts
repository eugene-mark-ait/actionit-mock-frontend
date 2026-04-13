/** Offset for sticky global nav (~80–96px) */
const NAV_OFFSET_PX = 96

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Smooth-scrolls so the target id sits below the sticky navbar.
 * Uses window.scrollTo for reliable offset (scroll-margin alone is not always enough across browsers).
 */
export function scrollToHash(hash: string): void {
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return

  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET_PX
  window.scrollTo({ top: Math.max(0, top), behavior })
}
