import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768
const LG_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/** True when viewport is large enough for the fixed left dashboard rail (matches `lg:` in Tailwind). */
export function useIsLgUp() {
  const [lgUp, setLgUp] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`)
    const onChange = () => setLgUp(mql.matches)
    mql.addEventListener("change", onChange)
    setLgUp(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return lgUp
}
