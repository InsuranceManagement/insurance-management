import { Module } from '@nestjs/common'
import { PrismaModule } from '../database/prisma.module'
import { VisitController } from './visit.controller'
import { VisitRepository } from './visit.repository'
import { VisitService } from './visit.service'

@Module({
  imports: [PrismaModule],
  controllers: [VisitController],
  providers: [VisitService, VisitRepository],
})
export class VisitModule {}
