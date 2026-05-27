import { UpdateChartInput } from '@/modules/chart/inputs/update-chart.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateChartDto implements UpdateChartInput {
  @ApiPropertyOptional({ description: 'Chart name' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: 'Chart description' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'Chart API route' })
  @IsOptional()
  @IsString()
  apiRoute?: string

  @ApiPropertyOptional({ description: 'Chart type id' })
  @IsOptional()
  @IsString()
  chartTypeId?: string
}
