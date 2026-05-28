import { AuthResponseDto } from '@/modules/user/dto/auth-response.dto'
import { CreateUserDto } from '@/modules/user/dto/create-user.dto'
import { ForgotPasswordDto } from '@/modules/user/dto/forgot-password.dto'
import { LoginDto } from '@/modules/user/dto/login.dto'
import { ResetPasswordDto } from '@/modules/user/dto/reset-password.dto'
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto'
import { UserResponseDto } from '@/modules/user/dto/user-response.dto'
import { User } from '@/modules/user/entities/user'
import { PasswordService } from '@/modules/user/services/password.service'
import { PasswordResetService } from '@/modules/user/services/passwordReset.service'
import { UserRepository } from '@/modules/user/user.repository'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly passwordResetService: PasswordResetService,
    private readonly jwtService: JwtService,
  ) {}

  async create(input: CreateUserDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(input.email)

    if (existingUser) {
      throw new BadRequestException('E-mail already in use')
    }

    const hashedPassword = await this.passwordService.hash(input.password)
    const user = await this.userRepository.create({ ...input, password: hashedPassword })
    const accessToken = await this.signToken(user)

    return this.buildAuthResponse(user, accessToken)
  }

  async login(input: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(input.email)

    if (!user?.isActive()) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await this.passwordService.compare(input.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = await this.signToken(user)

    return this.buildAuthResponse(user, accessToken)
  }

  async getById(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId)

    if (!user?.isActive()) {
      throw new NotFoundException('User not found')
    }

    return this.toUserResponse(user)
  }

  async list(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.list()

    return users.map((user) => this.toUserResponse(user))
  }

  async update(userId: string, input: UpdateUserDto): Promise<void> {
    const existingUser = await this.userRepository.findById(userId)

    if (!existingUser?.isActive()) {
      throw new NotFoundException('User not found')
    }

    if (input.email && input.email !== existingUser.email) {
      const emailInUse = await this.userRepository.findByEmail(input.email)
      if (emailInUse && emailInUse.id !== userId) {
        throw new BadRequestException('E-mail already in use')
      }
    }

    const updateData: UpdateUserDto = { ...input }

    if (updateData.password) {
      updateData.password = await this.passwordService.hash(updateData.password)
    }

    await this.userRepository.update(userId, updateData)
  }

  async deleteMany(userIds: string[]): Promise<void> {
    if (userIds.length === 0) {
      return
    }

    await this.userRepository.softDeleteMany(userIds)
  }

  async requestPasswordReset(input: ForgotPasswordDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findByEmail(input.email)

    if (existingUser?.isActive()) {
      const { token, tokenHash, expiresAt } = this.passwordResetService.createResetToken()

      await this.userRepository.setPasswordResetToken(existingUser.id, tokenHash, expiresAt)
      await this.passwordResetService.sendPasswordResetNotification(existingUser, token, expiresAt)
    }

    return { message: 'If the email exists, reset instructions will be sent.' }
  }

  async resetPassword(input: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = this.passwordResetService.hashResetToken(input.token)
    const user = await this.userRepository.findByPasswordResetTokenHash(tokenHash)

    if (!user?.isActive()) {
      throw new BadRequestException('Invalid or expired token')
    }

    if (!user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token')
    }

    const hashedPassword = await this.passwordService.hash(input.password)
    await this.userRepository.updatePasswordWithResetToken(user.id, hashedPassword)

    return { message: 'Password updated successfully.' }
  }

  private async signToken(user: User): Promise<string> {
    return await this.jwtService.signAsync({
      sub: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }

  private buildAuthResponse(user: User, accessToken: string): AuthResponseDto {
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  }

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
