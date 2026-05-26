import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, Matches } from 'class-validator'

export class CreateAddressDto {
  @ApiPropertyOptional({ description: 'Address CEP (numbers only)' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'cep must contain 8 digits (numbers only)' })
  cep?: string

  @ApiProperty({ description: 'Street name' })
  @IsString()
  street!: string

  @ApiProperty({ description: 'District / neighborhood' })
  @IsString()
  district!: string

  @ApiProperty({ description: 'State code/name' })
  @IsString()
  state!: string

  @ApiProperty({ description: 'City name' })
  @IsString()
  city!: string

  @ApiProperty({ description: 'Address number' })
  @IsString()
  number!: string

  @ApiPropertyOptional({ description: 'Address complement' })
  @IsOptional()
  @IsString()
  complement?: string
}
