import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, MinLength } from 'class-validator'
import { ResetPasswordInput } from '../inputs/reset-password.input'

export class ResetPasswordDto implements ResetPasswordInput {
  @ApiProperty({ description: 'Token' })
  @IsString()
  token!: string

  @ApiProperty({
    description: 'Password (min 8, uppercase, lowercase, number and special character)',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password!: string
}
