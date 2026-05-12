import { ApiProperty } from '@nestjs/swagger'

export class ClientResponseDto {
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
}
