import {
  NotificationRelation,
  type NotificationRelationMsPayload,
} from '@/modules/notifications/entities/notification-relation'

type TemplateMsPayload = {
  id: string
  name: string
  description: string | null
  subject: string
  body: string
  variable_schema: Record<string, string> | null
  is_active: boolean
  created_at: string
  updated_at: string | null
  notification_type_id: string
  notification_type?: NotificationRelationMsPayload | null
}

export class Template {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly subject: string,
    public readonly body: string,
    public readonly variableSchema: Record<string, string> | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date | null,
    public readonly notificationTypeId: string,
    public readonly notificationType: NotificationRelation | null,
  ) {}

  static fromMs(raw: TemplateMsPayload): Template {
    return new Template(
      raw.id,
      raw.name,
      raw.description ?? null,
      raw.subject,
      raw.body,
      raw.variable_schema ?? null,
      raw.is_active,
      new Date(raw.created_at),
      raw.updated_at ? new Date(raw.updated_at) : null,
      raw.notification_type_id,
      raw.notification_type ? NotificationRelation.fromMs(raw.notification_type) : null,
    )
  }
}

export type { TemplateMsPayload }
