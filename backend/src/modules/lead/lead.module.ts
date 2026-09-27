import { Module } from '@nestjs/common'
import { PrismaModule } from '../database/prisma.module'
import { LeadController } from './lead.controller'
import { LeadRepository } from './lead.repository'
import { LeadService } from './services/lead.service'

@Module({
  imports: [PrismaModule],
  controllers: [LeadController],
  providers: [LeadService, LeadRepository],
})
export class LeadModule {}

