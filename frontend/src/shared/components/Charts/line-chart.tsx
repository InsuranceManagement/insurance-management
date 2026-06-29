"use client"

import { useMemo } from "react"

import { Chart, type ChartOptions } from "@highcharts/react"

import { ChartCard } from "@/shared/components/ChartCard/chart-card"
import { EmptyChartCard } from "@/shared/components/EmptyChartCard/empty-chart-card"
import { useChartData } from "@/shared/hooks/use-chart-data"
import { useHighchartsTheme } from "@/shared/hooks/use-highcharts-theme"
import { useHighchartsSeriesData } from "@/shared/hooks/use-highcharts-series-data"
import { cn } from "@/shared/lib/utils"
import { type BaseChartProps } from "@/shared/models/charts/chart-config"
import { ChartTypeSizePreset } from "@/shared/models/charts/chart-size-preset"

export type LineChartProps = BaseChartProps & {
  className?: string
  smooth?: boolean
  xAxisType?: "category" | "linear"
}

export function LineChart({
  dataUrl,
  series: inputSeries,
  className,
  unit,
  title,
  subtitle,
  xAxisTitle,
  yAxisTitle,
  showLegend = true,
  smooth = false,
  xAxisType = "category",
}: Readonly<LineChartProps>) {
  const { data: points } = useChartData({
    dataUrl,
  })
  const highchartsTheme = useHighchartsTheme()

  const chartData = useMemo(
    () => [
      {
        ...inputSeries,
        data: points ?? [],
      },
    ],
    [inputSeries, points],
  )

  const { series, isEmpty } = useHighchartsSeriesData({
    data: chartData,
    seriesType: "line",
    unit,
  })

  const options = useMemo<ChartOptions>(
    () => ({
      chart: {
        ...highchartsTheme.chart,
        type: "line",
      },
      title: {
        ...highchartsTheme.title,
        text: title,
      },
      subtitle: {
        ...highchartsTheme.subtitle,
        text: subtitle,
      },
      credits: {
        enabled: false,
      },
      legend: {
        ...highchartsTheme.legend,
        enabled: showLegend,
        align: "center",
        verticalAlign: "bottom",
        layout: "horizontal",
      },
      xAxis: {
        type: xAxisType,
        lineColor: highchartsTheme.axis.lineColor,
        tickColor: highchartsTheme.axis.tickColor,
        labels: highchartsTheme.axis.labels,
        title: {
          ...highchartsTheme.axis.title,
          text: xAxisTitle,
        },
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        gridLineColor: highchartsTheme.axis.gridLineColor,
        labels: highchartsTheme.axis.labels,
        title: {
          ...highchartsTheme.axis.title,
          text: yAxisTitle,
        },
      },
      tooltip: {
        ...highchartsTheme.tooltip,
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
      highchartsTheme,
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
