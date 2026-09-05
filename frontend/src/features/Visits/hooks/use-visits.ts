import { useQueries } from "@tanstack/react-query"

import { routes } from "@/shared/constants/routes"
import { apiClient } from "@/shared/lib/api-client"
import { type Visit, type VisitDateRange } from "../models/visit"

export const visitsQueryKey = ["visits"] as const

export function useVisits(dateRanges: VisitDateRange[]) {
  const queries = useQueries({
    queries: dateRanges.map((dateRange) => ({
      queryKey: [...visitsQueryKey, dateRange],
      staleTime: Infinity,
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        apiClient<Visit[]>({
          route: routes.visits.list,
          queryParams: dateRange,
          signal,
        }),
      meta: { errorMessage: "Erro ao carregar visitas." },
    })),
  })

  const visitsById = new Map<string, Visit>()

  for (const query of queries) {
    for (const visit of query.data ?? []) {
      visitsById.set(visit.id, visit)
    }
  }

  return {
    data: [...visitsById.values()],
    isLoading: queries.some((query) => query.isLoading),
  }
}
