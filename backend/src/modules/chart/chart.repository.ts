import { Chart } from '@/modules/chart/entities/chart'
import { CreateChartInput } from '@/modules/chart/inputs/create-chart.input'
import { UpdateChartInput } from '@/modules/chart/inputs/update-chart.input'
import { PrismaService } from '@/modules/database/prisma.service'
import { Injectable } from '@nestjs/common'

type CreateChartData = CreateChartInput & {
  id: string
}

type UpdateChartData = UpdateChartInput & {
  id?: string
}

@Injectable()
export class ChartRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateChartData): Promise<Chart> {
    const chart = await this.prismaService.chart.create({
      data: {
        ...input,
      },
    })

    return Chart.fromPrisma(chart)
  }

  async findById(chartId: string): Promise<Chart | null> {
    const chart = await this.prismaService.chart.findUnique({
      where: {
        id: chartId,
      },
    })

    return chart ? Chart.fromPrisma(chart) : null
  }

  async findByName(name: string): Promise<Chart | null> {
    const chart = await this.prismaService.chart.findUnique({
      where: {
        name,
      },
    })

    return chart ? Chart.fromPrisma(chart) : null
  }

  async update(chartId: string, input: UpdateChartData): Promise<void> {
    await this.prismaService.chart.update({
      where: {
        id: chartId,
      },
      data: {
        ...input,
      },
    })
  }

  async delete(chartId: string): Promise<void> {
    await this.prismaService.chart.delete({
      where: {
        id: chartId,
      },
    })
  }

  async deleteMany(chartIds: string[]): Promise<void> {
    await this.prismaService.chart.deleteMany({
      where: {
        id: {
          in: chartIds,
        },
      },
    })
  }

  async list(): Promise<Chart[]> {
    const charts = await this.prismaService.chart.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return charts.map((chart) => Chart.fromPrisma(chart))
  }
}
