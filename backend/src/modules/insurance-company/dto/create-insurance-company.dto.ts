import { CreateInsuranceCompanyInput } from '@/modules/insurance-company/inputs/create-insurance-company.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches } from 'class-validator'

export class CreateInsuranceCompanyDto implements CreateInsuranceCompanyInput {
  @ApiProperty({ description: 'Company name' })
  @IsString({ message: 'O nome da seguradora deve ser um texto.' })
  name!: string

  @ApiProperty({ description: 'Company color' })
  @IsString({ message: 'A cor da seguradora deve ser um texto.' })
  @Matches(/^#([0-9a-fA-F]{6})$/, {
    message: 'A cor deve estar no formato hexadecimal #RRGGBB.',
  })
  color!: string
}
