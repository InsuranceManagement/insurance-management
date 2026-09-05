"use client"

import { useState } from "react"

import { type Client } from "@/features/ClientCrud/models/client"
import { DeleteModal } from "@/shared/components/DeleteModal/delete-modal"
import { Modal } from "@/shared/components/ui/modal"
import { formatDate } from "@/shared/lib/date-format"
import { type VisitDialogState } from "../hooks/use-visits-calendar"
import { type VisitUpsertPayload } from "../models/visit"
import { VisitForm } from "./visit-form"

type VisitDialogProps = {
  state: VisitDialogState
  clients: Client[]
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  onClose: () => void
  onCreate: (payload: VisitUpsertPayload) => void
  onUpdate: (id: string, payload: VisitUpsertPayload) => void
  onDelete: (id: string) => void
}

export function VisitDialog({
  state,
  clients,
  isCreating,
  isUpdating,
  isDeleting,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: Readonly<VisitDialogProps>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const isEditing = state?.mode === "edit"
  const visit = isEditing ? state.visit : undefined
  const isSubmitting = isCreating || isUpdating || isDeleting

  const handleClose = () => {
    setIsDeleteOpen(false)
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose()
  }

  const handleSubmit = (payload: VisitUpsertPayload) => {
    if (visit) {
      onUpdate(visit.id, payload)
      return
    }

    onCreate(payload)
  }

  const handleDelete = () => {
    if (visit) {
      setIsDeleteOpen(false)
      onDelete(visit.id)
    }
  }

  return (
    <>
      <Modal open={!!state} onOpenChange={handleOpenChange} title={visit ? "Editar visita" : "Nova visita"}>
        {state ? (
          <VisitForm
            clients={clients}
            initialValues={{ name: visit?.name ?? "", description: visit?.description ?? "", clientId: visit?.clientId ?? "", date: visit ? formatDate(visit.date, "YYYY-MM-DDTHH:mm", "") : state.mode === "create" ? state.date : "" }}
            isSubmitting={isSubmitting}
            submitLabel={visit ? "Salvar alterações" : "Criar visita"}
            onCancel={handleClose}
            onSubmit={handleSubmit}
            onDelete={visit ? () => setIsDeleteOpen(true) : undefined}
          />
        ) : null}
      </Modal>
      <DeleteModal open={isDeleteOpen} onOpenChange={setIsDeleteOpen} itemName={visit?.name ?? ""} title="Excluir visita" confirmLabel="Excluir" cancelLabel="Cancelar" isConfirming={isDeleting} onConfirm={handleDelete} />
    </>
  )
}
