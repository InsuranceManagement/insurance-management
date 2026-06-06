import { InsuranceCompanyResponseDto } from '@/modules/insurance-company/dto/insurance-company-response.dto'
import { ProductTypeResponseDto } from '@/modules/product-type/dto/product-type-response.dto'
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

  @ApiPropertyOptional({ type: () => ProductTypeResponseDto })
  productType?: ProductTypeResponseDto

  @ApiPropertyOptional({ type: () => InsuranceCompanyResponseDto })
  insuranceCompany?: InsuranceCompanyResponseDto

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
