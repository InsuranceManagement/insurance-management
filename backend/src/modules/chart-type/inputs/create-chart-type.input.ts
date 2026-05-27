import { ChartTypeSizePreset } from '@/modules/chart-type/chart-type-size-preset.enum'

export interface CreateChartTypeInput {
  name: string
  description: string
  size: ChartTypeSizePreset
}
