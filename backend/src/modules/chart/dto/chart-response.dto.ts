import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class ChartResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiPropertyOptional()
  @IsOptional()
  description?: string

  @ApiProperty()
  apiRoute!: string

  @ApiProperty()
  order!: number

  @ApiPropertyOptional()
  @IsOptional()
  unit?: string

  @ApiProperty()
  chartTypeId!: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
