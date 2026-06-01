"use client"

import { useMemo } from "react"

import { Chart, type ChartOptions } from "@highcharts/react"

import { ChartCard } from "@/shared/components/ChartCard/chart-card"
import { EmptyChartCard } from "@/shared/components/EmptyChartCard/empty-chart-card"
import { useHighchartsSeriesData } from "@/shared/hooks/use-highcharts-series-data"
import { cn } from "@/shared/lib/utils"
import { type ChartSeries } from "@/shared/models/charts/chart-series"
import { ChartTypeSizePreset } from "@/shared/models/charts/chart-size-preset"

type PieChartProps = {
  data: ChartSeries[]
  className?: string
  title?: string
  subtitle?: string
  showLegend?: boolean
  donut?: boolean
  showDataLabels?: boolean
}
export function PieChart({
  data,
  className,
  title,
  subtitle,
  showLegend = true,
  donut = false,
  showDataLabels = true,
}: Readonly<PieChartProps>) {
  const { series, isEmpty } = useHighchartsSeriesData({
    data,
    seriesType: "pie",
  })

  const unit = data[0]?.unit
  const options = useMemo<ChartOptions>(
    () => ({
      chart: {
        type: "pie",
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
      plotOptions: {
        pie: {
          animation: false,
          allowPointSelect: true,
          cursor: "pointer",
          borderWidth: 0,
          innerSize: donut ? "45%" : "0%",
          dataLabels: {
            enabled: showDataLabels,
            format: "{point.name}: {point.percentage:.1f}%",
          },
        },
      },
      series,
    }),
    [donut, series, showDataLabels, showLegend, subtitle, title, unit],
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
