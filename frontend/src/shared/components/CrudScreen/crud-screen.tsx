"use client"

import { useMemo, useState, type ComponentType, type ReactNode } from "react"

import { Box } from "@/shared/components/ui/box"
import { type ColumnDef, type RowSelectionState } from "@tanstack/react-table"

import { ActionsPopover } from "@/shared/components/CrudScreen/components/actions-popover"
import { AddButton } from "@/shared/components/CrudScreen/components/add-button"
import {
  EntityViewModal,
  type EntityViewField,
} from "@/shared/components/CrudScreen/components/EntityViewModal"
import { useCreateEntity } from "@/shared/components/CrudScreen/hooks/use-create-entity"
import { useDeleteEntity } from "@/shared/components/CrudScreen/hooks/use-delete-entity"
import { useEditEntity } from "@/shared/components/CrudScreen/hooks/use-edit-entity"
import { useEntityView } from "@/shared/components/CrudScreen/hooks/use-entity-view"
import { useListEntity } from "@/shared/components/CrudScreen/hooks/use-list-entity"
import { DataTable } from "@/shared/components/DataTable/data-table"
import { DeleteModal } from "@/shared/components/DeleteModal/delete-modal"
import { Modal } from "@/shared/components/ui/modal"
import { Typography } from "@/shared/components/ui/typography"
import { ApiRouteType } from "@/shared/constants/routes"
import { EntityWithName } from "@/shared/models/entity"

type CrudSourceRoutes = {
  list: ApiRouteType
  create: ApiRouteType
  edit: ApiRouteType
  delete: ApiRouteType
}

type CrudFormProps<TFormPayload> = {
  initialValues?: Partial<TFormPayload>
  onSubmit: (values: TFormPayload) => Promise<void> | void
  onCancel?: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

type CrudScreenProps<TData extends EntityWithName, TCreatePayload> = {
  title: string
  sourceRoutes: CrudSourceRoutes
  columns: ColumnDef<TData>[]
  createForm: ComponentType<CrudFormProps<TCreatePayload>>
  createFormTitle?: string
  editFormTitle?: string
  mapEditEntityToFormValues?: (entity: TData) => Partial<TCreatePayload>
  viewFields?: EntityViewField<TData>[]
  viewModalTitle?: string
  viewModalSubtitle?: ReactNode | ((entity: TData) => ReactNode)
  viewModalCloseLabel?: string
  viewModalEmptyValue?: ReactNode
  caption?: string
}

export function CrudScreen<TData extends EntityWithName, TCreatePayload>({
  title,
  sourceRoutes,
  columns,
  createForm: CreateFormComponent,
  createFormTitle = "Novo registro",
  editFormTitle = "Editar registro",
  mapEditEntityToFormValues,
  viewFields,
  viewModalTitle = "Detalhes",
  viewModalSubtitle,
  viewModalCloseLabel,
  viewModalEmptyValue,
  caption,
}: Readonly<CrudScreenProps<TData, TCreatePayload>>) {
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
  const hasEntityView = !!viewFields?.length

  const handleClearSelection = () => {
    setRowSelection({})
  }

  const {
    isEntityViewOpen,
    entityInView,
    handleViewEntity,
    handleEntityViewOpenChange,
  } = useEntityView<TData>({
    selectedRows,
    isSingleSelection,
    isEnabled: hasEntityView,
  })

  const {
    editingRow,
    isEditModalOpen,
    handleEditSelected,
    handleEditModalOpenChange,
    handleEdit,
    clearEditingRow,
    isPending: isEditPending,
  } = useEditEntity<TData, TCreatePayload>({
    title,
    editRoute: sourceRoutes.edit,
    listQueryKey,
    selectedRows,
  })

  const editFormInitialValues = editingRow
    ? (mapEditEntityToFormValues?.(editingRow) ??
      (editingRow as unknown as Partial<TCreatePayload>))
    : undefined

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

  const {
    handleCreate,
    handleOpenCreateModal,
    handleCreateModalOpenChange,
    isCreateModalOpen,
    isPending: isCreatePending,
  } = useCreateEntity<TCreatePayload>({
    title,
    createRoute: sourceRoutes.create,
    listQueryKey,
  })

  return (
    <main className="flex flex-1 flex-col p-6 md:p-8">
      <Box className="flex-col gap-5">
        <Box className="items-center justify-between gap-4">
          <Typography variant="h3">{title}</Typography>

          <AddButton
            onClick={handleOpenCreateModal}
            disabled={isCreatePending}
          />
        </Box>

        <Modal
          open={isCreateModalOpen}
          onOpenChange={handleCreateModalOpenChange}
          title={createFormTitle}
        >
          <CreateFormComponent
            onSubmit={handleCreate}
            onCancel={() => handleCreateModalOpenChange(false)}
            submitLabel="Criar"
            isSubmitting={isCreatePending}
          />
        </Modal>

        <Modal
          open={isEditModalOpen}
          onOpenChange={handleEditModalOpenChange}
          title={editFormTitle}
        >
          <CreateFormComponent
            initialValues={editFormInitialValues}
            onSubmit={handleEdit}
            onCancel={() => handleEditModalOpenChange(false)}
            submitLabel="Salvar alteracoes"
            isSubmitting={isEditPending}
          />
        </Modal>

        {hasEntityView ? (
          <EntityViewModal<TData>
            title={viewModalTitle}
            subtitle={viewModalSubtitle}
            closeLabel={viewModalCloseLabel}
            emptyValue={viewModalEmptyValue}
            open={isEntityViewOpen}
            onOpenChange={handleEntityViewOpenChange}
            entity={entityInView}
            fields={viewFields}
          />
        ) : null}

        <Box className="relative w-full flex-col">
          <ActionsPopover
            selectedCount={selectedCount}
            isSingleSelection={isSingleSelection}
            canViewEntity={hasEntityView}
            onClearSelection={handleClearSelection}
            onDeleteSelected={handleDeleteSelected}
            onEditSelected={handleEditSelected}
            onViewEntity={handleViewEntity}
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
