"use client"

import { type ReactNode } from "react"

import { Box } from "@/shared/components/ui/box"
import { Modal } from "@/shared/components/ui/modal"
import { Typography } from "@/shared/components/ui/typography"
import { cn } from "@/shared/lib/utils"

type EntityViewFieldCellContext<TData> = {
  value: TData[keyof TData]
  entity: TData
}

export type EntityViewField<TData> = {
  accessorKey: keyof TData
  label: string
  cell?: (context: EntityViewFieldCellContext<TData>) => ReactNode
  className?: string
}

type EntityViewModalProps<TData> = {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  entity: TData | null
  fields: EntityViewField<TData>[]
  emptyValue?: ReactNode
  contentClassName?: string
  expandable?: boolean
}

export function EntityViewModal<TData>({
  title,
  open,
  onOpenChange,
  entity,
  fields,
  emptyValue = "-",
  contentClassName,
  expandable = false,
}: Readonly<EntityViewModalProps<TData>>) {
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
      bodyClassName="h-full flex-col overscroll-contain pb-8 touch-pan-y [-webkit-overflow-scrolling:touch]"
      expandable={expandable}
      mobileFullscreen
    >
      <Box className="min-h-max w-full flex-col gap-4">
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
                className={cn(
                  "min-w-0 flex-col gap-1 bg-card p-3",
                  field.className,
                )}
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
