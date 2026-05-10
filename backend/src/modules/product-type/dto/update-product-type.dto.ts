import { UpdateProductTypeInput } from '@/modules/product-type/inputs/update-product-type.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateProductTypeDto implements UpdateProductTypeInput {
  @ApiPropertyOptional({ description: 'Product type name' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: 'Product type description' })
  @IsOptional()
  @IsString()
  description?: string
}
