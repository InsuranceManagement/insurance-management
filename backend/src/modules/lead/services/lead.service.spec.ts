import { Lead } from '@/modules/lead/entities/lead'
import { LeadRepository } from '@/modules/lead/lead.repository'
import { LeadService } from '@/modules/lead/services/lead.service'
import { NotFoundException } from '@nestjs/common'

describe('LeadService', () => {
  const repository = {
    create: jest.fn(),
    list: jest.fn(),
    softDeleteMany: jest.fn(),
  }
  const service = new LeadService(repository as unknown as LeadRepository)

  const now = new Date('2026-09-27T12:00:00.000Z')
  const activeLead = new Lead('lead-1', 'João Silva', '11999999999', now, null)

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
    })
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
