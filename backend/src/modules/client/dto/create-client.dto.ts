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
  @IsString({ message: 'O nome do cliente deve ser um texto.' })
  name!: string

  @ApiProperty({ description: 'Client e-mail' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string

  @ApiPropertyOptional({ description: 'Client CPF' })
  @IsOptional()
  @ValidateIf((_, value: unknown) => value !== undefined && value !== null && value !== '')
  @IsString({ message: 'O CPF deve ser um texto.' })
  @Matches(/^\d{11}$/, { message: 'O CPF deve conter exatamente 11 números. (somente números)' })
  @Validate(CpfValidator, { message: 'Informe um CPF válido.' })
  cpf?: string

  @ApiPropertyOptional({ description: 'Client CNPJ' })
  @IsOptional()
  @ValidateIf((_, value: unknown) => value !== undefined && value !== null && value !== '')
  @IsString({ message: 'O CNPJ deve ser um texto.' })
  @Matches(/^\d{14}$/, { message: 'O CNPJ deve conter exatamente 14 números. (somente números)' })
  @Validate(CnpjValidator, { message: 'Informe um CNPJ válido.' })
  cnpj?: string

  @ApiProperty({ description: 'Client phone number' })
  @IsString({ message: 'O telefone deve ser um texto.' })
  @Matches(/^\d{10,15}$/, {
    message: 'O telefone deve conter entre 10 e 15 números. (somente números)',
  })
  phoneNumber!: string

  @ApiProperty({ description: 'Client birth date (ISO 8601)' })
  @Transform(({ value }) =>
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00.000Z`
      : value,
  )
  @IsDateString({}, { message: 'Informe uma data de nascimento válida no formato ISO 8601.' })
  birthDate!: string

  @ApiProperty({ type: CreateAddressDto })
  @ValidateNested({ message: 'O endereço informado é inválido.' })
  @Type(() => CreateAddressDto)
  address!: CreateAddressDto

  @ApiPropertyOptional({ description: 'Product ids linked to the client' })
  @IsOptional()
  @IsArray({ message: 'Os IDs dos produtos devem ser enviados em uma lista.' })
  @ArrayUnique({ message: 'A lista de produtos não pode conter IDs duplicados.' })
  @IsString({ each: true, message: 'Cada ID de produto deve ser um texto válido.' })
  productIds?: string[]

  @ValidateIf((obj: CreateClientDto) => !obj.cpf && !obj.cnpj)
  @Matches(/^never$/, {
    message: 'Informe pelo menos um CPF ou CNPJ.',
  })
  private readonly cpfOrCnpjRequiredValidation?: string
}
