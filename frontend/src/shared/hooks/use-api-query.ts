import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query"
import { type AxiosError } from "axios"

import { type ApiRouteType } from "@/shared/constants/routes"
import { apiClient, type ApiQueryParams } from "@/shared/lib/api-client"

type UseApiQueryOptions<TResponse> = {
  queryKey?: QueryKey
  route: ApiRouteType
  routeParams?: unknown[]
  queryParams?: ApiQueryParams
} & Omit<
  UseQueryOptions<TResponse, AxiosError, TResponse, QueryKey>,
  "queryKey" | "queryFn"
>

export function useApiQuery<TResponse>({
  queryKey,
  route,
  routeParams,
  queryParams,
  ...queryOptions
}: Readonly<UseApiQueryOptions<TResponse>>) {
  const routePathForKey =
    typeof route.path === "function" ? route.path.toString() : route.path

  const autoQueryKey: QueryKey = [
    "api",
    route.method,
    routePathForKey,
    routeParams,
    queryParams,
  ]

  return useQuery({
    ...queryOptions,
    queryKey: queryKey ?? autoQueryKey,
    queryFn: ({ signal }) =>
      apiClient<TResponse>({
        route,
        routeParams,
        queryParams,
        signal,
      }),
  })
}
