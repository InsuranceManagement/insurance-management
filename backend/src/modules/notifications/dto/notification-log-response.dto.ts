import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

class NotificationLogRelationResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string
}

export class NotificationLogResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  recipient!: string

  @ApiProperty()
  sentBy!: string

  @ApiProperty()
  body!: string

  @ApiPropertyOptional({ nullable: true })
  errorMessage!: string | null

  @ApiProperty()
  timestamp!: Date

  @ApiProperty()
  notificationStatusId!: string

  @ApiPropertyOptional({ type: () => NotificationLogRelationResponseDto, nullable: true })
  notificationStatus!: NotificationLogRelationResponseDto | null

  @ApiProperty()
  notificationTypeId!: string

  @ApiPropertyOptional({ type: () => NotificationLogRelationResponseDto, nullable: true })
  notificationType!: NotificationLogRelationResponseDto | null
}
