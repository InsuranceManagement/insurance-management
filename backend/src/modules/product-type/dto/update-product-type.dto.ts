import { UpdateProductTypeInput } from '@/modules/product-type/inputs/update-product-type.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateProductTypeDto implements UpdateProductTypeInput {
  @ApiPropertyOptional({ description: 'Product type name' })
  @IsOptional()
  @IsString({ message: 'O nome do tipo de produto deve ser um texto.' })
  name?: string

  @ApiPropertyOptional({ description: 'Product type description' })
  @IsOptional()
  @IsString({ message: 'A descrição do tipo de produto deve ser um texto.' })
  description?: string
}
