import { NotificationRelationResponseDto } from '@/modules/notifications/dto/notification-relation-response.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class TemplateResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiPropertyOptional({ type: String, nullable: true })
  description!: string | null

  @ApiProperty()
  subject!: string

  @ApiProperty()
  body!: string

  @ApiPropertyOptional({ nullable: true })
  variableSchema!: Record<string, string> | null

  @ApiProperty()
  isActive!: boolean

  @ApiProperty()
  createdAt!: Date

  @ApiPropertyOptional({ type: Date, nullable: true })
  updatedAt!: Date | null

  @ApiProperty()
  notificationTypeId!: string

  @ApiPropertyOptional({ type: () => NotificationRelationResponseDto, nullable: true })
  notificationType!: NotificationRelationResponseDto | null
}
