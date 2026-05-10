"use client"

import { Modal } from "@/shared/components/ui/modal"
import { Button } from "@/shared/components/ui/button"
import { Typography } from "@/shared/components/ui/typography"

type DeleteModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  itemName: string
  title?: string
  confirmLabel?: string
  cancelLabel?: string
  isConfirming?: boolean
}

function DeleteModal({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  title = "Confirmar exclusao",
  confirmLabel = "Sim",
  cancelLabel = "Nao",
  isConfirming = false,
}: Readonly<DeleteModalProps>) {
  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isConfirming}
          >
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isConfirming}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <Typography>
        Voce tem certeza que quer deletar o item {itemName}?
      </Typography>
    </Modal>
  )
}

export { DeleteModal }
