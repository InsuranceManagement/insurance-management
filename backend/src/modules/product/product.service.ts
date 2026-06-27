import { Product } from '@/modules/product/entities/product'
import { ProductRepository } from '@/modules/product/product.repository'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { ProductResponseDto } from './dto/product-response.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(input: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.create(input)

    return this.toResponse(product)
  }

  async getById(productId: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(productId)

    if (!product?.isActive()) {
      throw new NotFoundException('Produto não encontrado')
    }

    return this.toResponse(product)
  }

  async list(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.list()

    return products.map((product) => this.toResponse(product))
  }

  async update(productId: string, input: UpdateProductDto): Promise<void> {
    const existingProduct = await this.productRepository.findById(productId)

    if (!existingProduct?.isActive()) {
      throw new NotFoundException('Produto não encontrado')
    }

    await this.productRepository.update(productId, input)
  }

  async delete(productIds: string[]): Promise<void> {
    const deletedCount = await this.productRepository.softDeleteMany(productIds)

    if (deletedCount === 0) {
      throw new NotFoundException('Produto não encontrado')
    }
  }

  private toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      productTypeId: product.productTypeId,
      insuranceCompanyId: product.insuranceCompanyId,
      productType: product.productType,
      insuranceCompany: product.insuranceCompany,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
