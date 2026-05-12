import { UpdateClientInput } from '@/modules/client/inputs/update-client.input'
import { CnpjValidator } from '@/modules/client/validators/cnpj.validator'
import { CpfValidator } from '@/modules/client/validators/cpf.validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
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

export class UpdateClientDto implements UpdateClientInput {
  @ApiPropertyOptional({ description: 'Client name' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: 'Client e-mail' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ description: 'Client CPF' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, { message: 'cpf must contain 11 digits (numbers only)' })
  @Validate(CpfValidator)
  cpf?: string

  @ApiPropertyOptional({ description: 'Client CNPJ' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{14}$/, { message: 'cnpj must contain 14 digits (numbers only)' })
  @Validate(CnpjValidator)
  cnpj?: string

  @ApiPropertyOptional({ description: 'Client phone number' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,15}$/, {
    message: 'phoneNumber must contain 10 to 15 digits (numbers only)',
  })
  phoneNumber?: string

  @ApiPropertyOptional({ description: 'Client birth date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  birthDate?: string

  @ApiPropertyOptional({ description: 'Product ids linked to the client' })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  productIds?: string[]
}
