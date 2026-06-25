import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { UpdateProductInput } from '../inputs/update-product.input'

export class UpdateProductDto implements UpdateProductInput {
  @ApiPropertyOptional({ description: 'Product name' })
  @IsOptional()
  @IsString({ message: 'O nome do produto deve ser um texto.' })
  name?: string

  @ApiPropertyOptional({ description: 'Product type id' })
  @IsOptional()
  @IsString({ message: 'O ID do tipo de produto deve ser um texto.' })
  productTypeId?: string

  @ApiPropertyOptional({ description: 'Insurance company id' })
  @IsOptional()
  @IsString({ message: 'O ID da seguradora deve ser um texto.' })
  insuranceCompanyId?: string
}
