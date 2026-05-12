import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'
import { ForgotPasswordInput } from '../inputs/forgot-password.input'

export class ForgotPassword implements ForgotPasswordInput {
  @ApiProperty({ description: 'Email' })
  @IsEmail()
  email!: string
}
