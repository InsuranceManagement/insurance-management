import { UpdateUserInput } from '@/modules/user/inputs/update-user.input'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator'

export class UpdateUserDto implements UpdateUserInput {
  @ApiPropertyOptional({ description: 'User name' })
  @IsOptional()
  @IsString({ message: 'O nome do usuário deve ser um texto.' })
  name?: string

  @ApiPropertyOptional({ description: 'User e-mail' })
  @IsOptional()
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email?: string

  @ApiPropertyOptional({
    description: 'Password (min 8, uppercase, lowercase, number and special character)',
  })
  @IsOptional()
  @IsString({ message: 'A senha deve ser um texto.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
  })
  password?: string
}
