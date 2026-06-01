"use client"

import { useMemo } from "react"

import { Chart, type ChartOptions } from "@highcharts/react"

import { ChartCard } from "@/shared/components/ChartCard/chart-card"
import { EmptyChartCard } from "@/shared/components/EmptyChartCard/empty-chart-card"
import { useHighchartsSeriesData } from "@/shared/hooks/use-highcharts-series-data"
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
  xAxisType?: "category" | "linear"
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
  xAxisType = "category",
}: Readonly<LineChartProps>) {
  const { series, isEmpty } = useHighchartsSeriesData({
    data,
    seriesType: "line",
  })

  const options = useMemo<ChartOptions>(
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
        type: xAxisType,
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
      series,
      showLegend,
      smooth,
      subtitle,
      title,
      xAxisTitle,
      yAxisTitle,
      xAxisType,
    ],
  )

  return isEmpty ? (
    <EmptyChartCard
      preset={ChartTypeSizePreset.FOUR_BY_FOUR}
      className={className}
    />
  ) : (
    <ChartCard preset={ChartTypeSizePreset.FOUR_BY_FOUR}>
      <Chart
        options={options}
        containerProps={{
          className: cn("h-full w-full", className),
        }}
      />
    </ChartCard>
  )
}
