import { PrismaService } from '@/modules/database/prisma.service'
import { Product } from '@/modules/product/entities/product'
import { ProductType } from '@/modules/product-type/entities/product-type'
import { InsuranceCompany } from '@/modules/insurance-company/entities/insurance-company'
import { CreateProductInput } from '@/modules/product/inputs/create-product.input'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { UpdateProductInput } from './inputs/update-product.input'
import { Prisma } from '@generated/prisma'

type ProductWithRelations = Prisma.ProductsGetPayload<{
  include: {
    productType: true
    insuranceCompany: true
  }
}>

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
      include: {
        productType: true,
        insuranceCompany: true,
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
      include: {
        productType: true,
        insuranceCompany: true,
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

  async list(): Promise<Product[]> {
    const products = await this.prismaService.products.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        productType: true,
        insuranceCompany: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return products.map((product) => this.toEntity(product))
  }

  private toEntity(product: ProductWithRelations): Product {
    return new Product(
      product.id,
      product.name,
      product.productTypeId,
      product.insuranceCompanyId,
      product.createdAt,
      product.updatedAt,
      product.deletedAt,
      product.productType
        ? new ProductType(
            product.productType.id,
            product.productType.name,
            product.productType.description,
            product.productType.createdAt,
            product.productType.updatedAt,
            product.productType.deletedAt,
          )
        : undefined,
      product.insuranceCompany
        ? new InsuranceCompany(
            product.insuranceCompany.id,
            product.insuranceCompany.name,
            product.insuranceCompany.color,
            product.insuranceCompany.createdAt,
            product.insuranceCompany.updatedAt,
            product.insuranceCompany.deletedAt,
          )
        : undefined,
    )
  }
}