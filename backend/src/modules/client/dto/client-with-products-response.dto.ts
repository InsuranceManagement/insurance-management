import { ApiProperty } from '@nestjs/swagger'
import { ClientProductResponseDto } from './client-product-response.dto'

export class ClientWithProductsResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  cpf!: string

  @ApiProperty()
  cnpj!: string

  @ApiProperty()
  phoneNumber!: string

  @ApiProperty()
  birthDate!: Date

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date

  @ApiProperty({ type: [ClientProductResponseDto] })
  products!: ClientProductResponseDto[]
}
