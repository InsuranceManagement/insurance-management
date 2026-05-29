import { type ReactNode } from "react"

import { ChartCard } from "@/shared/components/ChartCard/chart-card"
import { Box } from "@/shared/components/ui/box"
import { cn } from "@/shared/lib/utils"
import { ChartTypeSizePreset } from "@/shared/models/charts/chart-size-preset"

type EmptyChartCardProps = {
  preset: ChartTypeSizePreset
  message?: ReactNode
  className?: string
}

export function EmptyChartCard({
  preset,
  message = "Sem dados para exibir.",
  className,
}: Readonly<EmptyChartCardProps>) {
  return (
    <ChartCard preset={preset}>
      <Box
        className={cn(
          "h-full w-full items-center justify-center text-sm text-muted-foreground",
          className,
        )}
      >
        {message}
      </Box>
    </ChartCard>
  )
}
