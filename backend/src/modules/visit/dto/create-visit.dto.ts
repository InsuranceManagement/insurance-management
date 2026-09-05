import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateVisitDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty()
  @IsString()
  description!: string

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  clientId!: string

  @ApiProperty({ format: 'date-time' })
  @IsDateString({ strict: true })
  date!: string
}
