import { ListUsersInput } from '@/modules/user/inputs/list-users.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class ListUsersDto implements ListUsersInput {
  @ApiPropertyOptional({ default: 0, description: 'Pagination offset' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  skip?: number

  @ApiPropertyOptional({ default: 10, description: 'Page size limit' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number

  @ApiPropertyOptional({ description: 'Filter by name or e-mail' })
  @IsOptional()
  @IsString()
  searchTerm?: string
}
