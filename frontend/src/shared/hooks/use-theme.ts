import { useCallback, useEffect, useState } from "react"

const THEME_STORAGE_KEY = "theme"

function getShouldUseDarkTheme() {
  const savedTheme = globalThis.localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === "dark") return true

  if (savedTheme === "light") return false

  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
}

export function useTheme() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const shouldUseDark = getShouldUseDarkTheme()

    document.documentElement.classList.toggle("dark", shouldUseDark)
    setIsDark(shouldUseDark)
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark((currentIsDark) => {
      const nextIsDark = !currentIsDark

      document.documentElement.classList.toggle("dark", nextIsDark)
      globalThis.localStorage.setItem(
        THEME_STORAGE_KEY,
        nextIsDark ? "dark" : "light",
      )

      return nextIsDark
    })
  }, [])

  return { isDark, toggleTheme }
}
