import { PrismaService } from '@/modules/database/prisma.service'
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@generated/prisma'
import { NotificationRule } from './entities/notification-rule'
import type { NotificationRuleCondition } from './entities/notification-rule-condition'

export type NotificationRuleClient = Prisma.ClientGetPayload<{
  select: {
    id: true
    name: true
    email: true
    phoneNumber: true
    birthDate: true
    createdAt: true
  }
}>

type NotificationRuleInput = {
  name: string
  templateId: string
  condition: NotificationRuleCondition
  isActive?: boolean
}

@Injectable()
export class NotificationRuleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: NotificationRuleInput): Promise<NotificationRule> {
    const rule = await this.prisma.notificationRule.create({
      data: {
        name: input.name,
        templateId: input.templateId,
        condition: input.condition as Prisma.InputJsonValue,
        isActive: input.isActive,
      },
    })

    return NotificationRule.fromPrisma(rule)
  }

  async list(): Promise<NotificationRule[]> {
    const rules = await this.prisma.notificationRule.findMany({ orderBy: { createdAt: 'desc' } })
    return rules.map((rule) => NotificationRule.fromPrisma(rule))
  }

  async findById(id: string): Promise<NotificationRule | null> {
    const rule = await this.prisma.notificationRule.findUnique({ where: { id } })
    return rule ? NotificationRule.fromPrisma(rule) : null
  }

  async listActive(): Promise<NotificationRule[]> {
    const rules = await this.prisma.notificationRule.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    })
    return rules.map((rule) => NotificationRule.fromPrisma(rule))
  }

  async update(id: string, input: Partial<NotificationRuleInput>): Promise<NotificationRule> {
    const rule = await this.prisma.notificationRule.update({
      where: { id },
      data: {
        name: input.name,
        templateId: input.templateId,
        condition: input.condition as Prisma.InputJsonValue | undefined,
        isActive: input.isActive,
      },
    })

    return NotificationRule.fromPrisma(rule)
  }

  async deleteMany(ids: string[]): Promise<number> {
    const { count } = await this.prisma.notificationRule.deleteMany({ where: { id: { in: ids } } })
    return count
  }

  async listClients(): Promise<NotificationRuleClient[]> {
    return this.prisma.client.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        birthDate: true,
        createdAt: true,
      },
    })
  }
}
