import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AddressResponseDto } from './adress/address-response.dto'

export class ClientResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string

  @ApiPropertyOptional()
  cpf?: string

  @ApiPropertyOptional()
  cnpj?: string

  @ApiProperty()
  phoneNumber!: string

  @ApiProperty()
  birthDate!: Date

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date

  @ApiProperty({ type: AddressResponseDto })
  address!: AddressResponseDto
}
