import { PrismaService } from '@/modules/database/prisma.service'
import { Product } from '@/modules/product/entities/product'
import { CreateProductInput } from '@/modules/product/inputs/create-product.input'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { UpdateProductInput } from './inputs/update-product.input'

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
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateProductInput): Promise<Product> {
    const product = await this.prismaService.products.create({
      data: {
        id: randomUUID(),
        name: input.name,
        productTypeId: input.productTypeId,
        insuranceCompanyId: input.insuranceCompanyId,
      },
    })

    return this.toEntity(product)
  }

  async findById(productId: string): Promise<Product | null> {
    const product = await this.prismaService.products.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
    })

    return product ? this.toEntity(product) : null
  }

  async update(productId: string, input: UpdateProductInput): Promise<void> {
    await this.prismaService.products.update({
      where: {
        id: productId,
      },
      data: {
        ...input,
      },
    })
  }

  async softDelete(productId: string): Promise<void> {
    await this.prismaService.products.update({
      where: {
        id: productId,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async softDeleteMany(productIds: string[]): Promise<void> {
    if (productIds.length === 0) {
      return
    }

    await this.prismaService.products.updateMany({
      where: {
        id: { in: productIds },
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async list(): Promise<Product[]> {
    const products = await this.prismaService.products.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })

    return products.map((product) => this.toEntity(product))
  }

  private toEntity(product: ProductRecord): Product {
    return new Product(
      product.id,
      product.name,
      product.productTypeId,
      product.insuranceCompanyId,
      product.createdAt,
      product.updatedAt,
      product.deletedAt,
    )
  }
}
