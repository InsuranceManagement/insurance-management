export const notificationRuleFields = [
  'context.today',
  'client.birthDate',
  'client.createdAt',
] as const

export const notificationRuleOperators = ['EQUALS'] as const
export const notificationRuleGroups = ['all', 'any'] as const

export type NotificationRuleField = (typeof notificationRuleFields)[number]
export type NotificationRuleOperator = (typeof notificationRuleOperators)[number]
export type NotificationRuleGroup = (typeof notificationRuleGroups)[number]

export type NotificationRuleClause = {
  field: NotificationRuleField
  operator: NotificationRuleOperator
  value: string
  isRecurring: boolean
}

export type NotificationRuleCondition = Partial<
  Record<NotificationRuleGroup, NotificationRuleClause[]>
>
