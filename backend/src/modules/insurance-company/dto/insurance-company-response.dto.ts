import { ApiProperty } from '@nestjs/swagger'

export class InsuranceCompanyResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  color!: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}
