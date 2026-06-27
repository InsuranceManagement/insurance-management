import { CreateProductInput } from '@/modules/product/inputs/create-product.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateProductDto implements CreateProductInput {
  @ApiProperty({ description: 'Product name' })
  @IsString({ message: 'O nome do produto deve ser um texto.' })
  name!: string

  @ApiProperty({ description: 'Product type id' })
  @IsString({ message: 'O ID do tipo de produto deve ser um texto.' })
  productTypeId!: string

  @ApiProperty({ description: 'Insurance company id' })
  @IsString({ message: 'O ID da seguradora deve ser um texto.' })
  insuranceCompanyId!: string
}
