import { NotificationRelationResponseDto } from '@/modules/notifications/dto/notification-relation-response.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class NotificationLogResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  recipient!: string

  @ApiProperty()
  sentBy!: string

  @ApiProperty()
  body!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  errorMessage!: string | null

  @ApiProperty()
  timestamp!: Date

  @ApiProperty()
  notificationStatusId!: string

  @ApiPropertyOptional({ type: () => NotificationRelationResponseDto, nullable: true })
  notificationStatus!: NotificationRelationResponseDto | null

  @ApiProperty()
  notificationTypeId!: string

  @ApiPropertyOptional({ type: () => NotificationRelationResponseDto, nullable: true })
  notificationType!: NotificationRelationResponseDto | null
}
