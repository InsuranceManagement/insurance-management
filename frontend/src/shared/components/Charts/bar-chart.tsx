"use client"

import { useMemo } from "react"

import { Chart, type ChartOptions } from "@highcharts/react"

import { ChartCard } from "@/shared/components/ChartCard/chart-card"
import { EmptyChartCard } from "@/shared/components/EmptyChartCard/empty-chart-card"
import { useChartData } from "@/shared/hooks/use-chart-data"
import { useHighchartsSeriesData } from "@/shared/hooks/use-highcharts-series-data"
import { cn } from "@/shared/lib/utils"
import { type BaseChartProps } from "@/shared/models/charts/chart-config"
import { ChartTypeSizePreset } from "@/shared/models/charts/chart-size-preset"

export type BarChartProps = BaseChartProps & {
  className?: string
  stacked?: boolean
}

export function BarChart({
  dataUrl,
  series: inputSeries,
  className,
  title,
  subtitle,
  xAxisTitle,
  yAxisTitle,
  stacked = false,
  showLegend = true,
}: Readonly<BarChartProps>) {
  const { data: points } = useChartData({
    dataUrl,
  })

  const chartData = useMemo(
    () => [
      {
        ...inputSeries,
        data: points,
      },
    ],
    [inputSeries, points],
  )

  const { series, isEmpty } = useHighchartsSeriesData({
    data: chartData,
    seriesType: "column",
  })

  const options = useMemo<ChartOptions>(
    () => ({
      chart: {
        type: "column",
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
      },
      xAxis: {
        type: "category",
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
    [series, showLegend, stacked, subtitle, title, xAxisTitle, yAxisTitle],
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
