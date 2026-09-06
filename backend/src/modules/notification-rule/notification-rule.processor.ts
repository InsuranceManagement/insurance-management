import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import {
  type NotificationRuleClause,
  type NotificationRuleCondition,
} from './entities/notification-rule-condition'

const TIME_ZONE = 'America/Sao_Paulo'

dayjs.extend(utc)
dayjs.extend(timezone)

export class NotificationRuleCalendarDate {
  constructor(
    public readonly fullDate: string,
    public readonly monthDay: string,
  ) {}
}

type NotificationRuleMatchClient = {
  birthDate: Date
  createdAt: Date
}

@Injectable()
export class NotificationRuleProcessor {
  getCalendarDate(date: Date): NotificationRuleCalendarDate {
    const fullDate = dayjs(date).tz(TIME_ZONE).format('YYYY-MM-DD')

    return new NotificationRuleCalendarDate(fullDate, fullDate.slice(5))
  }

  matches(
    condition: NotificationRuleCondition,
    client: NotificationRuleMatchClient,
    calendarDate: NotificationRuleCalendarDate,
  ): boolean {
    const allMatches = (condition.all ?? []).every((clause) =>
      this.matchesClause(clause, client, calendarDate),
    )
    const anyClauses = condition.any ?? []
    const anyMatches =
      anyClauses.length === 0 ||
      anyClauses.some((clause) => this.matchesClause(clause, client, calendarDate))

    return allMatches && anyMatches
  }

  private matchesClause(
    clause: NotificationRuleClause,
    client: NotificationRuleMatchClient,
    calendarDate: NotificationRuleCalendarDate,
  ): boolean {
    const left = this.resolveField(clause.field, client, calendarDate)
    const right = clause.value === 'context.today' ? calendarDate : clause.value

    return this.compareDates(left, right, clause.isRecurring)
  }

  private resolveField(
    field: NotificationRuleClause['field'],
    client: NotificationRuleMatchClient,
    calendarDate: NotificationRuleCalendarDate,
  ): Date | NotificationRuleCalendarDate {
    const fields = {
      'context.today': calendarDate,
      'client.birthDate': client.birthDate,
      'client.createdAt': client.createdAt,
    }

    return fields[field]
  }

  private compareDates(
    left: Date | NotificationRuleCalendarDate,
    right: string | NotificationRuleCalendarDate,
    isRecurring: boolean,
  ): boolean {
    const leftCalendarDate = this.isCalendarDate(left) ? left : this.getCalendarDate(left)
    const rightCalendarDate = this.toComparableCalendarDate(right)
    const leftValue = isRecurring ? leftCalendarDate.monthDay : leftCalendarDate.fullDate
    const rightValue = isRecurring ? rightCalendarDate.monthDay : rightCalendarDate.fullDate

    return leftValue === rightValue
  }

  private toComparableCalendarDate(
    value: string | NotificationRuleCalendarDate,
  ): NotificationRuleCalendarDate {
    if (this.isCalendarDate(value)) return value

    return new NotificationRuleCalendarDate(value, value.slice(5))
  }

  private isCalendarDate(value: unknown): value is NotificationRuleCalendarDate {
    return value instanceof NotificationRuleCalendarDate
  }
}
