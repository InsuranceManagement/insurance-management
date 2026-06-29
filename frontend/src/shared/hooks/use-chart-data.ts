import { useApiQuery } from "@/shared/hooks/use-api-query"
import { type ChartPoint } from "@/shared/models/charts/chart-point"

type UseChartDataParams = {
  dataUrl?: string
}

type UseChartDataResult<T> = {
  data?: T
  isLoading: boolean
  isError: boolean
}

export function useChartData<T = ChartPoint[]>({
  dataUrl,
}: Readonly<UseChartDataParams>): UseChartDataResult<T> {
  const query = useApiQuery<T>({
    route: {
      method: "GET",
      path: dataUrl ?? "",
    },
    queryKey: ["chart-data", dataUrl],
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
