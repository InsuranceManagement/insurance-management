import { PlusIcon } from "lucide-react"

import { Button } from "@/shared/components/ui/button"

type AddButtonProps = {
  onClick: () => void
  disabled?: boolean
  label?: string
}

export function AddButton({
  onClick,
  disabled = false,
  label = "Novo Registro",
}: Readonly<AddButtonProps>) {
  return (
    <Button
      type="button"
      className="gap-1.5 px-3"
      onClick={onClick}
      disabled={disabled}
    >
      <PlusIcon className="size-4" />
      {label}
    </Button>
  )
}
