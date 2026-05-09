import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/shared/lib/utils"

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      display: "scroll-m-20 text-5xl font-semibold tracking-tight",
      h1: "scroll-m-20 text-4xl font-semibold tracking-tight",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7",
      lead: "text-lg text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium",
      muted: "text-sm text-muted-foreground",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      blockquote: "border-l-2 pl-6 italic",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  Omit<VariantProps<typeof typographyVariants>, "variant"> & {
    variant?: TypographyVariant
    asChild?: boolean
  }

type TypographyTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "small"
  | "code"
  | "blockquote"

const variantElementMap: Record<TypographyVariant, TypographyTag> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  lead: "p",
  large: "p",
  small: "small",
  muted: "p",
  code: "code",
  blockquote: "blockquote",
}

function Typography({
  className,
  variant = "p",
  asChild = false,
  ...props
}: TypographyProps) {
  const classes = cn(typographyVariants({ variant }), className)

  if (asChild) {
    return (
      <Slot.Root
        data-slot="typography"
        data-variant={variant}
        className={classes}
        {...props}
      />
    )
  }

  const Element = variantElementMap[variant]

  return (
    <Element
      data-slot="typography"
      data-variant={variant}
      className={classes}
      {...props}
    />
  )
}

export { Typography, typographyVariants }
