import { CreateClientInput } from '@/modules/client/inputs/create-client.input'
import { CnpjValidator } from '@/modules/client/validators/cnpj.validator'
import { CpfValidator } from '@/modules/client/validators/cpf.validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  Validate,
} from 'class-validator'

export class CreateClientDto implements CreateClientInput {
  @ApiProperty({ description: 'Client name' })
  @IsString()
  name!: string

  @ApiProperty({ description: 'Client e-mail' })
  @IsEmail()
  email!: string

  @ApiProperty({ description: 'Client CPF' })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'cpf must contain 11 digits (numbers only)' })
  @Validate(CpfValidator)
  cpf!: string

  @ApiProperty({ description: 'Client CNPJ' })
  @IsString()
  @Matches(/^\d{14}$/, { message: 'cnpj must contain 14 digits (numbers only)' })
  @Validate(CnpjValidator)
  cnpj!: string

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

  @ApiPropertyOptional({ description: 'Product ids linked to the client' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  productIds?: string[]
}
