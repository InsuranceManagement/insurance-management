import { CreateTemplateDto } from '@/modules/notifications/dto/create-template.dto'
import { NotificationLogResponseDto } from '@/modules/notifications/dto/notification-log-response.dto'
import { TemplateResponseDto } from '@/modules/notifications/dto/template-response.dto'
import { UpdateTemplateDto } from '@/modules/notifications/dto/update-template.dto'
import { NotificationLog } from '@/modules/notifications/entities/notification-log'
import { Template } from '@/modules/notifications/entities/template'
import { NotificationsMsClient } from '@/modules/notifications/notifications-ms.client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsMsClient: NotificationsMsClient) {}

  async getLogs(): Promise<NotificationLogResponseDto[]> {
    const logs = await this.notificationsMsClient.getNotificationLogs()
    return logs.map((log) => this.toLogResponse(log))
  }

  async createTemplate(input: CreateTemplateDto): Promise<TemplateResponseDto> {
    const template = await this.notificationsMsClient.createTemplate(input)
    return this.toTemplateResponse(template)
  }

  async updateTemplate(templateId: string, input: UpdateTemplateDto): Promise<TemplateResponseDto> {
    const template = await this.notificationsMsClient.updateTemplate(templateId, input)
    return this.toTemplateResponse(template)
  }

  private toLogResponse(log: NotificationLog): NotificationLogResponseDto {
    return {
      id: log.id,
      recipient: log.recipient,
      sentBy: log.sentBy,
      body: log.body,
      errorMessage: log.errorMessage,
      timestamp: log.timestamp,
      notificationStatusId: log.notificationStatusId,
      notificationStatus: log.notificationStatus,
      notificationTypeId: log.notificationTypeId,
      notificationType: log.notificationType,
    }
  }

  private toTemplateResponse(template: Template): TemplateResponseDto {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      subject: template.subject,
      body: template.body,
      variableSchema: template.variableSchema,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      notificationTypeId: template.notificationTypeId,
      notificationType: template.notificationType,
    }
  }
}
