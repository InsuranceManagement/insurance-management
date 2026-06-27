import { CreateUserInput } from '@/modules/user/inputs/create-user.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class CreateUserDto implements CreateUserInput {
  @ApiProperty({ description: 'User name' })
  @IsString({ message: 'O nome do usuário deve ser um texto.' })
  name!: string

  @ApiProperty({ description: 'User e-mail' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string

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
