import { PrismaService } from '@/modules/database/prisma.service'
import { User } from '@/modules/user/entities/user'
import { CreateUserInput } from '@/modules/user/inputs/create-user.input'
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

  async create(input: CreateUserInput): Promise<User> {
    const user = await this.prismaService.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
    })

    return this.toEntity(user)
  }

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

  async update(userId: string, input: UpdateUserInput): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...input,
      },
    })
  }

  async softDelete(userId: string): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: new Date(),
        email: `deleted+${userId}@local`,
      },
    })
  }

  async list(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })

    return users.map((user) => this.toEntity(user))
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

  async updatePasswordWithResetToken(userId: string, newPassword: string): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    })
  }

  async updatePasswordResetRequestedAt(userId: string): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordResetRequestedAt: new Date(),
      },
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
