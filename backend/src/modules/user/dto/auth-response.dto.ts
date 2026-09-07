import { ApiProperty } from '@nestjs/swagger'

export class AuthUserDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string
}

export class AuthResponseDto {
  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto
}

export type AuthSession = AuthResponseDto & {
  accessToken: string
}
