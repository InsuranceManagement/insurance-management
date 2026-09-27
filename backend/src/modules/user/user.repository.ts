import { PrismaService } from '@/modules/database/prisma.service'
import { User } from '@/modules/user/entities/user'
import { UpdateUserInput } from '@/modules/user/inputs/update-user.input'
import { Injectable } from '@nestjs/common'

type UserRecord = {
  id: string
  name: string
  email: string
  password: string
  passwordResetTokenHash: string | null
  passwordResetExpiresAt: Date | null
  passwordResetRequestedAt: Date | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(userId: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    })

    return user ? this.toEntity(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    })

    return user ? this.toEntity(user) : null
  }

  async update(userId: string, input: Omit<UpdateUserInput, 'currentPassword'>): Promise<void> {
    if (input.password) {
      await this.prismaService.$transaction(async (transaction) => {
        await transaction.user.update({ where: { id: userId }, data: { ...input } })
        await transaction.session.updateMany({
          where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
          data: { revokedAt: new Date() },
        })
      })
      return
    }

    await this.prismaService.user.update({ where: { id: userId }, data: { ...input } })
  }

  async findByPasswordResetTokenHash(tokenHash: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: {
          gt: new Date(),
        },
        deletedAt: null,
      },
    })

    return user ? this.toEntity(user) : null
  }

  async setPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: expiresAt,
      },
    })
  }

  async tryRegisterPasswordResetRequest(
    userId: string,
    requestedAt: Date,
    cooldownMs: number,
  ): Promise<boolean> {
    const cooldownThreshold = new Date(requestedAt.getTime() - cooldownMs)
    const result = await this.prismaService.user.updateMany({
      where: {
        id: userId,
        deletedAt: null,
        OR: [
          { passwordResetRequestedAt: null },
          { passwordResetRequestedAt: { lte: cooldownThreshold } },
        ],
      },
      data: { passwordResetRequestedAt: requestedAt },
    })

    return result.count > 0
  }

  async updatePasswordWithResetToken(userId: string, newPassword: string): Promise<void> {
    await this.prismaService.$transaction(async (transaction) => {
      await transaction.user.update({
        where: { id: userId },
        data: {
          password: newPassword,
          passwordResetTokenHash: null,
          passwordResetExpiresAt: null,
        },
      })
      await transaction.session.updateMany({
        where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
        data: { revokedAt: new Date() },
      })
    })
  }

  private toEntity(user: UserRecord): User {
    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.passwordResetTokenHash,
      user.passwordResetExpiresAt,
      user.passwordResetRequestedAt,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    )
  }
}
