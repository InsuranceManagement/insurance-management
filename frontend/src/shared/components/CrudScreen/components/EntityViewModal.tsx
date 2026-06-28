"use client"

import { type ReactNode } from "react"

import { Box } from "@/shared/components/ui/box"
import { Button } from "@/shared/components/ui/button"
import { Modal } from "@/shared/components/ui/modal"
import { Typography } from "@/shared/components/ui/typography"

type EntityViewFieldCellContext<TData> = {
  value: TData[keyof TData]
  entity: TData
}

export type EntityViewField<TData> = {
  accessorKey: keyof TData
  label: string
  cell?: (context: EntityViewFieldCellContext<TData>) => ReactNode
}

type EntityViewModalProps<TData> = {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  entity: TData | null
  fields: EntityViewField<TData>[]
  subtitle?: ReactNode | ((entity: TData) => ReactNode)
  closeLabel?: string
  emptyValue?: ReactNode
  contentClassName?: string
}

export function EntityViewModal<TData>({
  title,
  open,
  onOpenChange,
  entity,
  fields,
  subtitle,
  closeLabel = "Fechar",
  emptyValue = "-",
  contentClassName,
}: Readonly<EntityViewModalProps<TData>>) {
  const subtitleContent =
    entity && typeof subtitle === "function"
      ? subtitle(entity)
      : typeof subtitle === "function"
        ? null
        : subtitle

  const renderFieldValue = (value: ReactNode) => {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return (
        <Typography
          variant="p"
          className="min-w-0 text-sm leading-normal break-words [overflow-wrap:anywhere]"
        >
          {value}
        </Typography>
      )
    }

    return (
      <Box className="min-w-0 text-sm leading-normal break-words [overflow-wrap:anywhere]">
        {value}
      </Box>
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      contentClassName={contentClassName}
      footer={
        <Box className="w-full justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {closeLabel}
          </Button>
        </Box>
      }
    >
      <Box className="w-full flex-col gap-4">
        {subtitleContent ? (
          <Typography variant="muted">{subtitleContent}</Typography>
        ) : null}

        <Box className="grid grid-cols-1 gap-px overflow-hidden rounded-md border bg-border sm:grid-cols-2">
          {fields.map((field) => {
            const rawValue = entity?.[field.accessorKey]

            const renderedValue =
              entity && field.cell && rawValue
                ? field.cell({
                    value: rawValue,
                    entity,
                  })
                : (rawValue ?? emptyValue)

            return (
              <Box
                key={String(field.accessorKey)}
                className="min-w-0 flex-col gap-1 bg-card p-3"
              >
                <Typography
                  variant="small"
                  className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {field.label}
                </Typography>

                {renderFieldValue(renderedValue as ReactNode)}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Modal>
  )
}
