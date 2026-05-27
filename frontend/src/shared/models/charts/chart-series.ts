import { type ChartPoint } from "@/shared/models/charts/chart-point"

export type ChartSeriesType = "line" | "area" | "column" | "bar" | "pie"

export interface ChartSeries {
  id: string
  name: string
  type: ChartSeriesType
  points: ChartPoint[]
  color?: string
  unit?: string
}
