import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'
import { ForgotPasswordInput } from '../inputs/forgot-password.input'

export class ForgotPasswordDto implements ForgotPasswordInput {
  @ApiProperty({ description: 'Email' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string
}
