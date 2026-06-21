import { ChartType } from '@/modules/chart-type/entities/chart-type'
import { CreateChartTypeInput } from '@/modules/chart-type/inputs/create-chart-type.input'
import { UpdateChartTypeInput } from '@/modules/chart-type/inputs/update-chart-type.input'
import { PrismaService } from '@/modules/database/prisma.service'
import { Injectable } from '@nestjs/common'

type CreateChartTypeData = CreateChartTypeInput & {
  id: string
}

type UpdateChartTypeData = UpdateChartTypeInput & {
  id?: string
}

@Injectable()
export class ChartTypeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateChartTypeData): Promise<ChartType> {
    const chartType = await this.prismaService.chartType.create({
      data: {
        ...input,
      },
    })

    return ChartType.fromPrisma(chartType)
  }

  async findById(chartTypeId: string): Promise<ChartType | null> {
    const chartType = await this.prismaService.chartType.findUnique({
      where: {
        id: chartTypeId,
      },
    })

    return chartType ? ChartType.fromPrisma(chartType) : null
  }

  async findByName(name: string): Promise<ChartType | null> {
    const chartType = await this.prismaService.chartType.findUnique({
      where: {
        name,
      },
    })

    return chartType ? ChartType.fromPrisma(chartType) : null
  }

  async update(chartTypeId: string, input: UpdateChartTypeData): Promise<void> {
    await this.prismaService.chartType.update({
      where: {
        id: chartTypeId,
      },
      data: {
        ...input,
      },
    })
  }

  async delete(chartTypeId: string): Promise<void> {
    await this.prismaService.chartType.delete({
      where: {
        id: chartTypeId,
      },
    })
  }

  async deleteMany(chartTypeIds: string[]): Promise<number> {
    if (chartTypeIds.length === 0) {
      return 0
    }

    const { count } = await this.prismaService.chartType.deleteMany({
      where: {
        id: {
          in: chartTypeIds,
        },
      },
    })

    return count
  }

  async list(): Promise<ChartType[]> {
    const chartTypes = await this.prismaService.chartType.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return chartTypes.map((chartType) => ChartType.fromPrisma(chartType))
  }
}
