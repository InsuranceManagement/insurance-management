import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'
import type { NotificationRuleCondition } from '../entities/notification-rule-condition'

export class CreateNotificationRuleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  templateId!: string

  @ApiProperty({ type: Object })
  @IsObject()
  condition!: NotificationRuleCondition

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
