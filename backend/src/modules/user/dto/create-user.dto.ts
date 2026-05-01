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

  @ApiProperty({ description: 'Password (min 8, uppercase, lowercase and number)' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter and one number',
  })
  password!: string
}
