import type Highcharts from "highcharts"
import { useMemo } from "react"

import { type ChartSeries } from "@/shared/models/charts/chart-series"

type CategoricalSeriesOption =
  | Highcharts.SeriesBarOptions
  | Highcharts.SeriesColumnOptions

type CategoricalChartOrientation = "bar" | "column"

type UseCategoricalChartDataParams = {
  data: ChartSeries[]
  orientation: CategoricalChartOrientation
  fillValue?: number
}

type UseCategoricalChartDataResult = {
  categories: string[]
  series: CategoricalSeriesOption[]
}

export function useCategoricalChartData({
  data,
  orientation,
  fillValue = 0,
}: Readonly<UseCategoricalChartDataParams>): UseCategoricalChartDataResult {
  return useMemo(() => {
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

    return {
      categories,
      series,
    }
  }, [data, fillValue, orientation])
}
