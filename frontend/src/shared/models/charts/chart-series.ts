import { type ChartPoint } from "@/shared/models/charts/chart-point"

export type ChartSeriesType = "line" | "bar" | "pie" | "donut" | "kpi"

export interface ChartSeries {
  name: string
  type: ChartSeriesType
  data: ChartPoint[]
  color?: string
  order?: number
}
