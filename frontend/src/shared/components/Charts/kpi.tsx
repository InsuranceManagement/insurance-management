import { ChartCard } from "@/shared/components/ChartCard/chart-card"
import { Box } from "@/shared/components/ui/box"
import { Typography } from "@/shared/components/ui/typography"
import { cn } from "@/shared/lib/utils"
import { ChartTypeSizePreset } from "@/shared/models/charts/chart-size-preset"

type KPIChartProps = {
  title: string
  value?: number
  unit?: string
  prefix?: string
  suffix?: string
  className?: string
}

export function KPIChart({
  title,
  value,
  unit,
  prefix,
  suffix,
  className,
}: Readonly<KPIChartProps>) {
  const formattedValue =
    typeof value === "number" ? `${prefix ?? ""}${value}${suffix ?? ""}` : "--"

  return (
    <ChartCard
      preset={ChartTypeSizePreset.ONE_BY_ONE}
      className="py-3"
      contentClassName="px-4"
    >
      <Box
        className={cn("h-full w-full flex-col justify-start gap-1", className)}
      >
        <Typography variant="large">{title}</Typography>

        <Typography variant="small" className="text-4xl">
          {formattedValue + (unit ?? "")}
        </Typography>
      </Box>
    </ChartCard>
  )
}
