import { Lead } from '@/modules/lead/entities/lead'
import { LeadRepository } from '@/modules/lead/lead.repository'
import { LeadService } from '@/modules/lead/services/lead.service'
import { environment } from '@/common/config/environment'
import { NotificationsMsClient } from '@/modules/notifications/notifications-ms.client'
import { NotFoundException } from '@nestjs/common'

describe('LeadService', () => {
  const repository = {
    create: jest.fn(),
    list: jest.fn(),
    softDeleteMany: jest.fn(),
  }
  const notifications = { sendEmail: jest.fn() }
  const service = new LeadService(
    repository as unknown as LeadRepository,
    notifications as unknown as NotificationsMsClient,
  )
  const originalRecipient = environment.LEAD_NOTIFICATION_EMAIL

  const now = new Date('2026-09-27T12:00:00.000Z')
  const activeLead = new Lead('lead-1', 'João Silva', '11999999999', now, null)

  beforeEach(() => {
    jest.resetAllMocks()
    environment.LEAD_NOTIFICATION_EMAIL = 'leads@example.com'
    notifications.sendEmail.mockResolvedValue(undefined)
  })

  afterAll(() => {
    environment.LEAD_NOTIFICATION_EMAIL = originalRecipient
  })

  it('creates a lead and maps to response dto', async () => {
    repository.create.mockResolvedValue(activeLead)

    const result = await service.create({
      name: 'João Silva',
      phoneNumber: '11999999999',
    })

    expect(repository.create).toHaveBeenCalledWith({
      name: 'João Silva',
      phoneNumber: '11999999999',
    })
    expect(notifications.sendEmail).toHaveBeenCalledWith({
      recipientEmail: 'leads@example.com',
      subject: 'Novo contato recebido',
      emailBody:
        '<p>Uma pessoa entrou em contato.</p><p>Nome: João Silva<br>Telefone: 11999999999</p>',
    })
    expect(result).toEqual({
      id: 'lead-1',
      name: 'João Silva',
      phoneNumber: '11999999999',
      createdAt: now,
    })
  })

  it('escapes HTML in the contact name', async () => {
    repository.create.mockResolvedValue(
      new Lead('lead-2', '<script> & "test"', '11999999999', now, null),
    )

    await service.create({ name: '<script> & "test"', phoneNumber: '11999999999' })

    expect(notifications.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        emailBody:
          '<p>Uma pessoa entrou em contato.</p><p>Nome: &lt;script&gt; &amp; &quot;test&quot;<br>Telefone: 11999999999</p>',
      }),
    )
  })

  it('preserves the successful lead creation if sending fails', async () => {
    repository.create.mockResolvedValue(activeLead)
    notifications.sendEmail.mockRejectedValue(new Error('service unavailable'))

    await expect(
      service.create({ name: 'João Silva', phoneNumber: '11999999999' }),
    ).resolves.toMatchObject({ id: 'lead-1' })
  })

  it('does not send an email when lead creation fails', async () => {
    repository.create.mockRejectedValue(new Error('database unavailable'))

    await expect(
      service.create({ name: 'João Silva', phoneNumber: '11999999999' }),
    ).rejects.toThrow()
    expect(notifications.sendEmail).not.toHaveBeenCalled()
  })

  it('does not send an email if the recipient is not configured', async () => {
    environment.LEAD_NOTIFICATION_EMAIL = ''
    repository.create.mockResolvedValue(activeLead)

    await service.create({ name: 'João Silva', phoneNumber: '11999999999' })
    expect(notifications.sendEmail).not.toHaveBeenCalled()
  })

  it('lists active leads', async () => {
    repository.list.mockResolvedValue([activeLead])

    const result = await service.list()

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('João Silva')
  })

  it('soft deletes leads by ids', async () => {
    repository.softDeleteMany.mockResolvedValue(1)

    await service.delete(['lead-1'])

    expect(repository.softDeleteMany).toHaveBeenCalledWith(['lead-1'])
  })

  it('throws NotFoundException when soft delete affects zero records', async () => {
    repository.softDeleteMany.mockResolvedValue(0)

    await expect(service.delete(['missing'])).rejects.toThrow(NotFoundException)
  })
})
