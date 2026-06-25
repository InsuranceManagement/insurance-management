import { CreateUserInput } from '@/modules/user/inputs/create-user.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class CreateUserDto implements CreateUserInput {
  @ApiProperty({ description: 'User name' })
  @IsString()
  name!: string

  @ApiProperty({ description: 'User e-mail' })
  @IsEmail()
  email!: string

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
