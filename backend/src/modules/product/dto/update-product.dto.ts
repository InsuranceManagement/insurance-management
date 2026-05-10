import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { UpdateProductInput } from '../inputs/update-product.input'

export class UpdateProductDto implements UpdateProductInput {
  @ApiPropertyOptional({ description: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: 'Product type id' })
  @IsOptional()
  @IsString()
  productTypeId?: string

  @ApiPropertyOptional({ description: 'Insurance company id' })
  @IsOptional()
  @IsString()
  insuranceCompanyId?: string
}
