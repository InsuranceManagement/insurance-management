import { ChartTypeService } from '@/modules/chart-type/services/chart-type.service'
import { ChartRepository } from '@/modules/chart/chart.repository'
import { ChartResponseDto } from '@/modules/chart/dto/chart-response.dto'
import { CreateChartDto } from '@/modules/chart/dto/create-chart.dto'
import { UpdateChartDto } from '@/modules/chart/dto/update-chart.dto'
import { Chart } from '@/modules/chart/entities/chart'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class ChartService {
  constructor(
    private readonly chartRepository: ChartRepository,
    private readonly chartTypeService: ChartTypeService,
  ) {}

  async create(input: CreateChartDto): Promise<ChartResponseDto> {
    const existingByName = await this.chartRepository.findByName(input.name)

    if (existingByName) {
      throw new BadRequestException('Nome do gráfico já está em uso')
    }

    const chartTypeExists = await this.chartTypeService.exists(input.chartTypeId)

    if (!chartTypeExists) {
      throw new NotFoundException('Tipo de gráfico não encontrado')
    }

    const id = this.buildIdFromName(input.name)

    const chart = await this.chartRepository.create({
      ...input,
      id,
    })

    return this.toResponse(chart)
  }

  async getById(chartId: string): Promise<ChartResponseDto> {
    const chart = await this.chartRepository.findById(chartId)

    if (!chart) {
      throw new NotFoundException('Gráfico não encontrado')
    }

    return this.toResponse(chart)
  }

  async list(): Promise<ChartResponseDto[]> {
    const charts = await this.chartRepository.list()

    return charts.map((chart) => this.toResponse(chart))
  }

  async update(chartId: string, input: UpdateChartDto): Promise<void> {
    const existingChart = await this.chartRepository.findById(chartId)

    if (!existingChart) {
      throw new NotFoundException('Gráfico não encontrado')
    }

    let nextId: string | undefined

    if (input.name && input.name !== existingChart.name) {
      const nameInUse = await this.chartRepository.findByName(input.name)
      if (nameInUse && nameInUse.id !== chartId) {
        throw new BadRequestException('Nome do gráfico já está em uso')
      }

      nextId = this.buildIdFromName(input.name)
    }

    if (input.chartTypeId) {
      const chartTypeExists = await this.chartTypeService.exists(input.chartTypeId)
      if (!chartTypeExists) {
        throw new NotFoundException('Tipo de gráfico não encontrado')
      }
    }

    await this.chartRepository.update(chartId, {
      ...input,
      id: nextId,
    })
  }

  async delete(chartIds: string[]): Promise<void> {
    const deletedCount = await this.chartRepository.deleteMany(chartIds)

    if (deletedCount === 0) {
      throw new NotFoundException('Gráfico não encontrado')
    }
  }

  private toResponse(chart: Chart): ChartResponseDto {
    return {
      id: chart.id,
      name: chart.name,
      description: chart.description,
      apiRoute: chart.apiRoute,
      order: chart.order,
      unit: chart.unit,
      chartTypeId: chart.chartTypeId,
      createdAt: chart.createdAt,
      updatedAt: chart.updatedAt,
    }
  }

  private buildIdFromName(name: string): string {
    return name
  }
}
