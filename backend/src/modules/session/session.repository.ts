import { PrismaService } from '@/modules/database/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SessionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(id: string, userId: string, expiresAt: Date): Promise<void> {
    await this.prismaService.session.create({
      data: { id, userId, expiresAt },
    })
  }

  async replace(
    previousSession: { id: string; userId: string } | undefined,
    id: string,
    userId: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prismaService.$transaction(async (transaction) => {
      if (previousSession) {
        await transaction.session.updateMany({
          where: {
            id: previousSession.id,
            userId: previousSession.userId,
            revokedAt: null,
          },
          data: { revokedAt: new Date() },
        })
      }

      await transaction.session.create({
        data: { id, userId, expiresAt },
      })
    })
  }

  async isActiveForUser(id: string, userId: string, now = new Date()): Promise<boolean> {
    const session = await this.prismaService.session.findUnique({
      where: { id },
      select: {
        userId: true,
        expiresAt: true,
        revokedAt: true,
        user: { select: { deletedAt: true } },
      },
    })

    return Boolean(
      session &&
      session.userId === userId &&
      session.revokedAt === null &&
      session.expiresAt > now &&
      session.user.deletedAt === null,
    )
  }

  async revoke(id: string, userId: string): Promise<void> {
    await this.prismaService.session.updateMany({
      where: { id, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }

  async deleteExpiredOrRevoked(now = new Date()): Promise<number> {
    const { count } = await this.prismaService.session.deleteMany({
      where: {
        OR: [{ expiresAt: { lte: now } }, { revokedAt: { not: null } }],
      },
    })

    return count
  }
}
