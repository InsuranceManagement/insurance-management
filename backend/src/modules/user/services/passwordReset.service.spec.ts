import { environment } from '@/common/config/environment'
import { User } from '@/modules/user/entities/user'
import { JwtService } from '@nestjs/jwt'
import { PasswordResetService } from './passwordReset.service'

describe('PasswordResetService notification', () => {
  const originalEnvironment = { ...environment }
  const user = { name: 'Example', email: 'recipient@example.com' } as User
  const service = new PasswordResetService({} as JwtService)

  afterEach(() => {
    Object.assign(environment, originalEnvironment)
    jest.restoreAllMocks()
  })

  it('sends a ResendEmail payload with the configured administrative sender', async () => {
    environment.NOTIFICATIONS_API_URL = 'https://notifications.example'
    environment.RESEND_API_KEY = 'test-key'
    environment.RESEND_FROM = 'Admin <admin@example.com>'
    environment.JWT_SECRET = ''
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as Response)

    await service.sendPasswordResetNotification(user, 'token', new Date('2026-01-01T00:00:00Z'))

    const options = fetchMock.mock.calls[0][1] as RequestInit
    const payload = JSON.parse(options.body as string) as Record<string, unknown>
    expect(payload).toEqual(
      expect.objectContaining({
        type: 'ResendEmail',
        resendApiKey: 'test-key',
        resendFrom: 'Admin <admin@example.com>',
        recipientEmail: user.email,
        subject: 'Reset password',
        emailBody: expect.any(String) as string,
      }),
    )
    expect(payload).not.toHaveProperty('mailFromName')
  })

  it('does not call the notification service without Resend configuration', async () => {
    environment.NOTIFICATIONS_API_URL = 'https://notifications.example'
    environment.RESEND_API_KEY = ''
    const fetchMock = jest.spyOn(global, 'fetch')

    await expect(service.sendPasswordResetNotification(user, 'token', new Date())).rejects.toThrow(
      'Envio de e-mail não está configurado.',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
