type NotificationLogRelationMsPayload = {
  id: string
  name: string
}

type NotificationLogMsPayload = {
  id: string
  recipient: string
  sent_by: string
  body: string
  error_message: string | null
  timestamp: string
  notification_status_id: string
  notification_status?: NotificationLogRelationMsPayload | null
  notification_type_id: string
  notification_type?: NotificationLogRelationMsPayload | null
}

export class NotificationLogRelation {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}
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
    public readonly notificationStatus: NotificationLogRelation | null,
    public readonly notificationType: NotificationLogRelation | null,
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
      raw.notification_status
        ? new NotificationLogRelation(raw.notification_status.id, raw.notification_status.name)
        : null,
      raw.notification_type
        ? new NotificationLogRelation(raw.notification_type.id, raw.notification_type.name)
        : null,
    )
  }
}

export type { NotificationLogMsPayload }
