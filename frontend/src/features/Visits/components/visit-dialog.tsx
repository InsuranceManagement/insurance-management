"use client"

import { useState } from "react"

import { type Client } from "@/features/ClientCrud/models/client"
import { DeleteModal } from "@/shared/components/DeleteModal/delete-modal"
import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Modal } from "@/shared/components/ui/modal"
import { Typography } from "@/shared/components/ui/typography"
import { formatDate } from "@/shared/lib/date-format"
import { type VisitDialogState } from "../hooks/use-visits-calendar"
import { type Visit, type VisitUpsertPayload } from "../models/visit"
import { VisitForm } from "./visit-form"

type VisitDialogProps = {
  state: VisitDialogState
  clients: Client[]
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  onClose: () => void
  onEdit: (visit: Visit) => void
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
  onEdit,
  onCreate,
  onUpdate,
  onDelete,
}: Readonly<VisitDialogProps>) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const isEditing = state?.mode === "edit"
  const visit =
    state?.mode === "view" || state?.mode === "edit" ? state.visit : undefined
  const client = visit
    ? clients.find((item) => item.id === visit.clientId)
    : undefined
  const isCreatingVisit = state?.mode === "create"
  const isFormOpen = isCreatingVisit || isEditing
  const isViewOpen = !!visit && !isEditing
  const isSubmitting = isCreating || isUpdating || isDeleting

  const handleClose = () => {
    setIsDeleteOpen(false)
    onClose()
  }

  const handleFormOpenChange = (open: boolean) => {
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
      <Modal
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        title={visit ? "Editar visita" : "Nova visita"}
      >
        {isFormOpen ? (
          <VisitForm
            clients={clients}
            isEditing={isEditing}
            initialValues={{
              name: visit?.name ?? "",
              description: visit?.description ?? "",
              clientId: visit?.clientId ?? "",
              date: visit
                ? formatDate(visit.date, "YYYY-MM-DDTHH:mm", "")
                : state?.mode === "create"
                  ? state.date
                  : "",
            }}
            isSubmitting={isSubmitting}
            submitLabel={visit ? "Salvar alterações" : "Criar visita"}
            onCancel={() => handleFormOpenChange(false)}
            onSubmit={handleSubmit}
            onDelete={visit ? () => setIsDeleteOpen(true) : undefined}
          />
        ) : null}
      </Modal>

      <Modal
        open={isViewOpen}
        onOpenChange={(open) => !open && handleClose()}
        title="Detalhes da visita"
        footer={
          <Box className="w-full flex-wrap justify-between gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
              disabled={isSubmitting}
            >
              Excluir
            </Button>
            <Box className="gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Fechar
              </Button>
              <Button
                type="button"
                onClick={() => visit && onEdit(visit)}
              >
                Editar
              </Button>
            </Box>
          </Box>
        }
      >
        {visit ? (
          <Box className="w-full min-w-0 flex-col gap-5">
            <Box className="min-w-0 flex-col gap-1">
              <Typography
                variant="h4"
                className="min-w-0 [overflow-wrap:anywhere]"
              >
                {visit.name}
              </Typography>
              <Typography variant="muted">
                {formatDate(visit.date, "DD/MM/YYYY [às] HH:mm")}
              </Typography>
            </Box>

            <Box className="min-w-0 grid grid-cols-1 gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-2">
              <Box className="min-w-0 flex-col gap-1 bg-card p-3">
                <Typography
                  variant="small"
                  className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  Cliente
                </Typography>
                <Typography
                  variant="p"
                  className="min-w-0 [overflow-wrap:anywhere]"
                >
                  {client?.name ?? "Cliente não encontrado"}
                </Typography>
              </Box>
              <Box className="min-w-0 flex-col gap-1 bg-card p-3">
                <Typography
                  variant="small"
                  className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  Data e hora
                </Typography>
                <Typography
                  variant="p"
                  className="min-w-0 [overflow-wrap:anywhere]"
                >
                  {formatDate(visit.date, "DD/MM/YYYY HH:mm")}
                </Typography>
              </Box>
            </Box>

            <Box className="min-w-0 flex-col gap-2">
              <Typography
                variant="small"
                className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
              >
                Descrição
              </Typography>
              <Typography
                variant="p"
                className="min-w-0 max-h-72 overflow-y-auto rounded-md border bg-muted/30 p-3 whitespace-pre-wrap [overflow-wrap:anywhere]"
              >
                {visit.description}
              </Typography>
            </Box>
          </Box>
        ) : null}
      </Modal>

      <DeleteModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        itemName={visit?.name ?? ""}
        title="Excluir visita"
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
