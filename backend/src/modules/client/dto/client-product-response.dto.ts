import { ApiProperty } from '@nestjs/swagger'

export class ClientProductResponseDto {
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
