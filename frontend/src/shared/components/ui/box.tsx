import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/shared/lib/utils"

function Box({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return <Comp data-slot="box" className={cn("flex", className)} {...props} />
}

export { Box }
