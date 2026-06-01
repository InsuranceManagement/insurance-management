export type ChartPointX = number | string

export interface ChartPoint {
  name?: string
  x?: ChartPointX
  y: number
  color?: string
}

export type ChartSeriesType =
  | "line"
  | "spline"
  | "area"
  | "column"
  | "bar"
  | "pie"
  | "scatter"
  | "kpi"

export interface ChartSeries {
  name: string
  type: ChartSeriesType
  data: ChartPoint[]
  unit?: string
}
