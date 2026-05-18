import { ApiProperty } from '@nestjs/swagger'

export class ProductTypeResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  description!: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
