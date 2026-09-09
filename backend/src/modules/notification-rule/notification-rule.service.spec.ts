import { NotificationsMsClient } from '@/modules/notifications/notifications-ms.client'
import { NotificationRule } from './entities/notification-rule'
import {
  NotificationRuleRepository,
  type NotificationRuleClient,
} from './notification-rule.repository'
import { NotificationRuleProcessor } from './notification-rule.processor'
import { NotificationRuleService } from './notification-rule.service'

const christmasRule = new NotificationRule(
  'rule-1',
  'Natal',
  'template-1',
  {
    all: [
      {
        field: 'context.today',
        operator: 'EQUALS',
        value: '2026-12-25',
        isRecurring: true,
      },
    ],
  },
  true,
  new Date('2026-01-01T00:00:00.000Z'),
  new Date('2026-01-01T00:00:00.000Z'),
)

const birthdayRule = new NotificationRule(
  'rule-2',
  'Aniversario',
  'template-2',
  {
    all: [
      {
        field: 'client.birthDate',
        operator: 'EQUALS',
        value: 'context.today',
        isRecurring: true,
      },
    ],
  },
  true,
  new Date('2026-01-01T00:00:00.000Z'),
  new Date('2026-01-01T00:00:00.000Z'),
)

const client: NotificationRuleClient = {
  id: 'client-1',
  name: 'Ana Silva',
  email: 'ana@example.com',
  phoneNumber: '11999999999',
  birthDate: new Date('1990-12-25T12:00:00.000Z'),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
}

describe('NotificationRuleService', () => {
  const repository = {
    listActive: jest.fn(),
    listClients: jest.fn(),
  }
  const notificationsClient = { sendTemplateEmail: jest.fn() }
  const service = new NotificationRuleService(
    repository as unknown as NotificationRuleRepository,
    notificationsClient as unknown as NotificationsMsClient,
    new NotificationRuleProcessor(),
  )

  beforeEach(() => {
    jest.resetAllMocks()
    repository.listClients.mockResolvedValue([client])
    notificationsClient.sendTemplateEmail.mockResolvedValue(undefined)
  })

  it('sends the Christmas rule every year on December 25', async () => {
    repository.listActive.mockResolvedValue([christmasRule])

    await service.executeDailyRules(new Date('2030-12-25T12:00:00.000Z'))

    expect(notificationsClient.sendTemplateEmail).toHaveBeenCalledWith(
      expect.objectContaining({ recipientEmail: client.email, templateId: 'template-1' }),
    )
  })

  it('matches client birthday against the day and month of today', async () => {
    repository.listActive.mockResolvedValue([birthdayRule])

    await service.executeDailyRules(new Date('2030-12-25T12:00:00.000Z'))

    expect(notificationsClient.sendTemplateEmail).toHaveBeenCalledWith(
      expect.objectContaining({ recipientEmail: client.email, templateId: 'template-2' }),
    )
  })

  it('sends an idempotency key scoped to the rule, client, and calendar day', async () => {
    repository.listActive.mockResolvedValue([christmasRule])

    await service.executeDailyRules(new Date('2030-12-25T12:00:00.000Z'))

    expect(notificationsClient.sendTemplateEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        idempotencyKey: 'notification-rule:rule-1:client:client-1:date:2030-12-25',
      }),
    )
  })
})
