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

export type ProductParentAvailability = {
  productType: { exists: boolean; isActive: boolean }
  insuranceCompany: { exists: boolean; isActive: boolean }
}

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getParentAvailability(
    productTypeId: string,
    insuranceCompanyId: string,
  ): Promise<ProductParentAvailability> {
    const [productType, insuranceCompany] = await Promise.all([
      this.prismaService.productType.findUnique({
        where: { id: productTypeId },
        select: { id: true, deletedAt: true },
      }),
      this.prismaService.insuranceCompany.findUnique({
        where: { id: insuranceCompanyId },
        select: { id: true, deletedAt: true },
      }),
    ])

    return {
      productType: {
        exists: productType !== null,
        isActive: productType?.deletedAt === null,
      },
      insuranceCompany: {
        exists: insuranceCompany !== null,
        isActive: insuranceCompany?.deletedAt === null,
      },
    }
  }

  async create(input: CreateProductInput): Promise<Product | null> {
    return this.prismaService.$transaction(
      async (transaction) => {
        const [productType, insuranceCompany] = await Promise.all([
          transaction.productType.findFirst({
            where: { id: input.productTypeId, deletedAt: null },
            select: { id: true },
          }),
          transaction.insuranceCompany.findFirst({
            where: { id: input.insuranceCompanyId, deletedAt: null },
            select: { id: true },
          }),
        ])

        if (!productType || !insuranceCompany) {
          return null
        }

        const product = await transaction.products.create({
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
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    )
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

  async update(
    productId: string,
    input: UpdateProductInput,
    productTypeId: string,
    insuranceCompanyId: string,
  ): Promise<boolean> {
    return this.prismaService.$transaction(
      async (transaction) => {
        const [productType, insuranceCompany] = await Promise.all([
          transaction.productType.findFirst({
            where: { id: productTypeId, deletedAt: null },
            select: { id: true },
          }),
          transaction.insuranceCompany.findFirst({
            where: { id: insuranceCompanyId, deletedAt: null },
            select: { id: true },
          }),
        ])

        if (!productType || !insuranceCompany) {
          return false
        }

        const { count } = await transaction.products.updateMany({
          where: { id: productId, deletedAt: null },
          data: { ...input },
        })

        return count > 0
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    )
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

  async softDeleteMany(productIds: string[]): Promise<number> {
    if (productIds.length === 0) {
      return 0
    }

    const { count } = await this.prismaService.products.updateMany({
      where: {
        id: {
          in: productIds,
        },
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return count
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
