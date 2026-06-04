import { Client } from '@/modules/client/entities/client'
import { CreateClientInput } from '@/modules/client/inputs/create-client.input'
import { UpdateClientInput } from '@/modules/client/inputs/update-client.input'
import { PrismaService } from '@/modules/database/prisma.service'
import { Injectable } from '@nestjs/common'

type ProductRecord = {
  id: string
}

@Injectable()
export class ClientRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateClientInput): Promise<Client> {
    const productIds = input.productIds ?? []
    const client = await this.prismaService.client.create({
      data: {
        name: input.name,
        email: input.email,
        cpf: input.cpf,
        cnpj: input.cnpj,
        phoneNumber: input.phoneNumber,
        birthDate: input.birthDate,
        address: {
          create: {
            ...input.address,
          },
        },
        products: productIds.length > 0 ? { connect: productIds.map((id) => ({ id })) } : undefined,
      },
      include: {
        address: true,
      },
    })

    return Client.fromPrisma(client)
  }

  async findById(clientId: string): Promise<Client | null> {
    const client = await this.prismaService.client.findFirst({
      where: {
        id: clientId,
        deletedAt: null,
      },
      include: {
        address: true,
      },
    })

    return client ? Client.fromPrisma(client) : null
  }

  async findByIdWithProducts(clientId: string): Promise<Client | null> {
    const client = await this.prismaService.client.findFirst({
      where: {
        id: clientId,
        deletedAt: null,
      },
      include: {
        address: true,
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

    return Client.fromPrisma(client)
  }

  async findActiveProductsByIds(productIds: string[]): Promise<ProductRecord[]> {
    if (productIds.length === 0) {
      return []
    }

    return await this.prismaService.products.findMany({
      where: {
        id: { in: productIds },
        deletedAt: null,
      },
      select: {
        id: true,
      },
    })
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prismaService.client.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      include: {
        address: true,
      },
    })

    return client ? Client.fromPrisma(client) : null
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    const client = await this.prismaService.client.findFirst({
      where: {
        cpf,
        deletedAt: null,
      },
      include: {
        address: true,
      },
    })

    return client ? Client.fromPrisma(client) : null
  }

  async findByCnpj(cnpj: string): Promise<Client | null> {
    const client = await this.prismaService.client.findFirst({
      where: {
        cnpj,
        deletedAt: null,
      },
      include: {
        address: true,
      },
    })

    return client ? Client.fromPrisma(client) : null
  }

  async update(clientId: string, input: UpdateClientInput): Promise<void> {
    const { productIds, address, ...clientData } = input
    await this.prismaService.client.update({
      where: {
        id: clientId,
      },
      data: {
        ...clientData,
        address: address
          ? {
              update: {
                ...address,
              },
            }
          : undefined,
        products: productIds ? { set: productIds.map((id) => ({ id })) } : undefined,
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

  async softDeleteMany(clientIds: string[]): Promise<number> {
    if (clientIds.length === 0) return 0

    const clients = await this.prismaService.client.findMany({
      where: { id: { in: clientIds }, deletedAt: null },
      select: { id: true },
    })

    const updates = clients.map(({ id }) =>
      this.prismaService.client.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          email: `deleted+${id}@local`,
          cpf: `deleted-${id}`,
          cnpj: `deleted-${id}`,
        },
      }),
    )

    const results = await this.prismaService.$transaction(updates)
    return results.length
  }

  async list(): Promise<Client[]> {
    const clients = await this.prismaService.client.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        address: true,
        products: {
          where: {
            deletedAt: null,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return clients.map((client) => Client.fromPrisma(client))
  }
}
