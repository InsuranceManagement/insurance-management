import { type ChartSeries } from "@/shared/models/charts/chart-series"

export interface BaseChartProps {
  dataUrl: string
  series: ChartSeries
  title: string
  subtitle: string
  unit?: string
  xAxisTitle?: string
  yAxisTitle?: string
  showLegend?: boolean
}
