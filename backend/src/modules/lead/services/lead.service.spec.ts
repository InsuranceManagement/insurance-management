import { Lead } from '@/modules/lead/entities/lead'
import { LeadRepository } from '@/modules/lead/lead.repository'
import { LeadService } from '@/modules/lead/services/lead.service'
import { NotFoundException } from '@nestjs/common'

describe('LeadService', () => {
  const repository = {
    create: jest.fn(),
    findById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    softDeleteMany: jest.fn(),
  }
  const service = new LeadService(repository as unknown as LeadRepository)

  const now = new Date('2026-09-27T12:00:00.000Z')
  const activeLead = new Lead('lead-1', 'João Silva', '11999999999', now, now, null)

  beforeEach(() => {
    jest.resetAllMocks()
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
    expect(result).toEqual({
      id: 'lead-1',
      name: 'João Silva',
      phoneNumber: '11999999999',
      createdAt: now,
      updatedAt: now,
    })
  })

  it('gets an active lead by id', async () => {
    repository.findById.mockResolvedValue(activeLead)

    const result = await service.getById('lead-1')

    expect(result.id).toBe('lead-1')
  })

  it('throws NotFoundException when getting a missing lead', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(service.getById('missing')).rejects.toThrow(NotFoundException)
  })

  it('lists active leads', async () => {
    repository.list.mockResolvedValue([activeLead])

    const result = await service.list()

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('João Silva')
  })

  it('updates an existing active lead', async () => {
    repository.findById.mockResolvedValue(activeLead)

    await service.update('lead-1', { name: 'João Atualizado' })

    expect(repository.update).toHaveBeenCalledWith('lead-1', { name: 'João Atualizado' })
  })

  it('throws NotFoundException when updating a missing lead', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(service.update('missing', { name: 'Novo' })).rejects.toThrow(NotFoundException)
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
