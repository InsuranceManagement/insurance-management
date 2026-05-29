"use client"

import { useMemo } from "react"

import { type Options } from "highcharts"

import { ChartCard } from "@/shared/components/ChartCard/chart-card"
import { EmptyChartCard } from "@/shared/components/EmptyChartCard/empty-chart-card"
import {
  useCategoricalChartData,
  useHighchartsChart,
} from "@/shared/hooks/use-categorical-chart-data"
import { cn } from "@/shared/lib/utils"
import { type ChartSeries } from "@/shared/models/charts/chart-series"
import { ChartTypeSizePreset } from "@/shared/models/charts/chart-size-preset"

type LineChartProps = {
  data: ChartSeries[]
  className?: string
  title?: string
  subtitle?: string
  xAxisTitle?: string
  yAxisTitle?: string
  showLegend?: boolean
  smooth?: boolean
}

export function LineChart({
  data,
  className,
  title,
  subtitle,
  xAxisTitle,
  yAxisTitle,
  showLegend = true,
  smooth = false,
}: Readonly<LineChartProps>) {
  const { categories, series, isEmpty } = useCategoricalChartData({
    data,
    orientation: "line",
  })

  const options = useMemo<Options>(
    () => ({
      chart: {
        type: "line",
        backgroundColor: "transparent",
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
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
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
          marker: {
            enabled: true,
            radius: 3,
          },
          lineWidth: 2,
        },
        line: {
          linecap: smooth ? "round" : undefined,
        },
      },
      series,
    }),
    [
      categories,
      series,
      showLegend,
      smooth,
      subtitle,
      title,
      xAxisTitle,
      yAxisTitle,
    ],
  )
  const containerRef = useHighchartsChart({ options, isEmpty })

  return isEmpty ? (
    <EmptyChartCard
      preset={ChartTypeSizePreset.FOUR_BY_FOUR}
      className={className}
    />
  ) : (
    <ChartCard preset={ChartTypeSizePreset.FOUR_BY_FOUR}>
      <div ref={containerRef} className={cn("h-full w-full", className)} />
    </ChartCard>
  )
}
