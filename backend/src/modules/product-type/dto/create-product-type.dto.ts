import { CreateProductTypeInput } from '@/modules/product-type/inputs/create-product-type.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateProductTypeDto implements CreateProductTypeInput {
  @ApiProperty({ description: 'Product type name' })
  @IsString()
  name!: string

  @ApiProperty({ description: 'Product type description' })
  @IsString()
  description!: string
}
