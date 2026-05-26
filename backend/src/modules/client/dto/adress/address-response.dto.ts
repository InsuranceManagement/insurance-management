import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class AddressResponseDto {
  @ApiProperty()
  id!: string

  @ApiPropertyOptional()
  cep?: string

  @ApiProperty()
  street!: string

  @ApiProperty()
  district!: string

  @ApiProperty()
  state!: string

  @ApiProperty()
  city!: string

  @ApiProperty()
  number!: string

  @ApiPropertyOptional()
  complement?: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
