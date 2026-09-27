import { CreateLeadDto } from '@/modules/lead/dto/create-lead.dto'
import { LeadResponseDto } from '@/modules/lead/dto/lead-response.dto'
import { UpdateLeadDto } from '@/modules/lead/dto/update-lead.dto'
import { Lead } from '@/modules/lead/entities/lead'
import { LeadRepository } from '@/modules/lead/lead.repository'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class LeadService {
  constructor(private readonly leadRepository: LeadRepository) {}

  async create(input: CreateLeadDto): Promise<LeadResponseDto> {
    const lead = await this.leadRepository.create(input)

    return this.toResponse(lead)
  }

  async getById(leadId: string): Promise<LeadResponseDto> {
    const lead = await this.leadRepository.findById(leadId)

    if (!lead?.isActive()) {
      throw new NotFoundException('Lead não encontrado')
    }

    return this.toResponse(lead)
  }

  async list(): Promise<LeadResponseDto[]> {
    const leads = await this.leadRepository.list()

    return leads.map((lead) => this.toResponse(lead))
  }

  async update(leadId: string, input: UpdateLeadDto): Promise<void> {
    const existingLead = await this.leadRepository.findById(leadId)

    if (!existingLead?.isActive()) {
      throw new NotFoundException('Lead não encontrado')
    }

    await this.leadRepository.update(leadId, input)
  }

  async delete(leadIds: string[]): Promise<void> {
    const deletedCount = await this.leadRepository.softDeleteMany(leadIds)

    if (deletedCount === 0) {
      throw new NotFoundException('Lead não encontrado')
    }
  }

  private toResponse(lead: Lead): LeadResponseDto {
    return {
      id: lead.id,
      name: lead.name,
      phoneNumber: lead.phoneNumber,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    }
  }
}

