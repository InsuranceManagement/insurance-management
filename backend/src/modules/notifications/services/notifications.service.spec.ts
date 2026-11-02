import { CreateTemplateDto } from '@/modules/notifications/dto/create-template.dto'
import { NotificationsMsClient } from '@/modules/notifications/notifications-ms.client'
import { NotificationsService } from './notifications.service'

describe('NotificationsService.createTemplate', () => {
  const client = { createTemplate: jest.fn() }
  const service = new NotificationsService(client as unknown as NotificationsMsClient)
  const input: CreateTemplateDto = {
    name: 'Example',
    description: null,
    subject: 'Subject',
    body: 'Hello',
  }

  beforeEach(() => {
    client.createTemplate.mockReset()
    client.createTemplate.mockResolvedValue({})
  })

  it('uses the ResendEmail type when no type is provided', async () => {
    await service.createTemplate(input)

    expect(client.createTemplate).toHaveBeenCalledWith({
      ...input,
      notificationTypeId: 'ResendEmail',
    })
  })

  it('preserves an explicitly provided notification type', async () => {
    await service.createTemplate({ ...input, notificationTypeId: 'Email' })

    expect(client.createTemplate).toHaveBeenCalledWith({
      ...input,
      notificationTypeId: 'Email',
    })
  })
})
