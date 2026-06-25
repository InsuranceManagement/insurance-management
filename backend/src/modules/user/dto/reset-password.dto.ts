import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, MinLength } from 'class-validator'
import { ResetPasswordInput } from '../inputs/reset-password.input'

export class ResetPasswordDto implements ResetPasswordInput {
  @ApiProperty({ description: 'Token' })
  @IsString({ message: 'O token de redefinição de senha deve ser um texto.' })
  token!: string

  @ApiProperty({
    description: 'Password (min 8, uppercase, lowercase, number and special character)',
  })
  @IsString({ message: 'A senha deve ser um texto.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
  })
  password!: string
}
