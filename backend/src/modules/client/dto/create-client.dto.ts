import { CreateClientInput } from '@/modules/client/inputs/create-client.input'
import { CnpjValidator } from '@/modules/client/validators/cnpj.validator'
import { CpfValidator } from '@/modules/client/validators/cpf.validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { CreateAddressDto } from './adress/create-address.dto'

export class CreateClientDto implements CreateClientInput {
  @ApiProperty({ description: 'Client name' })
  @IsString()
  name!: string

  @ApiProperty({ description: 'Client e-mail' })
  @IsEmail()
  email!: string

  @ApiPropertyOptional({ description: 'Client CPF' })
  @IsOptional()
  @ValidateIf((_, value: unknown) => value !== undefined && value !== null && value !== '')
  @IsString()
  @Matches(/^\d{11}$/, { message: 'cpf must contain 11 digits (numbers only)' })
  @Validate(CpfValidator)
  cpf?: string

  @ApiPropertyOptional({ description: 'Client CNPJ' })
  @IsOptional()
  @ValidateIf((_, value: unknown) => value !== undefined && value !== null && value !== '')
  @IsString()
  @Matches(/^\d{14}$/, { message: 'cnpj must contain 14 digits (numbers only)' })
  @Validate(CnpjValidator)
  cnpj?: string

  @ApiProperty({ description: 'Client phone number' })
  @IsString()
  @Matches(/^\d{10,15}$/, {
    message: 'phoneNumber must contain 10 to 15 digits (numbers only)',
  })
  phoneNumber!: string

  @ApiProperty({ description: 'Client birth date (ISO 8601)' })
  @Transform(({ value }) =>
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00.000Z`
      : value,
  )
  @IsDateString()
  birthDate!: string

  @ApiProperty({ type: CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address!: CreateAddressDto

  @ApiPropertyOptional({ description: 'Product ids linked to the client' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  productIds?: string[]

  @ValidateIf((obj: CreateClientDto) => !obj.cpf && !obj.cnpj)
  @Matches(/^never$/, {
    message: 'CPF ou CNPJ são obrigatórios',
  })
  private readonly cpfOrCnpjRequiredValidation?: string
}
