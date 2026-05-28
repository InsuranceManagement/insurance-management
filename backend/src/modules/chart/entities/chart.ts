import type { ChartModel as PrismaChart } from '@generated/prisma/models/Chart'

export class Chart {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly apiRoute: string,
    public readonly chartTypeId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(chart: PrismaChart): Chart {
    return new Chart(
      chart.id as string,
      chart.name as string,
      chart.description as string,
      chart.apiRoute as string,
      chart.chartTypeId as string,
      chart.createdAt as Date,
      chart.updatedAt as Date,
    )
  }
}
