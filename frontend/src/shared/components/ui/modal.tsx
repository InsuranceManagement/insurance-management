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
        className={cn("max-w-lg gap-0 p-0", contentClassName)}
      >
        <DialogHeader className="border-b px-6 py-4">
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
          <Box className="px-6 py-6 text-foreground">{children}</Box>
        </DialogDescription>

        {footer && (
          <DialogFooter className="border-t px-6 py-4">{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { Modal }
