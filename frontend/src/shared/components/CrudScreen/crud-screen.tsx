"use client"

import { useState } from "react"

import { Box } from "@/shared/components/ui/box"
import { type ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/shared/components/DataTable/data-table"
import { useApiMutation } from "@/shared/hooks/use-api-mutation"
import { useApiQuery } from "@/shared/hooks/use-api-query"
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

  const listPathKey =
    typeof sourceRoutes.list.path === "function"
      ? sourceRoutes.list.path.toString()
      : sourceRoutes.list.path

  const listQueryKey = ["crud-screen", sourceRoutes.list.method, listPathKey]

  const listQuery = useApiQuery<TData[]>({
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

  const editMutation = useApiMutation<unknown, TData>({
    route: sourceRoutes.edit,
    queryKeyToSync: listQueryKey,
    meta: {
      errorMessage: `Erro ao editar registros em ${title}.`,
    },
  })

  const rows = listQuery.data ?? []

  const handleDeleteSelected = (selectedRows: TData[]) => {
    const selectedIds = new Set(selectedRows.map((row) => row.id))

    selectedRows.forEach((selectedRow) => {
      deleteMutation.mutate({
        routeParams: [selectedRow.id],
      })
    })

    if (editingRow && selectedIds.has(editingRow.id)) {
      setEditingRow(null)
    }
  }

  const handleEditSelected = (selectedRow: TData) => {
    setEditingRow(selectedRow)

    editMutation.mutate({
      routeParams: [selectedRow.id],
      body: selectedRow,
    })
  }

  return (
    <main className="flex flex-1 flex-col p-6 md:p-8">
      <Box className="flex-col gap-4">
        <Typography variant="h3">{title}</Typography>

        <DataTable
          caption={caption ?? "Tabela de registros"}
          columns={columns}
          data={rows}
          emptyMessage={
            listQuery.isLoading
              ? "Carregando dados..."
              : "Sem dados para exibir."
          }
          onDeleteSelected={handleDeleteSelected}
          onEditSelected={handleEditSelected}
        />
      </Box>
    </main>
  )
}
