import { CreateProductTypeDto } from '@/modules/product-type/dto/create-product-type.dto'
import { ProductTypeResponseDto } from '@/modules/product-type/dto/product-type-response.dto'
import { UpdateProductTypeDto } from '@/modules/product-type/dto/update-product-type.dto'
import { ProductType } from '@/modules/product-type/entities/product-type'
import { ProductTypeRepository } from '@/modules/product-type/product-type.repository'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class ProductTypeService {
  constructor(private readonly productTypeRepository: ProductTypeRepository) {}

  async create(input: CreateProductTypeDto): Promise<ProductTypeResponseDto> {
    const existingByName = await this.productTypeRepository.findByName(input.name)

    if (existingByName) {
      throw new BadRequestException('Product type name already in use')
    }

    const id = this.buildIdFromName(input.name)
    const productType = await this.productTypeRepository.create({
      id,
      name: input.name,
      description: input.description,
    })

    return this.toResponse(productType)
  }

  async getById(productTypeId: string): Promise<ProductTypeResponseDto> {
    const productType = await this.productTypeRepository.findById(productTypeId)

    if (!productType?.isActive()) {
      throw new NotFoundException('Product type not found')
    }

    return this.toResponse(productType)
  }

  async list(): Promise<ProductTypeResponseDto[]> {
    const productTypes = await this.productTypeRepository.list()

    return productTypes.map((productType) => this.toResponse(productType))
  }

  async update(productTypeId: string, input: UpdateProductTypeDto): Promise<void> {
    const existingProductType = await this.productTypeRepository.findById(productTypeId)

    if (!existingProductType?.isActive()) {
      throw new NotFoundException('Product type not found')
    }

    if (input.name && input.name !== existingProductType.name) {
      const nameInUse = await this.productTypeRepository.findByName(input.name)
      if (nameInUse && nameInUse.id !== productTypeId) {
        throw new BadRequestException('Product type name already in use')
      }
    }

    await this.productTypeRepository.update(productTypeId, input)
  }

  async delete(productTypeIds: string[]): Promise<void> {
    const deletedCount = await this.productTypeRepository.softDeleteMany(productTypeIds)

    if (deletedCount === 0) {
      throw new NotFoundException('Product type not found')
    }
  }

  private toResponse(productType: ProductType): ProductTypeResponseDto {
    return {
      id: productType.id,
      name: productType.name,
      description: productType.description,
      createdAt: productType.createdAt,
      updatedAt: productType.updatedAt,
    }
  }

  private buildIdFromName(name: string): string {
    return name.trim().replace(/\\s+/g, '_').toUpperCase()
  }
}
