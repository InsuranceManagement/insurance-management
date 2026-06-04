import { useMemo } from "react"

import { useApiQuery } from "@/shared/hooks/use-api-query"
import { type ChartPoint } from "@/shared/models/charts/chart-point"

type UseChartDataParams = {
  dataUrl?: string
}

type UseChartDataResult = {
  data: ChartPoint[]
  isLoading: boolean
  isError: boolean
}

export function useChartData({
  dataUrl,
}: Readonly<UseChartDataParams>): UseChartDataResult {
  const query = useApiQuery<ChartPoint[]>({
    route: {
      method: "GET",
      path: dataUrl ?? "",
    },
    queryKey: ["chart-data", dataUrl],
    enabled: !!dataUrl,
  })

  const data = useMemo<ChartPoint[]>(() => {
    return query.data ?? []
  }, [query.data])

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
