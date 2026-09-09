import { type EntityWithName } from "@/shared/models/entity"

export const notificationRuleGroups = ["all", "any"] as const
export const notificationRuleFields = [
  "context.today",
  "client.birthDate",
  "client.createdAt",
] as const
export const notificationRuleOperators = ["EQUALS"] as const

export type NotificationRuleGroup = (typeof notificationRuleGroups)[number]
export type NotificationRuleField = (typeof notificationRuleFields)[number]
export type NotificationRuleOperator = (typeof notificationRuleOperators)[number]

export const notificationRuleGroupLabels: Record<NotificationRuleGroup, string> = {
  all: "Todas as condições",
  any: "Qualquer condição",
}

export const notificationRuleFieldLabels: Record<NotificationRuleField, string> = {
  "context.today": "Data atual",
  "client.birthDate": "Data de nascimento",
  "client.createdAt": "Data de cadastro",
}

export const notificationRuleOperatorLabels: Record<NotificationRuleOperator, string> = {
  EQUALS: "É igual a",
}

export type NotificationRuleClause = {
  field: NotificationRuleField
  operator: NotificationRuleOperator
  value: string
  isRecurring: boolean
}

export type NotificationRuleCondition = Partial<
  Record<NotificationRuleGroup, NotificationRuleClause[]>
>

export interface NotificationRule extends EntityWithName {
  templateId: string
  condition: NotificationRuleCondition
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type NotificationRuleFormCondition = NotificationRuleClause

export type NotificationRuleUpsertPayload = {
  name: string
  templateId: string
  condition: NotificationRuleCondition
  isActive: boolean
}

export type NotificationTemplate = {
  id: string
  name: string
  subject: string
  isActive: boolean
}
