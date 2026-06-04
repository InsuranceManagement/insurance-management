import { type ChartSeries } from "@/shared/models/charts/chart-series"

export interface BaseChartProps {
  data: ChartSeries[]
  title: string
  subtitle: string
  xAxisTitle?: string
  yAxisTitle?: string
  showLegend?: boolean
}
