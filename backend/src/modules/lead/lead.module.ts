import { PrismaModule } from '@/modules/database/prisma.module'
import { LeadController } from '@/modules/lead/lead.controller'
import { LeadRepository } from '@/modules/lead/lead.repository'
import { LeadService } from '@/modules/lead/services/lead.service'
import { ClientModule } from '@/modules/client/client.module'
import { NotificationsModule } from '@/modules/notifications/notifications.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [PrismaModule, ClientModule, NotificationsModule],
  controllers: [LeadController],
  providers: [LeadService, LeadRepository],
  exports: [LeadService, LeadRepository],
})
export class LeadModule {}
