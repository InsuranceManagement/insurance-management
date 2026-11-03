import { Cron } from '@nestjs/schedule'
import { Injectable, Logger } from '@nestjs/common'
import { NotificationRuleService } from './notification-rule.service'

@Injectable()
export class NotificationRuleScheduler {
  private readonly logger = new Logger(NotificationRuleScheduler.name)

  constructor(private readonly notificationRuleService: NotificationRuleService) {}

  @Cron('0 0 9 * * *', { timeZone: 'America/Sao_Paulo' })
  async runDailyRules(): Promise<void> {
    try {
      await this.notificationRuleService.executeDailyRules()
    } catch (error) {
      this.logger.error(`Falha ao executar regras diárias: ${String(error)}`)
    }
  }
}
