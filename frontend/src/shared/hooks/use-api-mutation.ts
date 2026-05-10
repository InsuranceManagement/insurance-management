import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query"
import { type AxiosError } from "axios"

import { type ApiRouteType } from "@/shared/constants/routes"
import { apiClient, type ApiQueryParams } from "@/shared/lib/api-client"

export type MutationVariables<TBody = unknown> = {
  body?: TBody
  routeParams?: unknown[]
  queryParams?: ApiQueryParams
}

type UseApiMutationOptions<TResponse, TBody> = {
  route: ApiRouteType
  queryKeyToSync?: QueryKey
} & Omit<
  UseMutationOptions<TResponse, AxiosError, MutationVariables<TBody>>,
  "mutationFn"
>

export function useApiMutation<TResponse, TBody = unknown>({
  route,
  queryKeyToSync,
  onSuccess,
  ...mutationOptions
}: Readonly<UseApiMutationOptions<TResponse, TBody>>) {
  const queryClient = useQueryClient()

  return useMutation({
    ...mutationOptions,
    onSuccess: async (data, variables, onMutateResult, context) => {
      if (queryKeyToSync)
        await queryClient.invalidateQueries({ queryKey: queryKeyToSync })

      await onSuccess?.(data, variables, onMutateResult, context)
    },
    mutationFn: (variables) =>
      apiClient<TResponse, TBody>({
        route,
        routeParams: variables.routeParams,
        queryParams: variables.queryParams,
        body: variables.body,
      }),
  })
}
