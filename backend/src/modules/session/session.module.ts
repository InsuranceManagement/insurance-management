import { Module } from '@nestjs/common'
import { PrismaModule } from '@/modules/database/prisma.module'
import { SessionRepository } from './session.repository'
import { SessionScheduler } from './session.scheduler'
import { SessionService } from './session.service'

@Module({
  imports: [PrismaModule],
  providers: [SessionRepository, SessionService, SessionScheduler],
  exports: [SessionService],
})
export class SessionModule {}
