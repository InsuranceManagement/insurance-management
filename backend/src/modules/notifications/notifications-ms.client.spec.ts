import { environment } from '@/common/config/environment'
import { JwtService } from '@nestjs/jwt'
import { NotificationsMsClient } from './notifications-ms.client'

describe('NotificationsMsClient.sendEmail', () => {
  const originalEnvironment = { ...environment }

  afterEach(() => {
    Object.assign(environment, originalEnvironment)
    jest.restoreAllMocks()
  })

  it('sends the configured Resend credentials and email payload', async () => {
    environment.NOTIFICATIONS_API_URL = 'https://notifications.example'
    environment.JWT_SECRET = ''
    environment.RESEND_API_KEY = 'test-key'
    environment.RESEND_FROM = 'Example <sender@example.com>'
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response)
    const client = new NotificationsMsClient({} as JwtService)

    await client.sendEmail({
      recipientEmail: 'recipient@example.com',
      subject: 'Novo contato recebido',
      emailBody: '<p>Novo contato.</p>',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://notifications.example/notifications/send')
    expect(JSON.parse(options?.body as string)).toEqual({
      type: 'ResendEmail',
      resendApiKey: 'test-key',
      resendFrom: 'Example <sender@example.com>',
      recipientEmail: 'recipient@example.com',
      subject: 'Novo contato recebido',
      emailBody: '<p>Novo contato.</p>',
    })
  })
})
