import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { ResetPasswordInput } from '../inputs/reset-password.input'

export class ResetPassword implements ResetPasswordInput {
  @ApiProperty({ description: 'Token' })
  token!: string

  @ApiProperty({ description: 'Password' })
  @IsString()
  password!: string
}
