import { PrismaService } from '@/modules/database/prisma.service'
import { Client, ClientProduct } from '@/modules/client/entities/client'
import { CreateClientInput } from '@/modules/client/inputs/create-client.input'
import { UpdateClientInput } from '@/modules/client/inputs/update-client.input'
import { Injectable } from '@nestjs/common'

type ClientRecord = {
  id: string
  name: string
  email: string
  cpf: string
  cnpj: string
  phoneNumber: string
  birthDate: Date
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

type ProductRecord = {
  id: string
  name: string
  productTypeId: string
  insuranceCompanyId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

@Injectable()
export class ClientRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateClientInput): Promise<Client> {
    const client = await this.prismaService.client.create({
      data: {
        name: input.name,
        email: input.email,
        cpf: input.cpf,
        cnpj: input.cnpj,
        phoneNumber: input.phoneNumber,
        birthDate: input.birthDate,
      },
    })

    return this.toEntity(client)
  }

  async findById(clientId: string): Promise<Client | null> {
    const client = await this.prismaService.client.findFirst({
      where: {
        id: clientId,
        deletedAt: null,
      },
    })

    return client ? this.toEntity(client) : null
  }

  async findByIdWithProducts(clientId: string): Promise<Client | null> {
    const client = await this.prismaService.client.findFirst({
      where: {
        id: clientId,
        deletedAt: null,
      },
      include: {
        products: {
          where: {
            deletedAt: null,
          },
        },
      },
    })

    if (!client) {
      return null
    }

    const products = client.products.map((product): ClientProduct => ({
      id: product.id,
      name: product.name,
      productTypeId: product.productTypeId,
      insuranceCompanyId: product.insuranceCompanyId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    return this.toEntity(client, products)
  }

  async findActiveProductById(productId: string): Promise<ProductRecord | null> {
    return await this.prismaService.products.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
    })
  }

  async isProductLinked(clientId: string, productId: string): Promise<boolean> {
    const client = await this.prismaService.client.findFirst({
      where: {
        id: clientId,
        deletedAt: null,
        products: {
          some: {
            id: productId,
          },
        },
      },
      select: { id: true },
    })

    return Boolean(client)
  }

  async linkProduct(clientId: string, productId: string): Promise<void> {
    await this.prismaService.client.update({
      where: {
        id: clientId,
      },
      data: {
        products: {
          connect: { id: productId },
        },
      },
    })
  }

  async unlinkProduct(clientId: string, productId: string): Promise<void> {
    await this.prismaService.client.update({
      where: {
        id: clientId,
      },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
    })
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prismaService.client.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    })

    return client ? this.toEntity(client) : null
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    const client = await this.prismaService.client.findFirst({
      where: {
        cpf,
        deletedAt: null,
      },
    })

    return client ? this.toEntity(client) : null
  }

  async findByCnpj(cnpj: string): Promise<Client | null> {
    const client = await this.prismaService.client.findFirst({
      where: {
        cnpj,
        deletedAt: null,
      },
    })

    return client ? this.toEntity(client) : null
  }

  async update(clientId: string, input: UpdateClientInput): Promise<void> {
    await this.prismaService.client.update({
      where: {
        id: clientId,
      },
      data: {
        ...input,
      },
    })
  }

  async softDelete(clientId: string): Promise<void> {
    await this.prismaService.client.update({
      where: {
        id: clientId,
      },
      data: {
        deletedAt: new Date(),
        email: `deleted+${clientId}@local`,
        cpf: `deleted-${clientId}`,
        cnpj: `deleted-${clientId}`,
      },
    })
  }

  async list(): Promise<Client[]> {
    const clients = await this.prismaService.client.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })

    return clients.map((client) => this.toEntity(client))
  }

  private toEntity(client: ClientRecord, products: ClientProduct[] = []): Client {
    return new Client(
      client.id,
      client.name,
      client.email,
      client.cpf,
      client.cnpj,
      client.phoneNumber,
      client.birthDate,
      client.createdAt,
      client.updatedAt,
      client.deletedAt,
      products,
    )
  }
}
