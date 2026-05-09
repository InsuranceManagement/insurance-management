import { CreateProductInput } from '@/modules/product/inputs/create-product.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateProductDto implements CreateProductInput {
  @ApiProperty({ description: 'Product name' })
  @IsString()
  name!: string

  @ApiProperty({ description: 'Product type id' })
  @IsString()
  productTypeId!: string

  @ApiProperty({ description: 'Insurance company id' })
  @IsString()
  insuranceCompanyId!: string
}
