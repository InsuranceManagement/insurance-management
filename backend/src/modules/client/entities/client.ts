import { Prisma } from '@generated/prisma'
import { ClientAddress } from './client-address'
import { ClientProduct } from './client-product'

type PrismaClientWithAddress = Prisma.ClientGetPayload<{
  include: { address: true }
}>

type PrismaClientWithAddressAndProducts = Prisma.ClientGetPayload<{
  include: { address: true; products: true }
}>

export class Client {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly cpf: string | null,
    public readonly cnpj: string | null,
    public readonly phoneNumber: string,
    public readonly birthDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly address: ClientAddress,
    public readonly products: ClientProduct[] = [],
  ) {}

  isActive(): boolean {
    return this.deletedAt === null
  }

  static fromPrisma(client: PrismaClientWithAddress | PrismaClientWithAddressAndProducts): Client {
    if (client.address?.deletedAt !== null) {
      throw new Error('Client address is missing')
    }

    const products: ClientProduct[] =
      'products' in client
        ? client.products
            .filter((product) => product.deletedAt === null)
            .map((product) => ({
              id: product.id,
              name: product.name,
              productTypeId: product.productTypeId,
              insuranceCompanyId: product.insuranceCompanyId,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
            }))
        : []

    const address: ClientAddress = {
      id: client.address.id,
      cep: client.address.cep,
      street: client.address.street,
      district: client.address.district,
      state: client.address.state,
      city: client.address.city,
      number: client.address.number,
      complement: client.address.complement,
      createdAt: client.address.createdAt,
      updatedAt: client.address.updatedAt,
    }

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
      address,
      products,
    )
  }
}
