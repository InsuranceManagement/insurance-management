import { type ReactNode } from "react"

import { Card, CardContent } from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils"
import { ChartTypeSizePreset } from "@/shared/models/charts/chart-size-preset"

type ChartCardProps = {
  preset?: ChartTypeSizePreset
  children: ReactNode
  className?: string
  contentClassName?: string
}

const presetStyles: Record<ChartTypeSizePreset, string> = {
  [ChartTypeSizePreset.ONE_BY_ONE]: "col-span-2 row-span-1",
  [ChartTypeSizePreset.TWO_BY_ONE]: "col-span-4 row-span-1",
  [ChartTypeSizePreset.FOUR_BY_FOUR]: "col-span-4 row-span-4",
}

export function ChartCard({
  preset = ChartTypeSizePreset.FOUR_BY_FOUR,
  children,
  className,
  contentClassName,
}: Readonly<ChartCardProps>) {
  return (
    <Card className={cn("h-full w-full", presetStyles[preset], className)}>
      <CardContent className={cn("h-full min-h-0", contentClassName)}>
        <div className="h-full w-full">{children}</div>
      </CardContent>
    </Card>
  )
}
