export interface CreateTemplateInput {
  name: string
  description: string | null
  subject: string
  body: string
  variableSchema?: Record<string, string>
  isActive?: boolean
  notificationTypeId?: string
}
