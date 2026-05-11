import { useMemo } from "react"

import { type QueryKey } from "@tanstack/react-query"

import { type ApiRouteType } from "@/shared/constants/routes"
import { useApiQuery } from "@/shared/hooks/use-api-query"

type UseListEntityOptions = {
  title: string
  listRoute: ApiRouteType
}

export function useListEntity<TData>({
  title,
  listRoute,
}: Readonly<UseListEntityOptions>) {
  const listPathKey = useMemo(
    () =>
      typeof listRoute.path === "function"
        ? listRoute.path.toString()
        : listRoute.path,
    [listRoute.path],
  )

  const listQueryKey = useMemo<QueryKey>(
    () => ["crud-screen", listRoute.method, listPathKey],
    [listRoute.method, listPathKey],
  )

  const { data, isLoading } = useApiQuery<TData[]>({
    route: listRoute,
    queryKey: listQueryKey,
    meta: {
      errorMessage: `Erro ao carregar dados de ${title}.`,
    },
  })

  return {
    rows: data ?? [],
    areRowsLoading: isLoading,
    listQueryKey,
  }
}
