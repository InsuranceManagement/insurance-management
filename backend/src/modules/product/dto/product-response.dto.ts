import { ApiProperty } from '@nestjs/swagger'

export class ProductResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  productTypeId!: string

  @ApiProperty()
  insuranceCompanyId!: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
