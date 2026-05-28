"use client"

import { useEffect, useMemo, useRef } from "react"

import Highcharts, { type Options } from "highcharts"

import { useCategoricalChartData } from "@/shared/hooks/use-categorical-chart-data"
import { cn } from "@/shared/lib/utils"
import { type ChartSeries } from "@/shared/models/charts/chart-series"

type BarChartOrientation = "bar" | "column"

type BarChartProps = {
  data: ChartSeries[]
  className?: string
  title?: string
  subtitle?: string
  xAxisTitle?: string
  yAxisTitle?: string
  height?: number | string
  orientation?: BarChartOrientation
  stacked?: boolean
  showLegend?: boolean
}

const DEFAULT_HEIGHT = 320

function toCssHeight(value: number | string | undefined) {
  if (typeof value === "number") return `${value}px`
  if (typeof value === "string") return value

  return `${DEFAULT_HEIGHT}px`
}

export function BarChart({
  data,
  className,
  title,
  subtitle,
  xAxisTitle,
  yAxisTitle,
  height,
  orientation = "bar",
  stacked = false,
  showLegend = true,
}: Readonly<BarChartProps>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<Highcharts.Chart | null>(null)

  const { categories, series } = useCategoricalChartData({
    data,
    orientation,
  })

  const options = useMemo<Options>(
    () => ({
      chart: {
        type: orientation,
        backgroundColor: "transparent",
        height: height ?? DEFAULT_HEIGHT,
      },
      title: {
        text: title,
      },
      subtitle: {
        text: subtitle,
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: showLegend,
      },
      xAxis: {
        categories,
        title: {
          text: xAxisTitle,
        },
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        title: {
          text: yAxisTitle,
        },
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        series: {
          animation: false,
          borderRadius: 6,
        },
        bar: {
          stacking: stacked ? "normal" : undefined,
        },
        column: {
          stacking: stacked ? "normal" : undefined,
        },
      },
      series,
    }),
    [
      categories,
      height,
      orientation,
      series,
      showLegend,
      stacked,
      subtitle,
      title,
      xAxisTitle,
      yAxisTitle,
    ],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container || series.length === 0 || categories.length === 0) return

    chartRef.current?.destroy()
    chartRef.current = Highcharts.chart(container, options)

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [categories.length, options, series.length])

  if (series.length === 0 || categories.length === 0) {
    return (
      <div
        className={cn(
          "flex h-full min-h-40 w-full items-center justify-center rounded-xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground",
          className,
        )}
      >
        Sem dados para exibir.
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      style={{ height: toCssHeight(height) }}
    />
  )
}
