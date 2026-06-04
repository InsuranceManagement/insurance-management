import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ProductResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  productTypeId!: string

  @ApiProperty()
  insuranceCompanyId!: string

  @ApiPropertyOptional()
  productType?: Record<string, any>

  @ApiPropertyOptional()
  insuranceCompany?: Record<string, any>

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
