import { useState } from "react"

import { type QueryKey } from "@tanstack/react-query"

import { type ApiRouteType } from "@/shared/constants/routes"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"

type UseCreateEntityOptions = {
  title: string
  createRoute?: ApiRouteType
  listQueryKey: QueryKey
}

export function useCreateEntity<TCreatePayload>({
  title,
  createRoute,
  listQueryKey,
}: Readonly<UseCreateEntityOptions>) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const createMutation = useApiMutation<unknown, TCreatePayload>({
    route: createRoute ?? { method: "POST", path: "" },
    queryKeyToSync: listQueryKey,
    meta: {
      errorMessage: `Erro ao criar registros em ${title}.`,
      successMessage: "Cadastro realizado com sucesso.",
    },
  })

  const handleOpenCreateModal = () => {
    if (!createRoute) return
    setIsCreateModalOpen(true)
  }

  const handleCreateModalOpenChange = (open: boolean) => {
    setIsCreateModalOpen(open)
  }

  const handleCreate = (payload: TCreatePayload) => {
    if (!createRoute) return

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
