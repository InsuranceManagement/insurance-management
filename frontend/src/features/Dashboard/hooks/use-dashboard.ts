import { useMemo } from "react"

import { routes } from "@/shared/constants/routes"
import { useApiQuery } from "@/shared/hooks/use-api-query"
import { type ChartRendererConfig } from "@/shared/lib/chart-renderer"
import { type ChartSeriesType } from "@/shared/models/charts/chart-series"
import { Kpi } from "@/shared/models/charts/kpi"

type ChartApiResponse = {
  id: string
  name: string
  description: string
  apiRoute: string
  order: number
  unit?: string
  chartTypeId: ChartSeriesType
  createdAt: string
  updatedAt: string
}

export function useDashboard() {
  const chartConfigsQuery = useApiQuery<ChartApiResponse[]>({
    route: routes.charts.list,
    queryKey: ["dashboard", "chart-configs"],
    staleTime: 0,
    refetchOnMount: "always",
  })

  const { charts, kpis } = useMemo<{
    charts: ChartRendererConfig[]
    kpis: Kpi[]
  }>(() => {
    const configs = chartConfigsQuery.data ?? []

    const orderedConfigs = configs.toSorted((a, b) => {
      const aOrder = a.order ?? Number.MAX_SAFE_INTEGER
      const bOrder = b.order ?? Number.MAX_SAFE_INTEGER

      return aOrder - bOrder
    })

    const charts: ChartRendererConfig[] = orderedConfigs
      .filter((config) => config.chartTypeId !== "kpi")
      .map((config) => {
        const chartType = config.chartTypeId

        return {
          id: config.id,
          type: chartType,
          dataUrl: config.apiRoute,
          series: {
            name: config.name,
            type: chartType,
            order: config.order,
            data: [],
          },
          unit: config.unit,
          title: config.name,
          subtitle: config.description,
        } as ChartRendererConfig
      })

    const kpis: Kpi[] = orderedConfigs
      .filter((config) => config.chartTypeId === "kpi")
      .map((config) => ({
        id: config.id,
        type: "kpi",
        title: config.name,
        unit: config.unit,
        subtitle: config.description,
        valueUrl: config.apiRoute,
      }))

    return {
      charts,
      kpis,
    }
  }, [chartConfigsQuery.data])

  return {
    charts,
    kpis,
    isLoading: chartConfigsQuery.isLoading,
    isError: chartConfigsQuery.isError,
  }
}
