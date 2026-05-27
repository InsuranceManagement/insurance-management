import { ChartTypeSizePreset } from '@/modules/chart-type/chart-type-size-preset.enum'
import { CreateChartTypeInput } from '@/modules/chart-type/inputs/create-chart-type.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'

export class CreateChartTypeDto implements CreateChartTypeInput {
  @ApiProperty({ description: 'Chart type name' })
  @IsString()
  name!: string

  @ApiProperty({ description: 'Chart type description' })
  @IsString()
  description!: string

  @ApiProperty({
    description: 'Chart size preset',
    enum: ChartTypeSizePreset,
    enumName: 'ChartTypeSizePreset',
  })
  @IsEnum(ChartTypeSizePreset)
  size!: ChartTypeSizePreset
}
