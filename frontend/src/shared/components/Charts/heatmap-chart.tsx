"use client"

import { useMemo } from "react"

import { Chart, type ChartOptions } from "@highcharts/react"
import "highcharts/es-modules/masters/modules/heatmap.src.js"

import { ChartCard } from "@/shared/components/ChartCard/chart-card"
import { EmptyChartCard } from "@/shared/components/EmptyChartCard/empty-chart-card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { useChartData } from "@/shared/hooks/use-chart-data"
import { useHighchartsTheme } from "@/shared/hooks/use-highcharts-theme"
import { cn } from "@/shared/lib/utils"
import { type BaseChartProps } from "@/shared/models/charts/chart-config"
import { ChartTypeSizePreset } from "@/shared/models/charts/chart-size-preset"
import { type ProductTypeHeatmapData } from "@/shared/models/charts/product-type-heatmap"

export type HeatmapChartProps = Omit<BaseChartProps, "series"> & {
  className?: string
}

type HeatmapPoint = {
  x: number
  y: number
  value: number
  productCount: number
  color?: string
}

type HeatmapFormatterContext = {
  x?: number
  y?: number
  productCount?: number
}

export function HeatmapChart({
  dataUrl,
  title,
  subtitle,
  className,
}: Readonly<HeatmapChartProps>) {
  const { data, isLoading, isError } = useChartData<ProductTypeHeatmapData>({
    dataUrl,
  })
  const highchartsTheme = useHighchartsTheme()

  const isEmpty =
    !isLoading &&
    (!data ||
      data.insuranceCompanies.length === 0 ||
      data.productTypes.length === 0 ||
      data.cells.every((cell) => cell.value === 0))

  const options = useMemo<ChartOptions | null>(() => {
    if (!highchartsTheme) {
      return null
    }

    const companies = data?.insuranceCompanies ?? []
    const productTypes = data?.productTypes ?? []
    const companyIndexById = new Map(
      companies.map((company, index) => [company.id, index]),
    )
    const productTypeIndexById = new Map(
      productTypes.map((productType, index) => [productType.id, index]),
    )

    const heatmapData =
      data?.cells.reduce<HeatmapPoint[]>((acc, cell) => {
        const x = productTypeIndexById.get(cell.productTypeId)
        const y = companyIndexById.get(cell.insuranceCompanyId)

        if (x === undefined || y === undefined) {
          return acc
        }

        acc.push({
          x,
          y,
          value: cell.value,
          productCount: cell.productCount,
            color:
              cell.value > 0
                ? highchartsTheme.raw.chartColors[1]
                : highchartsTheme.raw.muted,
        })

        return acc
      }, []) ?? []

    return {
      chart: {
        ...highchartsTheme.chart,
        type: "heatmap",
        spacing: [8, 8, 8, 8],
      },
      colors: highchartsTheme.colors,
      title: {
        ...highchartsTheme.title,
        text: title,
        align: "left",
        style: {
          ...highchartsTheme.title.style,
          fontSize: "0.875rem",
          fontWeight: "600",
        },
      },
      subtitle: {
        ...highchartsTheme.subtitle,
        text: subtitle,
        align: "left",
        style: {
          ...highchartsTheme.subtitle.style,
          fontSize: "0.6875rem",
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        categories: productTypes.map((productType) => productType.name),
        opposite: true,
        tickLength: 0,
        labels: {
          autoRotation: undefined,
          reserveSpace: true,
          style: {
            ...highchartsTheme.axis.labels.style,
            fontSize: "0.625rem",
            textOverflow: "ellipsis",
          },
        },
      },
      yAxis: {
        categories: companies.map((company) => company.name),
        reversed: true,
        title: {
          text: undefined,
        },
        labels: {
          style: {
            ...highchartsTheme.axis.labels.style,
            fontSize: "0.625rem",
          },
        },
      },
      colorAxis: {
        min: 0,
        max: 1,
        stops: [
          [0, highchartsTheme.raw.muted],
          [1, highchartsTheme.raw.chartColors[1]],
        ],
      },
      tooltip: {
        ...highchartsTheme.tooltip,
        formatter() {
          const point = this as HeatmapFormatterContext
          const companyName = companies[point.y ?? 0]?.name ?? ""
          const productTypeName = productTypes[point.x ?? 0]?.name ?? ""
          const productCount = point.productCount ?? 0

          return `<b>${companyName}</b><br/>${productTypeName}: <b>${productCount}</b> produto(s)`
        },
      },
      plotOptions: {
        series: {
          animation: false,
          borderWidth: 2,
          borderColor: highchartsTheme.raw.card,
          dataLabels: {
            enabled: true,
            formatter() {
              const point = this as HeatmapFormatterContext

              return point.productCount ? String(point.productCount) : ""
            },
            style: {
              color: highchartsTheme.raw.primaryForeground,
              fontSize: "0.625rem",
              fontWeight: "600",
              textOutline: "none",
            },
          },
        },
      },
      series: [
        {
          type: "heatmap",
          name: title,
          data: heatmapData,
        },
      ],
    }
  }, [data, highchartsTheme, subtitle, title])

  if (isLoading) {
    return (
      <ChartCard preset={ChartTypeSizePreset.EIGHT_BY_FOUR}>
        <div className="flex h-full flex-col gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid flex-1 grid-cols-6 gap-2">
            {Array.from({ length: 30 }).map((_, index) => (
              <Skeleton key={index} className="h-full min-h-8" />
            ))}
          </div>
        </div>
      </ChartCard>
    )
  }

  if (isError || isEmpty) {
    return (
      <EmptyChartCard
        preset={ChartTypeSizePreset.EIGHT_BY_FOUR}
        className={className}
      />
    )
  }

  if (!options) {
    return (
      <ChartCard preset={ChartTypeSizePreset.EIGHT_BY_FOUR}>
        <div className="h-full w-full" />
      </ChartCard>
    )
  }

  return (
    <ChartCard preset={ChartTypeSizePreset.EIGHT_BY_FOUR}>
      <Chart
        options={options}
        containerProps={{
          className: cn("h-full w-full", className),
        }}
      />
    </ChartCard>
  )
}
