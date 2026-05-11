import { type QueryKey } from "@tanstack/react-query"

import { type ApiRouteType } from "@/shared/constants/routes"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"

type UseCreateEntityOptions = {
  title: string
  createRoute: ApiRouteType
  listQueryKey: QueryKey
}

export function useCreateEntity({
  title,
  createRoute,
  listQueryKey,
}: Readonly<UseCreateEntityOptions>) {
  const createMutation = useApiMutation<unknown>({
    route: createRoute,
    queryKeyToSync: listQueryKey,
    meta: {
      errorMessage: `Erro ao criar registros em ${title}.`,
    },
  })

  const handleCreate = () => {
    createMutation.mutate({})
  }

  return {
    createMutation,
    handleCreate,
  }
}