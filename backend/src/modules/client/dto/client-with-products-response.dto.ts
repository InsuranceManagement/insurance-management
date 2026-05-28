import { ApiProperty } from '@nestjs/swagger'
import { ClientProductResponseDto } from './client-product-response.dto'
import { ClientResponseDto } from './client-response.dto'

export class ClientWithProductsResponseDto extends ClientResponseDto {
  @ApiProperty({ type: [ClientProductResponseDto] })
  products!: ClientProductResponseDto[]
}
