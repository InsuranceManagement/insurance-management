import { useEffect, useMemo, useState } from "react"

type HighchartsTheme = {
  background: string
  border: string
  card: string
  chartColors: string[]
  foreground: string
  mutedForeground: string
  muted: string
  primaryForeground: string
  popover: string
  popoverForeground: string
  fontFamily: string
}

function getCssVariableValue(styles: CSSStyleDeclaration, variableName: string) {
  return styles.getPropertyValue(variableName).trim()
}

function getHighchartsTheme(): HighchartsTheme {
  const styles = getComputedStyle(document.documentElement)
  const bodyStyles = getComputedStyle(document.body)
  const chartColors = [
    getCssVariableValue(styles, "--chart-1"),
    getCssVariableValue(styles, "--chart-2"),
    getCssVariableValue(styles, "--chart-3"),
    getCssVariableValue(styles, "--chart-4"),
    getCssVariableValue(styles, "--chart-5"),
  ].filter(Boolean)

  return {
    background: getCssVariableValue(styles, "--card"),
    border: getCssVariableValue(styles, "--border"),
    card: getCssVariableValue(styles, "--card"),
    chartColors,
    foreground: getCssVariableValue(styles, "--card-foreground"),
    mutedForeground: getCssVariableValue(styles, "--muted-foreground"),
    muted: getCssVariableValue(styles, "--muted"),
    primaryForeground: getCssVariableValue(styles, "--primary-foreground"),
    popover: getCssVariableValue(styles, "--popover"),
    popoverForeground: getCssVariableValue(styles, "--popover-foreground"),
    fontFamily: bodyStyles.fontFamily,
  }
}

export function useHighchartsTheme() {
  const [theme, setTheme] = useState<HighchartsTheme | null>(null)

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
    () =>
      theme
        ? {
            colors: theme.chartColors,
            raw: theme,
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
          }
        : null,
    [theme],
  )
}
