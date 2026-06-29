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

export type PieChartProps = BaseChartProps & {
  className?: string
  donut?: boolean
  showDataLabels?: boolean
}
export function PieChart({
  dataUrl,
  series: inputSeries,
  className,
  unit,
  title,
  subtitle,
  showLegend = true,
  donut = false,
  showDataLabels = true,
}: Readonly<PieChartProps>) {
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
    seriesType: "pie",
    unit,
  })

  const options = useMemo<ChartOptions | null>(
    () =>
      highchartsTheme
        ? {
      chart: {
        ...highchartsTheme.chart,
        type: "pie",
      },
      colors: highchartsTheme.colors,
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
      plotOptions: {
        pie: {
          animation: false,
          allowPointSelect: true,
          cursor: "pointer",
          borderWidth: 0,
          innerSize: donut ? "45%" : "0%",
          dataLabels: {
            ...highchartsTheme.dataLabels,
            enabled: showDataLabels,
            format: "{point.name}: {point.percentage:.1f}%",
          },
        },
      },
      series,
    }
        : null,
    [
      donut,
      highchartsTheme,
      series,
      showDataLabels,
      showLegend,
      subtitle,
      title,
    ],
  )

  if (!options) {
    return (
      <ChartCard preset={ChartTypeSizePreset.FOUR_BY_FOUR}>
        <div className="h-full w-full" />
      </ChartCard>
    )
  }

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
