import { NotificationLogResponseDto } from '@/modules/notifications/dto/notification-log-response.dto'
import { NotificationLog } from '@/modules/notifications/entities/notification-log'
import { NotificationsMsClient } from '@/modules/notifications/notifications-ms.client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsMsClient: NotificationsMsClient) {}

  async getLogs(): Promise<NotificationLogResponseDto[]> {
    const logs = await this.notificationsMsClient.getNotificationLogs()
    return logs.map((log) => this.toResponse(log))
  }

  private toResponse(log: NotificationLog): NotificationLogResponseDto {
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
}
