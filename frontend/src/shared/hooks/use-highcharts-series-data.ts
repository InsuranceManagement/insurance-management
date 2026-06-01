import {
  type PointOptionsObject,
  type SeriesBarOptions,
  type SeriesColumnOptions,
  type SeriesLineOptions,
  type SeriesPieOptions,
} from "highcharts/highcharts.src"
import { useMemo } from "react"

import { type ChartSeries } from "@/shared/models/charts/chart-series"

type HighchartsSeriesOption =
  | SeriesBarOptions
  | SeriesColumnOptions
  | SeriesLineOptions
  | SeriesPieOptions

type HighchartsSeriesType = "bar" | "column" | "line" | "pie"

type BuildSeriesDataParams = {
  item: ChartSeries
  data: ChartSeries[]
  seriesType: HighchartsSeriesType
}

type BuildSeriesDataFn = (
  params: Readonly<BuildSeriesDataParams>,
) => PointOptionsObject[]

type UseHighchartsSeriesDataParams = {
  data: ChartSeries[]
  seriesType: HighchartsSeriesType
  buildSeriesData?: BuildSeriesDataFn
}

type UseHighchartsSeriesDataResult = {
  series: HighchartsSeriesOption[]
  isEmpty: boolean
}

export function useHighchartsSeriesData({
  data,
  seriesType,
  buildSeriesData,
}: Readonly<UseHighchartsSeriesDataParams>): UseHighchartsSeriesDataResult {
  const series = useMemo(() => {
    const series = data
      .filter((item) => item.data.length > 0)
      .map((item) => {
        const pointOptions = buildSeriesData
          ? buildSeriesData({
              item,
              data,
              seriesType,
            })
          : (item.data as PointOptionsObject[])

        return {
          type: seriesType,
          name: item.name,
          data: pointOptions,
          color: item.color,
          tooltip: { valueSuffix: item.unit ? ` ${item.unit}` : undefined },
        }
      })

    return series
  }, [buildSeriesData, data, seriesType])

  const isEmpty = useMemo(
    () =>
      series.every(
        (seriesItem) => !seriesItem.data || seriesItem.data.length === 0,
      ),
    [series],
  )

  return {
    series,
    isEmpty,
  }
}
