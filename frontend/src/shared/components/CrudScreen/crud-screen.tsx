"use client"

import { useMemo, useState } from "react"

import { Box } from "@/shared/components/ui/box"
import { type ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/shared/components/DataTable/data-table"
import { DeleteModal } from "@/shared/components/DeleteModal/delete-modal"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"
import { useApiQuery } from "@/shared/hooks/use-api-query"
import { Button } from "@/shared/components/ui/button"
import { Typography } from "@/shared/components/ui/typography"
import { ApiRouteType } from "@/shared/constants/routes"
import { PlusIcon } from "lucide-react"

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
  const [editingRow, setEditingRow] = useState<TData | null>(null)
  const [rowsPendingDelete, setRowsPendingDelete] = useState<TData[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const listPathKey =
    typeof sourceRoutes.list.path === "function"
      ? sourceRoutes.list.path.toString()
      : sourceRoutes.list.path

  const listQueryKey = ["crud-screen", sourceRoutes.list.method, listPathKey]

  const { data: rows, isLoading: areRowsLoading } = useApiQuery<TData[]>({
    route: sourceRoutes.list,
    queryKey: listQueryKey,
    meta: {
      errorMessage: `Erro ao carregar dados de ${title}.`,
    },
  })

  const deleteMutation = useApiMutation<unknown>({
    route: sourceRoutes.delete,
    queryKeyToSync: listQueryKey,
    meta: {
      errorMessage: `Erro ao deletar registros em ${title}.`,
    },
  })

  const createMutation = useApiMutation<unknown>({
    route: sourceRoutes.create,
    queryKeyToSync: listQueryKey,
    meta: {
      errorMessage: `Erro ao criar registros em ${title}.`,
    },
  })

  const editMutation = useApiMutation<unknown, TData>({
    route: sourceRoutes.edit,
    queryKeyToSync: listQueryKey,
    meta: {
      errorMessage: `Erro ao editar registros em ${title}.`,
    },
  })

  const handleDeleteSelected = (selectedRows: TData[]) => {
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
      setEditingRow(null)
    }

    setIsDeleteModalOpen(false)
    setRowsPendingDelete([])
  }

  const deleteItemName = useMemo(() => {
    const firstPendingDelete = rowsPendingDelete[0]
    if (!firstPendingDelete) return ""

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

  const handleEditSelected = (selectedRow: TData) => {
    setEditingRow(selectedRow)

    editMutation.mutate({
      routeParams: [selectedRow.id],
      body: selectedRow,
    })
  }

  const handleCreate = () => {
    createMutation.mutate({})
  }

  return (
    <main className="flex flex-1 flex-col p-6 md:p-8">
      <Box className="flex-col gap-15">
        <Box className="items-center justify-between gap-4">
          <Typography variant="h3">{title}</Typography>

          <Button
            type="button"
            className="gap-1.5 px-3"
            onClick={handleCreate}
            disabled={createMutation.isPending}
          >
            <PlusIcon className="size-4" />
            Novo Registro
          </Button>
        </Box>

        <DataTable
          caption={caption ?? "Tabela de registros"}
          columns={columns}
          data={rows ?? []}
          emptyMessage={
            areRowsLoading ? "Carregando dados..." : "Sem dados para exibir."
          }
          onDeleteSelected={handleDeleteSelected}
          onEditSelected={handleEditSelected}
        />

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
