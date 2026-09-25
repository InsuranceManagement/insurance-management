"use client"

import * as React from "react"
import { Maximize2Icon, Minimize2Icon, XIcon } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Box } from "@/shared/components/ui/box"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { cn } from "@/shared/lib/utils"

type ModalProps = React.ComponentProps<typeof Dialog> & {
  title: string
  footer?: React.ReactNode
  trigger?: React.ReactNode
  contentClassName?: string
  bodyClassName?: string
  mobileFullscreen?: boolean
  expandable?: boolean
}

function Modal({
  title,
  footer,
  trigger,
  children,
  contentClassName,
  bodyClassName,
  mobileFullscreen = false,
  expandable = false,
  onOpenChange,
  ...dialogProps
}: ModalProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsExpanded(false)
    }

    onOpenChange?.(open)
  }

  return (
    <Dialog {...dialogProps} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        showCloseButton={false}
        className={cn(
          "w-[calc(100%-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] max-w-lg gap-0 p-0",
          mobileFullscreen &&
            "max-md:top-0 max-md:left-0 max-md:h-dvh max-md:max-h-dvh max-md:w-full! max-md:max-w-none! max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none max-md:ring-0",
          isExpanded &&
            "md:top-2! md:left-2! md:h-[calc(100dvh-1rem)]! md:max-h-none! md:w-[calc(100vw-1rem)]! md:max-w-none! md:translate-x-0! md:translate-y-0!",
          contentClassName,
        )}
      >
        <DialogHeader
          className={cn(
            "shrink-0 border-b px-4 py-4 sm:px-6",
            expandable && "pr-24",
          )}
        >
          <DialogTitle className="font-heading text-base leading-normal font-medium">
            {title}
          </DialogTitle>
          {expandable ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={isExpanded ? "Restaurar modal" : "Expandir modal"}
              aria-pressed={isExpanded}
              className="absolute top-4 right-14 hidden md:inline-flex"
              onClick={() => setIsExpanded((expanded) => !expanded)}
            >
              {isExpanded ? <Minimize2Icon /> : <Maximize2Icon />}
            </Button>
          ) : null}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Fechar modal"
              className="absolute top-4 right-4"
            >
              <XIcon />
            </Button>
          </DialogClose>
        </DialogHeader>

        <DialogDescription asChild>
          <Box
            className={cn(
              "min-h-0 overflow-y-auto px-4 py-4 text-foreground sm:px-6 sm:py-6",
              bodyClassName,
            )}
          >
            {children}
          </Box>
        </DialogDescription>

        {footer && (
          <DialogFooter className="shrink-0 border-t px-4 py-4 sm:px-6 [&>button]:min-w-0 [&>button]:flex-1 sm:[&>button]:flex-none">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { Modal }
