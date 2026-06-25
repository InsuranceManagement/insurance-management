import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, Matches } from 'class-validator'

export class CreateAddressDto {
  @ApiPropertyOptional({ description: 'Address CEP (numbers only)' })
  @IsOptional()
  @IsString({ message: 'O CEP deve ser um texto.' })
  @Matches(/^\d{8}$/, { message: 'O CEP deve conter exatamente 8 números. (somente números)' })
  cep?: string

  @ApiProperty({ description: 'Street name' })
  @IsString({ message: 'O nome da rua deve ser um texto.' })
  street!: string

  @ApiProperty({ description: 'District / neighborhood' })
  @IsString({ message: 'O bairro deve ser um texto.' })
  district!: string

  @ApiProperty({ description: 'State code/name' })
  @IsString({ message: 'O estado deve ser um texto.' })
  state!: string

  @ApiProperty({ description: 'City name' })
  @IsString({ message: 'A cidade deve ser um texto.' })
  city!: string

  @ApiProperty({ description: 'Address number' })
  @IsString({ message: 'O número do endereço deve ser um texto.' })
  number!: string

  @ApiPropertyOptional({ description: 'Address complement' })
  @IsOptional()
  @IsString({ message: 'O complemento do endereço deve ser um texto.' })
  complement?: string
}
