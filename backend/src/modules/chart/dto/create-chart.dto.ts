import { CreateChartInput } from '@/modules/chart/inputs/create-chart.input'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class CreateChartDto implements CreateChartInput {
  @ApiProperty({ description: 'Chart name' })
  @IsString()
  name!: string

  @ApiProperty({ description: 'Chart description' })
  @IsString()
  description!: string

  @ApiProperty({ description: 'Chart API route' })
  @IsString()
  apiRoute!: string

  @ApiProperty({ description: 'Chart type id' })
  @IsString()
  chartTypeId!: string

  @ApiProperty({ description: 'Display order in dashboard' })
  @IsInt()
  @Min(0)
  order!: number

  @ApiPropertyOptional({ description: 'Chart unit' })
  @IsString()
  @IsOptional()
  unit?: string
}
