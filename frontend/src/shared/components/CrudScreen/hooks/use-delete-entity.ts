import { useMemo, useState } from "react"

import { type QueryKey } from "@tanstack/react-query"

import { type ApiRouteType } from "@/shared/constants/routes"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"

type DeletableEntityRecord = {
  id: string
  name: string
}

type UseDeleteEntityOptions<TData extends DeletableEntityRecord> = {
  title: string
  deleteRoute: ApiRouteType
  listQueryKey: QueryKey
  selectedRows: TData[]
  editingRow: TData | null
  clearEditingRow: () => void
  clearSelection: () => void
}

export function useDeleteEntity<TData extends DeletableEntityRecord>({
  title,
  deleteRoute,
  listQueryKey,
  selectedRows,
  editingRow,
  clearEditingRow,
  clearSelection,
}: Readonly<UseDeleteEntityOptions<TData>>) {
  const [rowsPendingDelete, setRowsPendingDelete] = useState<TData[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const deleteMutation = useApiMutation<unknown>({
    route: deleteRoute,
    queryKeyToSync: listQueryKey,
    meta: {
      errorMessage: `Erro ao deletar registros em ${title}.`,
    },
  })

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      return
    }

    setRowsPendingDelete(selectedRows)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    const selectedIds = new Set(rowsPendingDelete.map((row) => row.id))

    rowsPendingDelete.forEach((selectedRow) => {
      deleteMutation.mutate({
        routeParams: [selectedRow.id],
      })
    })

    if (editingRow && selectedIds.has(editingRow.id)) {
      clearEditingRow()
    }

    clearSelection()
    setIsDeleteModalOpen(false)
    setRowsPendingDelete([])
  }

  const deleteItemName = useMemo(() => {
    const firstPendingDelete = rowsPendingDelete[0]

    if (!firstPendingDelete) {
      return ""
    }

    const pendingDeleteLabel = firstPendingDelete.name ?? firstPendingDelete.id

    return rowsPendingDelete.length > 1
      ? `${pendingDeleteLabel} e mais ${rowsPendingDelete.length - 1}`
      : pendingDeleteLabel
  }, [rowsPendingDelete])

  const handleDeleteModalOpenChange = (open: boolean) => {
    setIsDeleteModalOpen(open)

    if (!open) {
      setRowsPendingDelete([])
    }
  }

  return {
    rowsPendingDelete,
    isDeleteModalOpen,
    deleteItemName,
    deleteMutation,
    handleDeleteSelected,
    handleConfirmDelete,
    handleDeleteModalOpenChange,
  }
}
