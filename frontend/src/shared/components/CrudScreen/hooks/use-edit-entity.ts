import { useState } from "react"

import { type QueryKey } from "@tanstack/react-query"

import { type ApiRouteType } from "@/shared/constants/routes"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"

type EditableEntityRecord = {
  id: string
}

type UseEditEntityOptions<TData extends EditableEntityRecord> = {
  title: string
  editRoute: ApiRouteType
  listQueryKey: QueryKey
  selectedRows: TData[]
}

export function useEditEntity<
  TData extends EditableEntityRecord,
  TEditPayload,
>({
  title,
  editRoute,
  listQueryKey,
  selectedRows,
}: Readonly<UseEditEntityOptions<TData>>) {
  const [editingRow, setEditingRow] = useState<TData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const editMutation = useApiMutation<unknown, TEditPayload>({
    route: editRoute,
    queryKeyToSync: listQueryKey,
    meta: {
      errorMessage: `Erro ao editar registros em ${title}.`,
    },
  })

  const handleEditSelected = () => {
    if (selectedRows.length !== 1) {
      return
    }

    const selectedRow = selectedRows[0]

    if (!selectedRow) {
      return
    }

    setEditingRow(selectedRow)
    setIsEditModalOpen(true)
  }

  const handleEditModalOpenChange = (open: boolean) => {
    setIsEditModalOpen(open)

    if (!open) {
      setEditingRow(null)
    }
  }

  const handleEdit = (payload: TEditPayload) => {
    if (!editingRow) {
      return
    }

    editMutation.mutate(
      {
        routeParams: [editingRow.id],
        body: payload,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false)
          setEditingRow(null)
        },
      },
    )
  }

  const clearEditingRow = () => {
    setIsEditModalOpen(false)
    setEditingRow(null)
  }

  return {
    editingRow,
    isEditModalOpen,
    handleEditSelected,
    handleEditModalOpenChange,
    handleEdit,
    clearEditingRow,
    isPending: editMutation.isPending,
  }
}
