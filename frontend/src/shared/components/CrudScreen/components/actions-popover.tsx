import { EyeIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Typography } from "@/shared/components/ui/typography"
import { cn } from "@/shared/lib/utils"

type ActionsPopoverProps = {
  selectedCount: number
  isSingleSelection: boolean
  canViewEntity?: boolean
  onClearSelection: () => void
  onDeleteSelected: () => void
  onEditSelected: () => void
  onViewEntity: () => void
}

export function ActionsPopover({
  selectedCount,
  isSingleSelection,
  canViewEntity = true,
  onClearSelection,
  onDeleteSelected,
  onEditSelected,
  onViewEntity,
}: Readonly<ActionsPopoverProps>) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <Box className="absolute -top-12 right-3 z-10 items-center gap-2 rounded-lg border bg-card p-2 shadow-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Limpar selecao"
        onClick={onClearSelection}
      >
        <XIcon />
      </Button>

      <Typography variant="small" className="text-muted-foreground">
        {selectedCount} itens selecionados
      </Typography>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Deletar selecionados"
        onClick={onDeleteSelected}
      >
        <Trash2Icon className="text-destructive" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Editar selecionado"
        aria-pressed={isSingleSelection}
        disabled={!isSingleSelection}
        className={cn(isSingleSelection ? "bg-muted text-foreground" : "")}
        onClick={onEditSelected}
      >
        <PencilIcon
          className={cn(
            isSingleSelection ? "text-foreground" : "text-muted-foreground",
          )}
        />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Visualizar selecionado"
        aria-pressed={canViewEntity && isSingleSelection}
        disabled={!canViewEntity || !isSingleSelection}
        className={cn(
          canViewEntity && isSingleSelection ? "bg-muted text-foreground" : "",
        )}
        onClick={onViewEntity}
      >
        <EyeIcon
          className={cn(
            canViewEntity && isSingleSelection
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        />
      </Button>
    </Box>
  )
}
