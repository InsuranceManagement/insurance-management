import { environment } from '@/common/config/environment'
import {
  NotificationLog,
  type NotificationLogMsPayload,
} from '@/modules/notifications/entities/notification-log'
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

const REQUEST_TIMEOUT_MS = 7000

type MsRequestOptions = {
  method: 'GET' | 'POST' | 'PUT'
  body?: unknown
}

@Injectable()
export class NotificationsMsClient {
  private readonly logger = new Logger(NotificationsMsClient.name)

  constructor(private readonly jwtService: JwtService) {}

  async getNotificationLogs(): Promise<NotificationLog[]> {
    const raw = await this.request<NotificationLogMsPayload[]>('/notifications/', {
      method: 'GET',
    })

    return raw.map((item) => NotificationLog.fromMs(item))
  }

  private async request<T>(path: string, options: MsRequestOptions): Promise<T> {
    if (!environment.NOTIFICATIONS_API_URL) {
      throw new ServiceUnavailableException('Serviço de notificações não está configurado.')
    }

    const headers: Record<string, string> = {}
    const authHeader = await this.buildAuthorizationHeader()

    if (authHeader) {
      headers.Authorization = authHeader
    }

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }

    const controller = new AbortController()

    const timeout = setTimeout(() => {
      controller.abort()
    }, REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(`${environment.NOTIFICATIONS_API_URL}${path}`, {
        method: options.method,
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!response.ok) {
        const responseBody = await response.text()

        this.logger.warn(`Notification service responded with ${response.status}: ${responseBody}`)

        throw new ServiceUnavailableException(
          'Não foi possível obter os dados do serviço de notificações. Tente novamente mais tarde.',
        )
      }

      return (await response.json()) as T
    } catch (error) {
      clearTimeout(timeout)

      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.warn('Notification service timeout after 7 seconds')

        throw new ServiceUnavailableException(
          'O serviço de notificações demorou para responder. Tente novamente mais tarde.',
        )
      }

      if (error instanceof ServiceUnavailableException) {
        throw error
      }

      this.logger.warn(`Failed to call notification service: ${String(error)}`)

      throw new ServiceUnavailableException(
        'Não foi possível comunicar com o serviço de notificações. Tente novamente mais tarde.',
      )
    }
  }

  private async buildAuthorizationHeader(): Promise<string | null> {
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
