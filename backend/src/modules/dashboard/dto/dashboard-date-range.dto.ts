import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional } from 'class-validator'
import { DashboardDateRangeInput } from '../inputs/dashboard-date-range.input'

export class DashboardDateRangeDto implements DashboardDateRangeInput {
  @ApiPropertyOptional({
    format: 'date-time',
    description: 'Inclusive start of the dashboard period',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  startDate?: string

  @ApiPropertyOptional({
    format: 'date-time',
    description: 'Inclusive end of the dashboard period',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  endDate?: string
}
