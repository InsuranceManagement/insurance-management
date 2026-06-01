export type ChartPointX = number | string

export interface ChartPoint {
  name?: string
  x?: ChartPointX
  y: number
  color?: string
}
