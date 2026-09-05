import { routes } from "@/shared/constants/routes"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"
import { type Visit, type VisitUpsertPayload } from "../models/visit"
import { visitsQueryKey } from "./use-visits"

export function useVisitMutations() {
  const createVisit = useApiMutation<Visit, VisitUpsertPayload>({
    route: routes.visits.create,
    queryKeyToSync: visitsQueryKey,
    meta: { successMessage: "Visita criada com sucesso." },
  })

  const updateVisit = useApiMutation<Visit, VisitUpsertPayload>({
    route: routes.visits.updateById,
    queryKeyToSync: visitsQueryKey,
    meta: { successMessage: "Visita atualizada com sucesso." },
  })

  const deleteVisit = useApiMutation<void>({
    route: routes.visits.deleteById,
    queryKeyToSync: visitsQueryKey,
    meta: { successMessage: "Visita excluída com sucesso." },
  })

  return { createVisit, updateVisit, deleteVisit }
}
