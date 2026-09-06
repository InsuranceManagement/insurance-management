import { DeleteManyDto } from '@/common/dto/delete-many.dto'
import { NotificationsMsClient } from '@/modules/notifications/notifications-ms.client'
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import { CreateNotificationRuleDto } from './dto/create-notification-rule.dto'
import { UpdateNotificationRuleDto } from './dto/update-notification-rule.dto'
import { NotificationRule } from './entities/notification-rule'
import {
  notificationRuleFields,
  notificationRuleGroups,
  notificationRuleOperators,
  type NotificationRuleClause,
  type NotificationRuleCondition,
} from './entities/notification-rule-condition'
import {
  NotificationRuleProcessor,
  type NotificationRuleCalendarDate,
} from './notification-rule.processor'
import {
  NotificationRuleRepository,
  type NotificationRuleClient,
} from './notification-rule.repository'

dayjs.extend(utc)
dayjs.extend(customParseFormat)

@Injectable()
export class NotificationRuleService {
  private readonly logger = new Logger(NotificationRuleService.name)

  constructor(
    private readonly repository: NotificationRuleRepository,
    private readonly notificationsMsClient: NotificationsMsClient,
    private readonly processor: NotificationRuleProcessor,
  ) {}

  async create(input: CreateNotificationRuleDto): Promise<NotificationRule> {
    this.validateCondition(input.condition)
    return this.repository.create(input)
  }

  list(): Promise<NotificationRule[]> {
    return this.repository.list()
  }

  async getById(id: string): Promise<NotificationRule> {
    const rule = await this.repository.findById(id)
    if (!rule) throw new NotFoundException('Regra de notificacao nao encontrada')
    return rule
  }

  async update(id: string, input: UpdateNotificationRuleDto): Promise<NotificationRule> {
    await this.getById(id)
    if (input.condition) this.validateCondition(input.condition)
    return this.repository.update(id, input)
  }

  async delete(input: DeleteManyDto): Promise<void> {
    if (input.ids.length === 0 || !(await this.repository.deleteMany(input.ids))) {
      throw new NotFoundException('Regra de notificacao nao encontrada')
    }
  }

  async preview(id: string, now = new Date()) {
    const rule = await this.getById(id)
    const clients = await this.repository.listClients()
    const calendarDate = this.processor.getCalendarDate(now)
    const recipients = clients.filter((client) =>
      this.processor.matches(rule.condition, client, calendarDate),
    )

    return {
      total: recipients.length,
      clients: recipients.slice(0, 20).map((client) => ({
        id: client.id,
        name: client.name,
        email: client.email,
      })),
    }
  }

  async executeDailyRules(now = new Date()): Promise<void> {
    const [rules, clients] = await Promise.all([
      this.repository.listActive(),
      this.repository.listClients(),
    ])
    const calendarDate = this.processor.getCalendarDate(now)

    for (const rule of rules) {
      for (const client of clients) {
        await this.processClient(rule, client, calendarDate)
      }
    }
  }

  private async processClient(
    rule: NotificationRule,
    client: NotificationRuleClient,
    calendarDate: NotificationRuleCalendarDate,
  ): Promise<void> {
    if (!this.processor.matches(rule.condition, client, calendarDate)) return

    try {
      await this.notificationsMsClient.sendTemplateEmail({
        recipientEmail: client.email,
        templateId: rule.templateId,
        idempotencyKey: `notification-rule:${rule.id}:client:${client.id}:date:${calendarDate.fullDate}`,
        variables: {
          client: {
            id: client.id,
            name: client.name,
            email: client.email,
            phoneNumber: client.phoneNumber,
            birthDate: client.birthDate.toISOString(),
          },
          context: { today: calendarDate.fullDate },
        },
      })
    } catch (error) {
      this.logger.error(
        `Falha ao enviar a regra ${rule.id} para o cliente ${client.id}: ${String(error)}`,
      )
    }
  }

  private validateCondition(condition: NotificationRuleCondition): void {
    const groups = this.getConditionGroups(condition)

    if (!groups.some((group) => group.length)) {
      throw new BadRequestException('A regra deve conter pelo menos uma condicao')
    }

    for (const group of groups) {
      for (const rawClause of group) {
        this.validateClause(rawClause)
      }
    }
  }

  private getConditionGroups(condition: NotificationRuleCondition): NotificationRuleClause[][] {
    const unknownGroup = Object.keys(condition).find(
      (group) => !notificationRuleGroups.includes(group as (typeof notificationRuleGroups)[number]),
    )

    if (unknownGroup) {
      throw new BadRequestException(`Grupo nao permitido: ${unknownGroup}`)
    }

    return notificationRuleGroups.map((groupName) => {
      const group = condition[groupName]
      if (group === undefined) return []
      if (!Array.isArray(group)) {
        throw new BadRequestException(`O grupo ${groupName} deve ser uma lista de condicoes`)
      }
      return group
    })
  }

  private validateClause(rawClause: unknown): void {
    if (!this.isClauseRecord(rawClause)) {
      throw new BadRequestException('Condicao invalida')
    }

    const clause = rawClause as NotificationRuleClause
    if (!notificationRuleFields.includes(clause.field)) {
      throw new BadRequestException(`Campo nao permitido: ${String(clause.field)}`)
    }
    if (!notificationRuleOperators.includes(clause.operator)) {
      throw new BadRequestException(`Operador nao permitido: ${String(clause.operator)}`)
    }
    if (typeof clause.value !== 'string' || !this.isDateValue(clause.value)) {
      throw new BadRequestException('O valor deve ser context.today ou uma data YYYY-MM-DD')
    }
    if (typeof clause.isRecurring !== 'boolean') {
      throw new BadRequestException('isRecurring deve ser booleano')
    }
    if (clause.field === 'context.today' && clause.value === 'context.today') {
      throw new BadRequestException('context.today deve ser comparado a uma data YYYY-MM-DD')
    }
  }

  private isClauseRecord(value: unknown): value is Record<string, unknown> {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      'field' in value &&
      'operator' in value &&
      'value' in value &&
      'isRecurring' in value
    )
  }

  private isDateValue(value: string): boolean {
    if (value === 'context.today') return true
    return dayjs.utc(value, 'YYYY-MM-DD', true).isValid()
  }
}
