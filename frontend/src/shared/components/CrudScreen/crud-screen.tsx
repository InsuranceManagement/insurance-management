"use client"

import { useMemo, useState } from "react"

import { Box } from "@/shared/components/ui/box"
import { type ColumnDef, type RowSelectionState } from "@tanstack/react-table"

import { AddButton } from "@/shared/components/CrudScreen/components/add-button"
import { ActionsPopover } from "@/shared/components/CrudScreen/components/actions-popover"
import { DataTable } from "@/shared/components/DataTable/data-table"
import { DeleteModal } from "@/shared/components/DeleteModal/delete-modal"
import { useCreateEntity } from "@/shared/components/CrudScreen/hooks/use-create-entity"
import { useDeleteEntity } from "@/shared/components/CrudScreen/hooks/use-delete-entity"
import { useEditEntity } from "@/shared/components/CrudScreen/hooks/use-edit-entity"
import { useListEntity } from "@/shared/components/CrudScreen/hooks/use-list-entity"
import { Typography } from "@/shared/components/ui/typography"
import { ApiRouteType } from "@/shared/constants/routes"

type CrudSourceRoutes = {
  list: ApiRouteType
  create: ApiRouteType
  edit: ApiRouteType
  delete: ApiRouteType
}

type CrudRecord = {
  id: string
  name: string
  [key: string]: unknown
}

type CrudScreenProps<TData extends CrudRecord> = {
  title: string
  sourceRoutes: CrudSourceRoutes
  columns: ColumnDef<TData>[]
  caption?: string
}

export function CrudScreen<TData extends CrudRecord>({
  title,
  sourceRoutes,
  columns,
  caption,
}: Readonly<CrudScreenProps<TData>>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { rows, areRowsLoading, listQueryKey } = useListEntity<TData>({
    title,
    listRoute: sourceRoutes.list,
  })

  const selectedRows = useMemo(() => {
    const currentRows = rows

    return Object.entries(rowSelection).reduce<TData[]>(
      (acc, [rowIndex, selected]) => {
        if (!selected) return acc
        const selectedRow = currentRows[Number(rowIndex)]

        if (selectedRow) acc.push(selectedRow)

        return acc
      },
      [],
    )
  }, [rowSelection, rows])

  const selectedCount = selectedRows.length
  const isSingleSelection = selectedCount === 1

  const handleClearSelection = () => {
    setRowSelection({})
  }

  const { editingRow, handleEditSelected, clearEditingRow } =
    useEditEntity<TData>({
      title,
      editRoute: sourceRoutes.edit,
      listQueryKey,
      selectedRows,
    })

  const {
    isDeleteModalOpen,
    deleteItemName,
    deleteMutation,
    handleDeleteSelected,
    handleConfirmDelete,
    handleDeleteModalOpenChange,
  } = useDeleteEntity<TData>({
    title,
    deleteRoute: sourceRoutes.delete,
    listQueryKey,
    selectedRows,
    editingRow,
    clearEditingRow,
    clearSelection: handleClearSelection,
  })

  const { handleCreate, isPending: isCreatePending } = useCreateEntity({
    title,
    createRoute: sourceRoutes.create,
    listQueryKey,
  })

  return (
    <main className="flex flex-1 flex-col p-6 md:p-8">
      <Box className="flex-col gap-15">
        <Box className="items-center justify-between gap-4">
          <Typography variant="h3">{title}</Typography>

          <AddButton onClick={handleCreate} disabled={isCreatePending} />
        </Box>

        <Box className="relative w-full flex-col">
          <ActionsPopover
            selectedCount={selectedCount}
            isSingleSelection={isSingleSelection}
            onClearSelection={handleClearSelection}
            onDeleteSelected={handleDeleteSelected}
            onEditSelected={handleEditSelected}
          />

          <DataTable
            caption={caption ?? "Tabela de registros"}
            columns={columns}
            data={rows}
            className="w-full"
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            emptyMessage={
              areRowsLoading ? "Carregando dados..." : "Sem dados para exibir."
            }
          />
        </Box>

        <DeleteModal
          open={isDeleteModalOpen}
          onOpenChange={handleDeleteModalOpenChange}
          onConfirm={handleConfirmDelete}
          itemName={deleteItemName}
          isConfirming={deleteMutation.isPending}
        />
      </Box>
    </main>
  )
}
