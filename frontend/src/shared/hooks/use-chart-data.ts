import { useApiQuery } from "@/shared/hooks/use-api-query"
import { type ChartPoint } from "@/shared/models/charts/chart-point"

type UseChartDataParams = {
  dataUrl?: string
  queryParams?: Record<string, string>
}

type UseChartDataResult<T> = {
  data?: T
  isLoading: boolean
  isError: boolean
}

export function useChartData<T = ChartPoint[]>({
  dataUrl,
  queryParams,
}: Readonly<UseChartDataParams>): UseChartDataResult<T> {
  const query = useApiQuery<T>({
    route: {
      method: "GET",
      path: dataUrl ?? "",
    },
    queryKey: ["chart-data", dataUrl, queryParams],
    queryParams,
    enabled: !!dataUrl,
    staleTime: 0,
    refetchOnMount: "always",
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
