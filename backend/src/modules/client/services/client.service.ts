import { ClientRepository } from '@/modules/client/client.repository'
import { ClientProductResponseDto } from '@/modules/client/dto/client-product-response.dto'
import { ClientResponseDto } from '@/modules/client/dto/client-response.dto'
import { ClientWithProductsResponseDto } from '@/modules/client/dto/client-with-products-response.dto'
import { CreateClientDto } from '@/modules/client/dto/create-client.dto'
import { UpdateClientDto } from '@/modules/client/dto/update-client.dto'
import { Client } from '@/modules/client/entities/client'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(input: CreateClientDto): Promise<ClientResponseDto> {
    const productIds = input.productIds ?? []

    if (productIds.length > 0) {
      await this.ensureProductsExist(productIds)
    }

    const existingEmail = await this.clientRepository.findByEmail(input.email)
    if (existingEmail) {
      throw new BadRequestException('E-mail já está em uso')
    }

    if (input.cpf) {
      const existingCpf = await this.clientRepository.findByCpf(input.cpf)
      if (existingCpf) {
        throw new BadRequestException('CPF já está em uso')
      }
    }

    if (input.cnpj) {
      const existingCnpj = await this.clientRepository.findByCnpj(input.cnpj)
      if (existingCnpj) {
        throw new BadRequestException('CNPJ already in use')
      }
    }

    const client = await this.clientRepository.create({
      ...input,
      productIds,
    })

    return this.toResponse(client)
  }

  async getById(clientId: string): Promise<ClientWithProductsResponseDto> {
    const client = await this.clientRepository.findByIdWithProducts(clientId)

    if (!client?.isActive()) {
      throw new NotFoundException('Client not found')
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
      throw new NotFoundException('Client not found')
    }

    if (input.email && input.email !== existingClient.email) {
      const emailInUse = await this.clientRepository.findByEmail(input.email)
      if (emailInUse && emailInUse.id !== clientId) {
        throw new BadRequestException('E-mail already in use')
      }
    }

    if (input.cpf && input.cpf !== existingClient.cpf) {
      const cpfInUse = await this.clientRepository.findByCpf(input.cpf)
      if (cpfInUse && cpfInUse.id !== clientId) {
        throw new BadRequestException('CPF already in use')
      }
    }

    if (input.cnpj && input.cnpj !== existingClient.cnpj) {
      const cnpjInUse = await this.clientRepository.findByCnpj(input.cnpj)
      if (cnpjInUse && cnpjInUse.id !== clientId) {
        throw new BadRequestException('CNPJ already in use')
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
      throw new NotFoundException('Client not found')
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
      throw new NotFoundException('Client not found')
    }
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
      throw new NotFoundException('Product not found')
    }
  }
}
