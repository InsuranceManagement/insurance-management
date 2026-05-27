import { ChartTypeSizePreset } from '@/modules/chart-type/chart-type-size-preset.enum'
import { ApiProperty } from '@nestjs/swagger'

export class ChartTypeResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  description!: string

  @ApiProperty({
    enum: ChartTypeSizePreset,
    enumName: 'ChartTypeSizePreset',
  })
  size!: ChartTypeSizePreset

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
