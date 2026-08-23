import {
  NotificationRelation,
  type NotificationRelationMsPayload,
} from '@/modules/notifications/entities/notification-relation'

type NotificationLogMsPayload = {
  id: string
  recipient: string
  sent_by: string
  body: string
  error_message: string | null
  timestamp: string
  notification_status_id: string
  notification_status?: NotificationRelationMsPayload | null
  notification_type_id: string
  notification_type?: NotificationRelationMsPayload | null
}

export class NotificationLog {
  constructor(
    public readonly id: string,
    public readonly recipient: string,
    public readonly sentBy: string,
    public readonly body: string,
    public readonly errorMessage: string | null,
    public readonly timestamp: Date,
    public readonly notificationStatusId: string,
    public readonly notificationTypeId: string,
    public readonly notificationStatus: NotificationRelation | null,
    public readonly notificationType: NotificationRelation | null,
  ) {}

  static fromMs(raw: NotificationLogMsPayload): NotificationLog {
    return new NotificationLog(
      raw.id,
      raw.recipient,
      raw.sent_by,
      raw.body,
      raw.error_message ?? null,
      new Date(raw.timestamp),
      raw.notification_status_id,
      raw.notification_type_id,
      raw.notification_status ? NotificationRelation.fromMs(raw.notification_status) : null,
      raw.notification_type ? NotificationRelation.fromMs(raw.notification_type) : null,
    )
  }
}

export type { NotificationLogMsPayload }
