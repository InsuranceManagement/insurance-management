import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { SessionService } from './session.service'

@Injectable()
export class SessionScheduler {
  private readonly logger = new Logger(SessionScheduler.name)

  constructor(private readonly sessionService: SessionService) {}

  @Cron('0 0 2 * * 0', { timeZone: 'America/Sao_Paulo' })
  async deleteExpiredOrRevokedSessions(): Promise<void> {
    try {
      await this.sessionService.deleteExpiredOrRevoked()
    } catch {
      this.logger.error('Falha ao limpar sessoes expiradas ou revogadas')
    }
  }
}
