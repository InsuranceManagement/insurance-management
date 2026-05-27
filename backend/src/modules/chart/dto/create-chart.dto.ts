import { CreateChartInput } from '@/modules/chart/inputs/create-chart.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

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
}
