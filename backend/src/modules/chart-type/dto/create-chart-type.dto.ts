import { ChartTypeSizePreset } from '@/modules/chart-type/chart-type-size-preset.enum'
import { CreateChartTypeInput } from '@/modules/chart-type/inputs/create-chart-type.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'

export class CreateChartTypeDto implements CreateChartTypeInput {
  @ApiProperty({ description: 'Chart type name' })
  @IsString({ message: 'O nome do tipo de gráfico deve ser um texto.' })
  name!: string

  @ApiProperty({ description: 'Chart type description' })
  @IsString({ message: 'A descrição do tipo de gráfico deve ser um texto.' })
  description!: string

  @ApiProperty({
    description: 'Chart size preset',
    enum: ChartTypeSizePreset,
    enumName: 'ChartTypeSizePreset',
  })
  @IsEnum(ChartTypeSizePreset, {
    message: 'O tamanho do gráfico deve ser um dos valores permitidos.',
  })
  size!: ChartTypeSizePreset
}
