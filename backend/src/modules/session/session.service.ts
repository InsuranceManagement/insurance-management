import { Injectable } from '@nestjs/common'
import { SessionRepository } from './session.repository'

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async create(id: string, userId: string, expiresAt: Date): Promise<void> {
    await this.sessionRepository.create(id, userId, expiresAt)
  }

  async replace(
    previousSession: { id: string; userId: string } | undefined,
    id: string,
    userId: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.sessionRepository.replace(previousSession, id, userId, expiresAt)
  }

  async isActiveForUser(id: string, userId: string): Promise<boolean> {
    return await this.sessionRepository.isActiveForUser(id, userId)
  }

  async revoke(id: string, userId: string): Promise<void> {
    await this.sessionRepository.revoke(id, userId)
  }

  async deleteExpiredOrRevoked(): Promise<number> {
    return await this.sessionRepository.deleteExpiredOrRevoked()
  }
}
