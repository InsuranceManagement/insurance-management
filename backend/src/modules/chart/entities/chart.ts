import type { ChartModel as PrismaChart } from '@generated/prisma/models/Chart'

export class Chart {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly apiRoute: string,
    public readonly order: number,
    public readonly chartTypeId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(chart: PrismaChart): Chart {
    return new Chart(
      chart.id,
      chart.name,
      chart.description,
      chart.apiRoute,
      chart.order,
      chart.chartTypeId,
      chart.createdAt,
      chart.updatedAt,
    )
  }
}
