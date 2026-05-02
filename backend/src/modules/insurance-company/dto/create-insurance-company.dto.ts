import { CreateInsuranceCompanyInput } from '@/modules/insurance-company/inputs/create-insurance-company.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches } from 'class-validator'

export class CreateInsuranceCompanyDto implements CreateInsuranceCompanyInput {
  @ApiProperty({ description: 'Company name' })
  @IsString()
  name!: string

  @ApiProperty({ description: 'Company color' })
  @IsString()
  @Matches(/^#([0-9a-fA-F]{6})$/, {
    message: 'color must be a hex value like #RRGGBB',
  })
  color!: string
}
