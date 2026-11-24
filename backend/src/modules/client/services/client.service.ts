import { ClientRepository } from '@/modules/client/client.repository'
import { ClientProductResponseDto } from '@/modules/client/dto/client-product-response.dto'
import { ClientResponseDto } from '@/modules/client/dto/client-response.dto'
import { ClientWithProductsResponseDto } from '@/modules/client/dto/client-with-products-response.dto'
import { CreateClientDto } from '@/modules/client/dto/create-client.dto'
import { UpdateClientDto } from '@/modules/client/dto/update-client.dto'
import { SendClientEmailInput } from '@/modules/client/inputs/send-client-email.input'
import type { ConvertLeadDto } from '@/modules/lead/dto/convert-lead.dto'
import { Client } from '@/modules/client/entities/client'
import { NotificationsMsClient } from '@/modules/notifications/notifications-ms.client'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

const TIME_ZONE = 'America/Sao_Paulo'

dayjs.extend(utc)
dayjs.extend(timezone)

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly notificationsMsClient: NotificationsMsClient,
  ) {}

  async create(input: CreateClientDto): Promise<ClientResponseDto> {
    await this.validateCreate(input)
    const productIds = input.productIds ?? []

    const client = await this.clientRepository.create({
      ...input,
      productIds,
    })

    return this.toResponse(client)
  }

  async convertLead(leadId: string, input: ConvertLeadDto): Promise<ClientResponseDto> {
    await this.validateCreate(input)

    const client = await this.clientRepository.createFromLead(leadId, input)
    return this.toResponse(client)
  }

  async getById(clientId: string): Promise<ClientWithProductsResponseDto> {
    const client = await this.clientRepository.findByIdWithProducts(clientId)

    if (!client?.isActive()) {
      throw new NotFoundException('Cliente não encontrado')
    }

    return this.toResponseWithProducts(client)
  }

  async list(): Promise<ClientWithProductsResponseDto[]> {
    const clients = await this.clientRepository.list()

    return clients.map((client) => this.toResponseWithProducts(client))
  }

  async update(clientId: string, input: UpdateClientDto): Promise<void> {
    const existingClient = await this.clientRepository.findById(clientId)

    if (!existingClient?.isActive()) {
      throw new NotFoundException('Cliente não encontrado')
    }

    if (input.email && input.email !== existingClient.email) {
      const emailInUse = await this.clientRepository.findByEmail(input.email)
      if (emailInUse && emailInUse.id !== clientId) {
        throw new BadRequestException('E-mail já está em uso')
      }
    }

    if (input.cpf && input.cpf !== existingClient.cpf) {
      const cpfInUse = await this.clientRepository.findByCpf(input.cpf)
      if (cpfInUse && cpfInUse.id !== clientId) {
        throw new BadRequestException('CPF já está em uso')
      }
    }

    if (input.cnpj && input.cnpj !== existingClient.cnpj) {
      const cnpjInUse = await this.clientRepository.findByCnpj(input.cnpj)
      if (cnpjInUse && cnpjInUse.id !== clientId) {
        throw new BadRequestException('CNPJ já está em uso')
      }
    }

    if (input.productIds) {
      await this.ensureProductsExist(input.productIds)
    }

    await this.clientRepository.update(clientId, {
      ...input,
    })
  }

  async listProducts(clientId: string): Promise<ClientProductResponseDto[]> {
    const client = await this.clientRepository.findByIdWithProducts(clientId)

    if (!client?.isActive()) {
      throw new NotFoundException('Cliente não encontrado')
    }

    return client.products.map((product) => ({
      id: product.id,
      name: product.name,
      productTypeId: product.productTypeId,
      insuranceCompanyId: product.insuranceCompanyId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))
  }

  async delete(clientIds: string[]): Promise<void> {
    const deletedCount = await this.clientRepository.softDeleteMany(clientIds)

    if (deletedCount === 0) {
      throw new NotFoundException('Cliente não encontrado')
    }
  }

  async sendEmail(clientId: string, input: SendClientEmailInput): Promise<void> {
    const client = await this.clientRepository.findById(clientId)

    if (!client?.isActive()) {
      throw new NotFoundException('Cliente não encontrado')
    }

    if (!client.email?.trim()) {
      throw new BadRequestException('Cliente não possui e-mail cadastrado')
    }

    const templateId = input.templateId?.trim() || undefined
    const subject = input.subject?.trim() || undefined
    const message = input.message?.trim() || undefined

    if (templateId && (subject || message)) {
      throw new BadRequestException(
        'Informe um template ou assunto e mensagem personalizados, não ambos.',
      )
    }

    if (templateId) {
      await this.notificationsMsClient.sendTemplateEmail({
        recipientEmail: client.email,
        templateId,
        templateVariables: {
          'client.id': client.id,
          'client.name': client.name,
          'client.email': client.email,
          'client.phoneNumber': client.phoneNumber,
          'client.birthDate': client.birthDate.toISOString(),
          'context.today': dayjs().tz(TIME_ZONE).format('YYYY-MM-DD'),
        },
      })
      return
    }

    if (!subject || !message) {
      throw new BadRequestException('Informe o assunto e a mensagem do e-mail.')
    }

    await this.notificationsMsClient.sendEmail({
      recipientEmail: client.email,
      subject,
      emailBody: this.formatEmailBody(message),
    })
  }

  private formatEmailBody(message: string): string {
    return message
      .split(/\r?\n\s*\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) => `<p>${this.escapeHtml(paragraph).replace(/\r?\n/g, '<br>')}</p>`)
      .join('')
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

  private toResponse(client: Client): ClientResponseDto {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      cpf: client.cpf ?? undefined,
      cnpj: client.cnpj ?? undefined,
      phoneNumber: client.phoneNumber,
      birthDate: client.birthDate,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      address: {
        ...client.address,
        cep: client.address.cep ?? undefined,
        complement: client.address.complement ?? undefined,
      },
    }
  }

  private toResponseWithProducts(client: Client): ClientWithProductsResponseDto {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      cpf: client.cpf ?? undefined,
      cnpj: client.cnpj ?? undefined,
      phoneNumber: client.phoneNumber,
      birthDate: client.birthDate,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      address: {
        ...client.address,
        cep: client.address.cep ?? undefined,
        complement: client.address.complement ?? undefined,
      },
      products: client.products.map((product) => ({
        id: product.id,
        name: product.name,
        productTypeId: product.productTypeId,
        insuranceCompanyId: product.insuranceCompanyId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
    }
  }

  private async ensureProductsExist(productIds: string[]): Promise<void> {
    const products = await this.clientRepository.findActiveProductsByIds(productIds)
    if (products.length !== productIds.length) {
      throw new NotFoundException('Um ou mais produtos não foram encontrados')
    }
  }

  private async validateCreate(input: ConvertLeadDto): Promise<void> {
    const productIds = input.productIds ?? []
    if (productIds.length > 0) {
      await this.ensureProductsExist(productIds)
    }

    if (await this.clientRepository.findByEmail(input.email)) {
      throw new BadRequestException('E-mail já está em uso')
    }
    if (input.cpf && (await this.clientRepository.findByCpf(input.cpf))) {
      throw new BadRequestException('CPF já está em uso')
    }
    if (input.cnpj && (await this.clientRepository.findByCnpj(input.cnpj))) {
      throw new BadRequestException('CNPJ já está em uso')
    }
  }
}
