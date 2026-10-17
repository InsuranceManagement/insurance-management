import { PrismaModule } from '@/modules/database/prisma.module'
import { LeadController } from '@/modules/lead/lead.controller'
import { LeadRepository } from '@/modules/lead/lead.repository'
import { LeadService } from '@/modules/lead/services/lead.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [PrismaModule],
  controllers: [LeadController],
  providers: [LeadService, LeadRepository],
  exports: [LeadService, LeadRepository],
})
export class LeadModule {}
