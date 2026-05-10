import { PrismaService } from '@/modules/database/prisma.service'
import { ProductType } from '@/modules/product-type/entities/product-type'
import { CreateProductTypeInput } from '@/modules/product-type/inputs/create-product-type.input'
import { UpdateProductTypeInput } from '@/modules/product-type/inputs/update-product-type.input'
import { Injectable } from '@nestjs/common'

type ProductTypeRecord = {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

@Injectable()
export class ProductTypeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateProductTypeInput): Promise<ProductType> {
    const productType = await this.prismaService.productType.create({
      data: {
        id: input.id,
        name: input.name,
        description: input.description,
      },
    })

    return this.toEntity(productType)
  }

  async findById(productTypeId: string): Promise<ProductType | null> {
    const productType = await this.prismaService.productType.findFirst({
      where: {
        id: productTypeId,
        deletedAt: null,
      },
    })

    return productType ? this.toEntity(productType) : null
  }

  async findByName(name: string): Promise<ProductType | null> {
    const productType = await this.prismaService.productType.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    })

    return productType ? this.toEntity(productType) : null
  }

  async update(productTypeId: string, input: UpdateProductTypeInput): Promise<void> {
    await this.prismaService.productType.update({
      where: {
        id: productTypeId,
      },
      data: {
        ...input,
      },
    })
  }

  async softDelete(productTypeId: string): Promise<void> {
    await this.prismaService.productType.update({
      where: {
        id: productTypeId,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async list(): Promise<{ productTypes: ProductType[]; total: number }> {
    const where = { deletedAt: null }

    const [productTypes, total] = await Promise.all([
      this.prismaService.productType.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.productType.count({ where }),
    ])

    return {
      productTypes: productTypes.map((productType) => this.toEntity(productType)),
      total,
    }
  }

  private toEntity(productType: ProductTypeRecord): ProductType {
    return new ProductType(
      productType.id,
      productType.name,
      productType.description,
      productType.createdAt,
      productType.updatedAt,
      productType.deletedAt,
    )
  }
}
