import { CreateChartInput } from '@/modules/chart/inputs/create-chart.input'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class CreateChartDto implements CreateChartInput {
  @ApiProperty({ description: 'Chart name' })
  @IsString({ message: 'O nome do gráfico deve ser um texto.' })
  name!: string

  @ApiProperty({ description: 'Chart description' })
  @IsString({ message: 'A descrição do gráfico deve ser um texto.' })
  description!: string

  @ApiProperty({ description: 'Chart API route' })
  @IsString({ message: 'A rota da API do gráfico deve ser um texto.' })
  apiRoute!: string

  @ApiProperty({ description: 'Chart type id' })
  @IsString({ message: 'O ID do tipo de gráfico deve ser um texto.' })
  chartTypeId!: string

  @ApiProperty({ description: 'Display order in dashboard' })
  @IsInt({ message: 'A ordem de exibição deve ser um número inteiro.' })
  @Min(0, { message: 'A ordem de exibição não pode ser negativa.' })
  order!: number

  @ApiPropertyOptional({ description: 'Chart unit' })
  @IsString({ message: 'A unidade do gráfico deve ser um texto.' })
  @IsOptional()
  unit?: string
}
