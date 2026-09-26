import { AuthSession } from '@/modules/user/dto/auth-response.dto'
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
  HttpException,
  HttpStatus,
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

  async login(input: LoginDto): Promise<AuthSession> {
    const user = await this.userRepository.findByEmail(input.email)

    if (!user?.isActive()) {
      throw new UnauthorizedException('E-mail ou senha inválidos')
    }

    const isPasswordValid = await this.passwordService.compare(input.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos')
    }

    const accessToken = await this.signToken(user)

    return this.buildAuthResponse(user, accessToken)
  }

  async getById(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId)

    if (!user?.isActive()) {
      throw new NotFoundException('Usuário não encontrado')
    }

    return this.toUserResponse(user)
  }

  async update(userId: string, input: UpdateUserDto): Promise<void> {
    const existingUser = await this.userRepository.findById(userId)

    if (!existingUser?.isActive()) {
      throw new NotFoundException('Usuário não encontrado')
    }

    const changesEmail = input.email !== undefined && input.email !== existingUser.email
    const changesPassword = input.password !== undefined

    if (changesEmail || changesPassword) {
      if (!input.currentPassword) {
        throw new BadRequestException('Informe a senha atual para alterar e-mail ou senha')
      }

      const isCurrentPasswordValid = await this.passwordService.compare(
        input.currentPassword,
        existingUser.password,
      )

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Senha atual inválida')
      }
    }

    if (changesEmail && input.email) {
      const emailInUse = await this.userRepository.findByEmail(input.email)
      if (emailInUse && emailInUse.id !== userId) {
        throw new BadRequestException('E-mail já está em uso')
      }
    }

    const updateData = { ...input }
    delete updateData.currentPassword

    if (updateData.password) {
      updateData.password = await this.passwordService.hash(updateData.password)
    }

    await this.userRepository.update(userId, updateData)
  }

  async requestPasswordReset(input: ForgotPasswordDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findByEmail(input.email)

    if (existingUser?.isActive()) {
      const lastRequest = existingUser.passwordResetRequestedAt

      if (lastRequest) {
        const elapsed = Date.now() - lastRequest.getTime()
        const remainingMs = 60_000 - elapsed

        if (remainingMs > 0) {
          throw new HttpException(
            {
              message: 'Aguarde antes de solicitar um novo e-mail de recuperação',
              remainingSeconds: Math.ceil(remainingMs / 1000),
            },
            HttpStatus.TOO_MANY_REQUESTS,
          )
        }
      }

      const { token, tokenHash, expiresAt } = this.passwordResetService.createResetToken()

      await this.userRepository.setPasswordResetToken(existingUser.id, tokenHash, expiresAt)
      await this.passwordResetService.sendPasswordResetNotification(existingUser, token, expiresAt)
      await this.userRepository.updatePasswordResetRequestedAt(existingUser.id)
    }

    return {
      message: 'Se o e-mail estiver cadastrado, enviaremos as instruções para redefinir a senha.',
    }
  }

  async resetPassword(input: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = this.passwordResetService.hashResetToken(input.token)
    const user = await this.userRepository.findByPasswordResetTokenHash(tokenHash)

    if (!user?.isActive()) {
      throw new BadRequestException('Token de redefinição de senha inválido ou expirado')
    }

    if (!user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
      throw new BadRequestException('Token de redefinição de senha inválido ou expirado')
    }

    const hashedPassword = await this.passwordService.hash(input.password)
    await this.userRepository.updatePasswordWithResetToken(user.id, hashedPassword)

    return { message: 'Senha redefinida com sucesso.' }
  }

  private async signToken(user: User): Promise<string> {
    return await this.jwtService.signAsync({
      sub: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }

  private buildAuthResponse(user: User, accessToken: string): AuthSession {
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
