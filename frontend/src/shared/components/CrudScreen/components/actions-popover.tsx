import { EyeIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Typography } from "@/shared/components/ui/typography"
import { cn } from "@/shared/lib/utils"

type ActionsPopoverProps = {
  selectedCount: number
  isSingleSelection: boolean
  canViewEntity?: boolean
  canDelete?: boolean
  showEditAndView?: boolean
  onClearSelection: () => void
  onDeleteSelected: () => void
  onEditSelected: () => void
  onViewEntity: () => void
}

export function ActionsPopover({
  selectedCount,
  isSingleSelection,
  canViewEntity = true,
  canDelete = true,
  showEditAndView = true,
  onClearSelection,
  onDeleteSelected,
  onEditSelected,
  onViewEntity,
}: Readonly<ActionsPopoverProps>) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <Box className="z-10 mb-3 w-full flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-2 shadow-sm md:absolute md:-top-12 md:right-3 md:mb-0 md:w-auto md:justify-start">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="size-10 xl:size-6"
        aria-label="Limpar selecao"
        onClick={onClearSelection}
      >
        <XIcon />
      </Button>

      <Typography
        variant="small"
        className="min-w-0 flex-1 text-muted-foreground md:flex-none"
      >
        {selectedCount} itens selecionados
      </Typography>

      {canDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="size-10 xl:size-6"
          aria-label="Deletar selecionados"
          onClick={onDeleteSelected}
        >
          <Trash2Icon className="text-destructive" />
        </Button>
      ) : null}

      {showEditAndView ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Editar selecionado"
            aria-pressed={isSingleSelection}
            disabled={!isSingleSelection}
            className={cn(
              "size-10 xl:size-6",
              isSingleSelection ? "bg-muted text-foreground" : "",
            )}
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
              "size-10 xl:size-6",
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
        </>
      ) : null}
    </Box>
  )
}
