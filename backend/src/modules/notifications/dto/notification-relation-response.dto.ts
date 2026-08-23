import { ApiProperty } from '@nestjs/swagger'

export class NotificationRelationResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string
}
