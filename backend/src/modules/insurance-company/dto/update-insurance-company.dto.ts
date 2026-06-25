import { UpdateInsuranceCompanyInput } from '@/modules/insurance-company/inputs/update-insurance-company.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, Matches } from 'class-validator'

export class UpdateInsuranceCompanyDto implements UpdateInsuranceCompanyInput {
  @ApiPropertyOptional({ description: 'Company name' })
  @IsOptional()
  @IsString({ message: 'O nome da seguradora deve ser um texto.' })
  name?: string

  @ApiPropertyOptional({ description: 'Company color' })
  @IsOptional()
  @IsString({ message: 'A cor da seguradora deve ser um texto.' })
  @Matches(/^#([0-9a-fA-F]{6})$/, {
    message: 'A cor deve estar no formato hexadecimal #RRGGBB.',
  })
  color?: string
}
