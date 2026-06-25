import { environment } from '@/common/config/environment'
import { User } from '@/modules/user/entities/user'
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { createHash, randomBytes } from 'crypto'

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name)

  constructor(private readonly jwtService: JwtService) {}

  createResetToken(): { token: string; tokenHash: string; expiresAt: Date } {
    const token = this.generatePasswordResetToken()
    const tokenHash = this.hashPasswordResetToken(token)
    const expiresAt = this.buildPasswordResetExpiry()

    return { token, tokenHash, expiresAt }
  }

  hashResetToken(token: string): string {
    return this.hashPasswordResetToken(token)
  }

  async sendPasswordResetNotification(user: User, token: string, expiresAt: Date): Promise<void> {
    if (!environment.NOTIFICATIONS_API_URL) {
      return
    }

    const resetUrl = this.buildPasswordResetUrl(token)
    const expiresAtText = expiresAt.toISOString()

    const emailBody = resetUrl
      ? `<div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111827;">
          <h2 style="margin: 0 0 8px; color: #1d4ed8;">Reset your password</h2>
          <p style="margin: 0 0 16px;">Hello ${user.name},</p>
          <p style="margin: 0 0 20px;">Click the button below to reset your password.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block;">
              Reset password
            </a>
          </div>
          <p style="margin: 16px 0 0; color: #6b7280; font-size: 12px;">
            This link expires at ${expiresAtText}.
          </p>
        </div>`
      : `<div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111827;">
          <h2 style="margin: 0 0 8px; color: #1d4ed8;">Reset your password</h2>
          <p style="margin: 0 0 16px;">Hello ${user.name},</p>
          <p style="margin: 0 0 8px;">Use the code below to reset your password:</p>
          <div style="font-family: 'Courier New', monospace; background: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all;">
            ${token}
          </div>
          <p style="margin: 16px 0 0; color: #6b7280; font-size: 12px;">
            This code expires at ${expiresAtText}.
          </p>
        </div>`

    const payload = {
      type: 'BrevoEmail',
      emailBody,
      recipientEmail: user.email,
      subject: 'Reset password',
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const authHeader = await this.buildNotificationsAuthorization()

    if (authHeader) {
      headers.Authorization = authHeader
    }

    const controller = new AbortController()

    const timeout = setTimeout(() => {
      controller.abort()
    }, 7000)

    try {
      const response = await fetch(`${environment.NOTIFICATIONS_API_URL}/notifications/send`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!response.ok) {
        const responseBody = await response.text()

        this.logger.warn(`Notification service responded with ${response.status}: ${responseBody}`)

        throw new ServiceUnavailableException(
          'Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.',
        )
      }
    } catch (error) {
      clearTimeout(timeout)

      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.warn('Notification service timeout after 7 seconds')

        throw new ServiceUnavailableException(
          'O serviço de notificações demorou para responder. Tente novamente mais tarde.',
        )
      }

      this.logger.warn(`Failed to call notification service: ${String(error)}`)

      if (error instanceof ServiceUnavailableException) {
        throw error
      }

      throw new ServiceUnavailableException(
        'Não foi possível comunicar com o serviço de notificações. Tente novamente mais tarde.',
      )
    }
  }

  private generatePasswordResetToken(): string {
    return randomBytes(32).toString('hex')
  }

  private hashPasswordResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  private buildPasswordResetExpiry(): Date {
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + environment.RESET_PASSWORD_TOKEN_TTL_MINUTES)
    return expiresAt
  }

  private buildPasswordResetUrl(token: string): string | null {
    if (!environment.RESET_PASSWORD_URL) {
      return null
    }

    const separator = environment.RESET_PASSWORD_URL.includes('?') ? '&' : '?'
    return `${environment.RESET_PASSWORD_URL}${separator}token=${encodeURIComponent(token)}`
  }

  private async buildNotificationsAuthorization(): Promise<string | null> {
    if (!environment.JWT_SECRET) {
      return null
    }

    const token = await this.jwtService.signAsync(
      { features: ['notification-service'] },
      {
        secret: environment.JWT_SECRET,
        expiresIn: environment.JWT_EXPIRES_IN_SECONDS,
      },
    )

    return `Bearer ${token}`
  }
}
