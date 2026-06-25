import { ChartTypeSizePreset } from '@/modules/chart-type/chart-type-size-preset.enum'
import { UpdateChartTypeInput } from '@/modules/chart-type/inputs/update-chart-type.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateChartTypeDto implements UpdateChartTypeInput {
  @ApiPropertyOptional({ description: 'Chart type name' })
  @IsOptional()
  @IsString({ message: 'O nome do tipo de gráfico deve ser um texto.' })
  name?: string

  @ApiPropertyOptional({ description: 'Chart type description' })
  @IsOptional()
  @IsString({ message: 'A descrição do tipo de gráfico deve ser um texto.' })
  description?: string

  @ApiPropertyOptional({
    description: 'Chart size preset',
    enum: ChartTypeSizePreset,
    enumName: 'ChartTypeSizePreset',
  })
  @IsOptional()
  @IsEnum(ChartTypeSizePreset, {
    message: 'O tamanho do gráfico deve ser um dos valores permitidos.',
  })
  size?: ChartTypeSizePreset
}
