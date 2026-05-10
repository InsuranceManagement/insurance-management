import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LinkClientProductDto {
  @ApiProperty({ description: 'Product id' })
  @IsString()
  productId!: string
}
