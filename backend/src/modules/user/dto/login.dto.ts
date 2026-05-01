import { LoginInput } from '@/modules/user/inputs/login.input'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginDto implements LoginInput {
  @ApiProperty({ description: 'User e-mail' })
  @IsEmail()
  email!: string

  @ApiProperty({ description: 'User password' })
  @IsString()
  password!: string
}
