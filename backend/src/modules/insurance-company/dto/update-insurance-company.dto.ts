import { UpdateInsuranceCompanyInput } from '@/modules/insurance-company/inputs/update-insurance-company.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, Matches } from 'class-validator'

export class UpdateInsuranceCompanyDto implements UpdateInsuranceCompanyInput {
  @ApiPropertyOptional({ description: 'Company name' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: 'Company color' })
  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{6})$/, {
    message: 'color must be a hex value like #RRGGBB',
  })
  color?: string
}
