"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

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
}

function Modal({
  title,
  footer,
  trigger,
  children,
  contentClassName,
  ...dialogProps
}: ModalProps) {
  return (
    <Dialog {...dialogProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        showCloseButton={false}
        className={cn(
          "grid-rows-[auto_minmax(0,1fr)_auto] max-w-lg gap-0 p-0",
          contentClassName,
        )}
      >
        <DialogHeader className="shrink-0 border-b px-4 py-4 sm:px-6">
          <DialogTitle className="font-heading text-base leading-normal font-medium">
            {title}
          </DialogTitle>
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
          <Box className="min-h-0 overflow-y-auto px-4 py-4 text-foreground sm:px-6 sm:py-6">
            {children}
          </Box>
        </DialogDescription>

        {footer && (
          <DialogFooter className="shrink-0 border-t px-4 py-4 sm:px-6 [&>button]:w-full sm:[&>button]:w-auto">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { Modal }
