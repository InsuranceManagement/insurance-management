import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'Informe um nome válido.' })
  name!: string

  @ApiProperty()
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string

  @ApiProperty({
    description: 'Mínimo de 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
  password!: string
}
