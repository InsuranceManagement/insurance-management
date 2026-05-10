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
    const existingById = await this.productTypeRepository.findById(input.id)

    if (existingById) {
      throw new BadRequestException('Product type id already in use')
    }

    const existingByName = await this.productTypeRepository.findByName(input.name)

    if (existingByName) {
      throw new BadRequestException('Product type name already in use')
    }

    const productType = await this.productTypeRepository.create(input)

    return this.toResponse(productType)
  }

  async getById(productTypeId: string): Promise<ProductTypeResponseDto> {
    const productType = await this.productTypeRepository.findById(productTypeId)

    if (!productType?.isActive()) {
      throw new NotFoundException('Product type not found')
    }

    return this.toResponse(productType)
  }

  async list(): Promise<{ productTypes: ProductTypeResponseDto[]; total: number }> {
    const { productTypes, total } = await this.productTypeRepository.list()

    return {
      productTypes: productTypes.map((productType) => this.toResponse(productType)),
      total,
    }
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

  async delete(productTypeId: string): Promise<void> {
    const existingProductType = await this.productTypeRepository.findById(productTypeId)

    if (!existingProductType?.isActive()) {
      throw new NotFoundException('Product type not found')
    }

    await this.productTypeRepository.softDelete(productTypeId)
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
}
