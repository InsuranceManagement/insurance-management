import { CreateLeadDto } from '@/modules/lead/dto/create-lead.dto'
import { LeadResponseDto } from '@/modules/lead/dto/lead-response.dto'
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

  async list(): Promise<LeadResponseDto[]> {
    const leads = await this.leadRepository.list()

    return leads.map((lead) => this.toResponse(lead))
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
    }
  }
}
