/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { NotificationRuleModel as PrismaNotificationRule } from '@generated/prisma/models/NotificationRule'
import type { NotificationRuleCondition } from './notification-rule-condition'

export class NotificationRule {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly templateId: string,
    public readonly condition: NotificationRuleCondition,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(rule: PrismaNotificationRule): NotificationRule {
    return new NotificationRule(
      rule.id,
      rule.name,
      rule.templateId,
      rule.condition as unknown as NotificationRuleCondition,
      rule.isActive,
      rule.createdAt,
      rule.updatedAt,
    )
  }
}
