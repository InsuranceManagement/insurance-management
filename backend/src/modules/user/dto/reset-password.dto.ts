import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, MinLength } from 'class-validator'
import { ResetPasswordInput } from '../inputs/reset-password.input'

export class ResetPasswordDto implements ResetPasswordInput {
  @ApiProperty({ description: 'Token' })
  @IsString()
  token!: string

  @ApiProperty({ description: 'Password' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter and one number',
  })
  password!: string
}
