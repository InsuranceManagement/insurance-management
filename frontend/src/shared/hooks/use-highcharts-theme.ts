import { useEffect, useMemo, useState } from "react"

type HighchartsTheme = {
  background: string
  border: string
  foreground: string
  mutedForeground: string
  popover: string
  popoverForeground: string
  fontFamily: string
}

const fallbackTheme: HighchartsTheme = {
  background: "transparent",
  border: "#e5e7eb",
  foreground: "#111827",
  mutedForeground: "#6b7280",
  popover: "#ffffff",
  popoverForeground: "#111827",
  fontFamily: "inherit",
}

function getCssVariableValue(styles: CSSStyleDeclaration, variableName: string) {
  return styles.getPropertyValue(variableName).trim()
}

function getHighchartsTheme(): HighchartsTheme {
  const styles = getComputedStyle(document.documentElement)
  const bodyStyles = getComputedStyle(document.body)

  return {
    background:
      getCssVariableValue(styles, "--card") || fallbackTheme.background,
    border: getCssVariableValue(styles, "--border") || fallbackTheme.border,
    foreground:
      getCssVariableValue(styles, "--card-foreground") ||
      fallbackTheme.foreground,
    mutedForeground:
      getCssVariableValue(styles, "--muted-foreground") ||
      fallbackTheme.mutedForeground,
    popover: getCssVariableValue(styles, "--popover") || fallbackTheme.popover,
    popoverForeground:
      getCssVariableValue(styles, "--popover-foreground") ||
      fallbackTheme.popoverForeground,
    fontFamily: bodyStyles.fontFamily || fallbackTheme.fontFamily,
  }
}

export function useHighchartsTheme() {
  const [theme, setTheme] = useState<HighchartsTheme>(fallbackTheme)

  useEffect(() => {
    const updateTheme = () => {
      setTheme(getHighchartsTheme())
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return useMemo(
    () => ({
      chart: {
        backgroundColor: "transparent",
        style: {
          color: theme.foreground,
          fontFamily: theme.fontFamily,
        },
      },
      title: {
        style: {
          color: theme.foreground,
          fontWeight: "600",
        },
      },
      subtitle: {
        style: {
          color: theme.mutedForeground,
        },
      },
      axis: {
        lineColor: theme.border,
        tickColor: theme.border,
        gridLineColor: theme.border,
        labels: {
          style: {
            color: theme.mutedForeground,
          },
        },
        title: {
          style: {
            color: theme.mutedForeground,
          },
        },
      },
      legend: {
        itemStyle: {
          color: theme.mutedForeground,
        },
        itemHoverStyle: {
          color: theme.foreground,
        },
        itemHiddenStyle: {
          color: theme.mutedForeground,
          opacity: 0.45,
        },
      },
      tooltip: {
        backgroundColor: theme.popover,
        borderColor: theme.border,
        style: {
          color: theme.popoverForeground,
        },
      },
      dataLabels: {
        color: theme.foreground,
        connectorColor: theme.border,
        style: {
          color: theme.foreground,
          textOutline: "none",
        },
      },
    }),
    [theme],
  )
}
