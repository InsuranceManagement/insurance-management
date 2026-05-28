import { ChartTypeSizePreset } from '@/modules/chart-type/chart-type-size-preset.enum'
import type { ChartTypeModel as PrismaChartType } from '@generated/prisma/models/ChartType'

export class ChartType {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly size: ChartTypeSizePreset,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(chartType: PrismaChartType): ChartType {
    return new ChartType(
      chartType.id as string,
      chartType.name as string,
      chartType.description as string,
      this.toSizePreset(chartType.size as string),
      chartType.createdAt as Date,
      chartType.updatedAt as Date,
    )
  }

  private static toSizePreset(size: string): ChartTypeSizePreset {
    if (Object.values(ChartTypeSizePreset).includes(size as ChartTypeSizePreset)) {
      return size as ChartTypeSizePreset
    }

    return ChartTypeSizePreset.ONE_BY_ONE
  }
}
