import Highcharts, { type Options } from "highcharts"
import { useEffect, useMemo, useRef } from "react"

import { type ChartSeries } from "@/shared/models/charts/chart-series"

type CategoricalSeriesOption =
  | Highcharts.SeriesBarOptions
  | Highcharts.SeriesColumnOptions
  | Highcharts.SeriesLineOptions

type CategoricalChartOrientation = "bar" | "column" | "line"

type UseCategoricalChartDataParams = {
  data: ChartSeries[]
  orientation: CategoricalChartOrientation
  fillValue?: number
}

type UseCategoricalChartDataResult = {
  categories: string[]
  series: CategoricalSeriesOption[]
  isEmpty: boolean
}

type UseHighchartsChartParams = {
  options: Options
  isEmpty: boolean
}

export function useCategoricalChartData({
  data,
  orientation,
  fillValue = 0,
}: Readonly<UseCategoricalChartDataParams>): UseCategoricalChartDataResult {
  const { categories, series } = useMemo(() => {
    const categories = [
      ...new Set(
        data.flatMap((series) => series.points.map((point) => point.x)),
      ),
    ]

    const series = data
      .filter((item) => item.points.length > 0)
      .map((item) => {
        const pointsByCategory = new Map(
          item.points.map((point) => [point.x, point.y]),
        )

        return {
          type: orientation,
          name: item.name,
          data: categories.map(
            (category) => pointsByCategory.get(category) ?? fillValue,
          ),
          color: item.color,
          tooltip: { valueSuffix: item.unit ? ` ${item.unit}` : undefined },
        }
      })

    return { categories, series }
  }, [data, fillValue, orientation])

  const isEmpty = useMemo(
    () => series.length === 0 || categories.length === 0,
    [categories.length, series.length],
  )

  return {
    categories,
    series,
    isEmpty,
  }
}

export function useHighchartsChart({
  options,
  isEmpty,
}: Readonly<UseHighchartsChartParams>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<Highcharts.Chart | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || isEmpty) return

    chartRef.current?.destroy()
    chartRef.current = Highcharts.chart(container, options)

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [isEmpty, options])

  return containerRef
}
