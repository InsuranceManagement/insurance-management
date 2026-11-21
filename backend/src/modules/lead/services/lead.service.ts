import { CreateLeadDto } from '@/modules/lead/dto/create-lead.dto'
import { LeadResponseDto } from '@/modules/lead/dto/lead-response.dto'
import { Lead } from '@/modules/lead/entities/lead'
import { LeadRepository } from '@/modules/lead/lead.repository'
import { environment } from '@/common/config/environment'
import { NotificationsMsClient } from '@/modules/notifications/notifications-ms.client'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name)

  constructor(
    private readonly leadRepository: LeadRepository,
    private readonly notificationsMsClient: NotificationsMsClient,
  ) {}

  async create(input: CreateLeadDto): Promise<LeadResponseDto> {
    const lead = await this.leadRepository.create(input)

    await this.notifyNewLead(lead)

    return this.toResponse(lead)
  }

  private async notifyNewLead(lead: Lead): Promise<void> {
    const recipientEmail = environment.LEAD_NOTIFICATION_EMAIL.trim()
    if (!recipientEmail) {
      this.logger.warn('Destinatário para notificações de leads não está configurado.')
      return
    }

    try {
      await this.notificationsMsClient.sendEmail({
        recipientEmail,
        subject: 'Novo contato recebido',
        emailBody: `<p>Uma pessoa entrou em contato.</p><p>Nome: ${this.escapeHtml(lead.name)}<br>Telefone: ${this.escapeHtml(lead.phoneNumber)}</p>`,
      })
    } catch {
      this.logger.warn('Não foi possível enviar a notificação de novo lead.')
    }
  }

  private escapeHtml(value: string): string {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return value.replace(/[&<>"']/g, (character) => entities[character])
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
