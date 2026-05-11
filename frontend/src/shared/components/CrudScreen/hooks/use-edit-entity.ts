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

export function useEditEntity<TData extends EditableEntityRecord>({
  title,
  editRoute,
  listQueryKey,
  selectedRows,
}: Readonly<UseEditEntityOptions<TData>>) {
  const [editingRow, setEditingRow] = useState<TData | null>(null)

  const editMutation = useApiMutation<unknown, TData>({
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

    editMutation.mutate({
      routeParams: [selectedRow.id],
      body: selectedRow,
    })
  }

  const clearEditingRow = () => {
    setEditingRow(null)
  }

  return {
    editingRow,
    editMutation,
    handleEditSelected,
    clearEditingRow,
  }
}
