import * as React from "react"

// The protected navigation stays in its compact, overlay mode on phones and
// tablets. Keep this value aligned with Tailwind's `lg` breakpoint.
const MOBILE_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }

    // Sync once on mount to avoid hydration mismatches.
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
