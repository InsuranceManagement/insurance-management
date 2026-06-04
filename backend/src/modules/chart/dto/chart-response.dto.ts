import { ApiProperty } from '@nestjs/swagger'

export class ChartResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  description!: string

  @ApiProperty()
  apiRoute!: string

  @ApiProperty()
  order!: number

  @ApiProperty()
  chartTypeId!: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
