import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional } from 'class-validator'

export class ListVisitsDto {
  @ApiPropertyOptional({ format: 'date-time', description: 'Inclusive lower bound for visit date' })
  @IsOptional()
  @IsDateString({ strict: true })
  startDate?: string

  @ApiPropertyOptional({ format: 'date-time', description: 'Inclusive upper bound for visit date' })
  @IsOptional()
  @IsDateString({ strict: true })
  endDate?: string
}
