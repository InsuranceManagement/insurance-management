import { Module } from '@nestjs/common'
import { PrismaModule } from '../database/prisma.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { NotificationRuleController } from './notification-rule.controller'
import { NotificationRuleProcessor } from './notification-rule.processor'
import { NotificationRuleRepository } from './notification-rule.repository'
import { NotificationRuleScheduler } from './notification-rule.scheduler'
import { NotificationRuleService } from './notification-rule.service'

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [NotificationRuleController],
  providers: [
    NotificationRuleService,
    NotificationRuleProcessor,
    NotificationRuleRepository,
    NotificationRuleScheduler,
  ],
})
export class NotificationRuleModule {}
