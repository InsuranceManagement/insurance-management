import { ApiProperty } from '@nestjs/swagger'

export class CsrfResponseDto {
  @ApiProperty({ description: 'Token used in the X-CSRF-Token header' })
  csrfToken!: string
}
