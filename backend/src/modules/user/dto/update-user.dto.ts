import { UpdateUserInput } from '@/modules/user/inputs/update-user.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator'

export class UpdateUserDto implements UpdateUserInput {
  @ApiPropertyOptional({ description: 'User name' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: 'User e-mail' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({
    description: 'Password (min 8, uppercase, lowercase, number and special character)',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password?: string
}
