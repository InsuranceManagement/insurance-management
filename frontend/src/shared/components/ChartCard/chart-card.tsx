import { type ReactNode } from "react"

import { Card, CardContent } from "@/shared/components/ui/card"
import { cn } from "@/shared/lib/utils"
import { ChartTypeSizePreset } from "@/shared/models/chart-size-preset"

type ChartCardProps = {
  preset?: ChartTypeSizePreset
  children: ReactNode
  className?: string
  contentClassName?: string
}

const presetStyles: Record<ChartTypeSizePreset, string> = {
  [ChartTypeSizePreset.ONE_BY_ONE]:
    "col-span-1 row-span-1 min-h-56 sm:min-h-64 lg:min-h-72",
  [ChartTypeSizePreset.TWO_BY_ONE]:
    "col-span-1 md:col-span-2 row-span-1 min-h-56 sm:min-h-64 lg:min-h-72",
  [ChartTypeSizePreset.FOUR_BY_FOUR]:
    "col-span-1 md:col-span-2 xl:col-span-4 row-span-1 md:row-span-2 xl:row-span-4 min-h-72 sm:min-h-96 xl:min-h-[42rem]",
}

export function ChartCard({
  preset = ChartTypeSizePreset.FOUR_BY_FOUR,
  children,
  className,
  contentClassName,
}: Readonly<ChartCardProps>) {
  return (
    <Card className={cn("h-full w-full", presetStyles[preset], className)}>
      <CardContent className={cn("h-full", contentClassName)}>
        <div className="h-full w-full">{children}</div>
      </CardContent>
    </Card>
  )
}
