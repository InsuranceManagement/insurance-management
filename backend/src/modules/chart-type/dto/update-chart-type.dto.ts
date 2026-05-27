import { ChartTypeSizePreset } from '@/modules/chart-type/chart-type-size-preset.enum'
import { UpdateChartTypeInput } from '@/modules/chart-type/inputs/update-chart-type.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class UpdateChartTypeDto implements UpdateChartTypeInput {
  @ApiPropertyOptional({ description: 'Chart type name' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: 'Chart type description' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    description: 'Chart size preset',
    enum: ChartTypeSizePreset,
    enumName: 'ChartTypeSizePreset',
  })
  @IsOptional()
  @IsEnum(ChartTypeSizePreset)
  size?: ChartTypeSizePreset
}
