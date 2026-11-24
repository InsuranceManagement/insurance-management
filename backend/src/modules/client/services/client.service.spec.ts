import { ClientRepository } from '@/modules/client/client.repository'
import { ClientAddress } from '@/modules/client/entities/client-address'
import { Client } from '@/modules/client/entities/client'
import { ClientService } from '@/modules/client/services/client.service'
import { NotificationsMsClient } from '@/modules/notifications/notifications-ms.client'
import { BadRequestException, NotFoundException, ServiceUnavailableException } from '@nestjs/common'

describe('ClientService.sendEmail', () => {
  const clientRepository = {
    findById: jest.fn(),
  }
  const notificationsMsClient = {
    sendEmail: jest.fn(),
    sendTemplateEmail: jest.fn(),
  }

  const service = new ClientService(
    clientRepository as unknown as ClientRepository,
    notificationsMsClient as unknown as NotificationsMsClient,
  )

  const birthDate = new Date('1990-05-15T00:00:00.000Z')
  const now = new Date('2026-06-01T12:00:00.000Z')
  const address: ClientAddress = {
    id: 'addr-1',
    cep: '20000000',
    street: 'Rua A',
    district: 'Centro',
    state: 'RJ',
    city: 'Rio de Janeiro',
    number: '100',
    complement: null,
    createdAt: now,
    updatedAt: now,
  }

  const activeClient = new Client(
    'client-1',
    'Maria Oliveira',
    'maria@example.com',
    '12345678909',
    null,
    '21999998888',
    birthDate,
    now,
    now,
    null,
    address,
  )

  beforeEach(() => {
    jest.resetAllMocks()
    clientRepository.findById.mockResolvedValue(activeClient)
    notificationsMsClient.sendEmail.mockResolvedValue(undefined)
    notificationsMsClient.sendTemplateEmail.mockResolvedValue(undefined)
  })

  it('sends a custom email with escaped HTML paragraphs', async () => {
    await service.sendEmail('client-1', {
      subject: '  Atualização de apólice  ',
      message: 'Olá <script> & "teste"\nsegunda linha\n\nSegundo parágrafo',
    })

    expect(clientRepository.findById).toHaveBeenCalledWith('client-1')
    expect(notificationsMsClient.sendEmail).toHaveBeenCalledWith({
      recipientEmail: 'maria@example.com',
      subject: 'Atualização de apólice',
      emailBody:
        '<p>Olá &lt;script&gt; &amp; &quot;teste&quot;<br>segunda linha</p><p>Segundo parágrafo</p>',
    })
    expect(notificationsMsClient.sendTemplateEmail).not.toHaveBeenCalled()
  })

  it('sends a template email with client template variables', async () => {
    await service.sendEmail('client-1', {
      templateId: 'tpl-123',
    })

    expect(notificationsMsClient.sendTemplateEmail).toHaveBeenCalledWith({
      recipientEmail: 'maria@example.com',
      templateId: 'tpl-123',
      templateVariables: {
        'client.id': 'client-1',
        'client.name': 'Maria Oliveira',
        'client.email': 'maria@example.com',
        'client.phoneNumber': '21999998888',
        'client.birthDate': birthDate.toISOString(),
        'context.today': expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      },
    })
    expect(notificationsMsClient.sendEmail).not.toHaveBeenCalled()
  })

  it('throws NotFoundException when client does not exist or is inactive', async () => {
    clientRepository.findById.mockResolvedValueOnce(null)

    await expect(
      service.sendEmail('missing-client', { subject: 'Oi', message: 'Tudo bem?' }),
    ).rejects.toThrow(NotFoundException)

    const deletedClient = new Client(
      'client-2',
      'Inativo',
      'inativo@example.com',
      null,
      null,
      '21999998888',
      birthDate,
      now,
      now,
      now,
      address,
    )
    clientRepository.findById.mockResolvedValueOnce(deletedClient)

    await expect(
      service.sendEmail('client-2', { subject: 'Oi', message: 'Tudo bem?' }),
    ).rejects.toThrow(NotFoundException)

    expect(notificationsMsClient.sendEmail).not.toHaveBeenCalled()
    expect(notificationsMsClient.sendTemplateEmail).not.toHaveBeenCalled()
  })

  it('throws BadRequestException when client has no email', async () => {
    const clientWithoutEmail = new Client(
      'client-3',
      'Sem Email',
      '   ',
      '12345678909',
      null,
      '21999998888',
      birthDate,
      now,
      now,
      null,
      address,
    )
    clientRepository.findById.mockResolvedValue(clientWithoutEmail)

    await expect(
      service.sendEmail('client-3', { subject: 'Oi', message: 'Mensagem' }),
    ).rejects.toThrow(BadRequestException)
  })

  it('throws BadRequestException when both templateId and custom content are sent', async () => {
    await expect(
      service.sendEmail('client-1', {
        templateId: 'tpl-123',
        subject: 'Assunto',
        message: 'Mensagem',
      }),
    ).rejects.toThrow(BadRequestException)
  })

  it('throws BadRequestException when neither templateId nor custom subject/message are sent', async () => {
    await expect(service.sendEmail('client-1', {})).rejects.toThrow(BadRequestException)
  })

  it('propagates errors from NotificationsMsClient', async () => {
    notificationsMsClient.sendEmail.mockRejectedValue(
      new ServiceUnavailableException('Serviço indisponível'),
    )

    await expect(
      service.sendEmail('client-1', { subject: 'Assunto', message: 'Mensagem' }),
    ).rejects.toThrow(ServiceUnavailableException)
  })
})
