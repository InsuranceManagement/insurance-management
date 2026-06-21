import { ChartTypeRepository } from '@/modules/chart-type/chart-type.repository'
import { ChartTypeResponseDto } from '@/modules/chart-type/dto/chart-type-response.dto'
import { CreateChartTypeDto } from '@/modules/chart-type/dto/create-chart-type.dto'
import { UpdateChartTypeDto } from '@/modules/chart-type/dto/update-chart-type.dto'
import { ChartType } from '@/modules/chart-type/entities/chart-type'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class ChartTypeService {
  constructor(private readonly chartTypeRepository: ChartTypeRepository) {}

  async create(input: CreateChartTypeDto): Promise<ChartTypeResponseDto> {
    const existingByName = await this.chartTypeRepository.findByName(input.name)

    if (existingByName) {
      throw new BadRequestException('Chart type name already in use')
    }

    const id = this.buildIdFromName(input.name)
    const chartType = await this.chartTypeRepository.create({
      id,
      name: input.name,
      description: input.description,
      size: input.size,
    })

    return this.toResponse(chartType)
  }

  async getById(chartTypeId: string): Promise<ChartTypeResponseDto> {
    const chartType = await this.chartTypeRepository.findById(chartTypeId)

    if (!chartType) {
      throw new NotFoundException('Chart type not found')
    }

    return this.toResponse(chartType)
  }

  async list(): Promise<ChartTypeResponseDto[]> {
    const chartTypes = await this.chartTypeRepository.list()

    return chartTypes.map((chartType) => this.toResponse(chartType))
  }

  async update(chartTypeId: string, input: UpdateChartTypeDto): Promise<void> {
    const existingChartType = await this.chartTypeRepository.findById(chartTypeId)

    if (!existingChartType) {
      throw new NotFoundException('Chart type not found')
    }

    let nextId: string | undefined

    if (input.name && input.name !== existingChartType.name) {
      const nameInUse = await this.chartTypeRepository.findByName(input.name)
      if (nameInUse && nameInUse.id !== chartTypeId) {
        throw new BadRequestException('Chart type name already in use')
      }

      nextId = this.buildIdFromName(input.name)
    }

    await this.chartTypeRepository.update(chartTypeId, {
      ...input,
      id: nextId,
    })
  }

  async delete(chartTypeIds: string[]): Promise<void> {
    const deletedCount = await this.chartTypeRepository.deleteMany(chartTypeIds)

    if (deletedCount === 0) {
      throw new NotFoundException('Chart type not found')
    }
  }

  async exists(chartTypeId: string): Promise<boolean> {
    const chartType = await this.chartTypeRepository.findById(chartTypeId)
    return !!chartType
  }

  private toResponse(chartType: ChartType): ChartTypeResponseDto {
    return {
      id: chartType.id,
      name: chartType.name,
      description: chartType.description,
      size: chartType.size,
      createdAt: chartType.createdAt,
      updatedAt: chartType.updatedAt,
    }
  }

  private buildIdFromName(name: string): string {
    return name
  }
}
