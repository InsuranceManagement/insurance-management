import { useState } from "react"

import { type QueryKey } from "@tanstack/react-query"

import { type ApiRouteType } from "@/shared/constants/routes"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"

type UseCreateEntityOptions = {
  title: string
  createRoute: ApiRouteType
  listQueryKey: QueryKey
}

export function useCreateEntity<TCreatePayload>({
  title,
  createRoute,
  listQueryKey,
}: Readonly<UseCreateEntityOptions>) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const createMutation = useApiMutation<unknown, TCreatePayload>({
    route: createRoute,
    queryKeyToSync: listQueryKey,
    meta: {
      errorMessage: `Erro ao criar registros em ${title}.`,
    },
  })

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateModalOpenChange = (open: boolean) => {
    setIsCreateModalOpen(open)
  }

  const handleCreate = (payload: TCreatePayload) => {
    createMutation.mutate(
      {
        body: payload,
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false)
        },
      },
    )
  }

  return {
    handleCreate,
    handleOpenCreateModal,
    handleCreateModalOpenChange,
    isCreateModalOpen,
    isPending: createMutation.isPending,
  }
}
