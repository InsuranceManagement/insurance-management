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
      throw new BadRequestException('Chart name already in use')
    }

    const chartTypeExists = await this.chartTypeService.exists(input.chartTypeId)

    if (!chartTypeExists) {
      throw new NotFoundException('Chart type not found')
    }

    const id = this.buildIdFromName(input.name)

    const chart = await this.chartRepository.create({
      id,
      name: input.name,
      description: input.description,
      apiRoute: input.apiRoute,
      chartTypeId: input.chartTypeId,
    })

    return this.toResponse(chart)
  }

  async getById(chartId: string): Promise<ChartResponseDto> {
    const chart = await this.chartRepository.findById(chartId)

    if (!chart) {
      throw new NotFoundException('Chart not found')
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
      throw new NotFoundException('Chart not found')
    }

    let nextId: string | undefined

    if (input.name && input.name !== existingChart.name) {
      const nameInUse = await this.chartRepository.findByName(input.name)
      if (nameInUse && nameInUse.id !== chartId) {
        throw new BadRequestException('Chart name already in use')
      }

      nextId = this.buildIdFromName(input.name)
    }

    if (input.chartTypeId) {
      const chartTypeExists = await this.chartTypeService.exists(input.chartTypeId)
      if (!chartTypeExists) {
        throw new NotFoundException('Chart type not found')
      }
    }

    await this.chartRepository.update(chartId, {
      ...input,
      id: nextId,
    })
  }

  async deleteMany(chartIds: string[]): Promise<void> {
    if (chartIds.length === 0) {
      return
    }

    await this.chartRepository.deleteMany(chartIds)
  }

  private toResponse(chart: Chart): ChartResponseDto {
    return {
      id: chart.id,
      name: chart.name,
      description: chart.description,
      apiRoute: chart.apiRoute,
      chartTypeId: chart.chartTypeId,
      createdAt: chart.createdAt,
      updatedAt: chart.updatedAt,
    }
  }

  private buildIdFromName(name: string): string {
    return name
  }
}
