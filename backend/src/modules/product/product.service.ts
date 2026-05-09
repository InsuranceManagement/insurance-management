import { Product } from '@/modules/product/entities/product'
import { ProductRepository } from '@/modules/product/product.repository'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { ListProductsDto } from './dto/list-products.dto'
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
      throw new NotFoundException('Product not found')
    }

    return this.toResponse(product)
  }

  async list(query: ListProductsDto): Promise<{ products: ProductResponseDto[]; total: number }> {
    const { products, total } = await this.productRepository.list(query)

    return {
      products: products.map((product) => this.toResponse(product)),
      total,
    }
  }

  async update(productId: string, input: UpdateProductDto): Promise<void> {
    const existingProduct = await this.productRepository.findById(productId)

    if (!existingProduct?.isActive()) {
      throw new NotFoundException('Product not found')
    }

    await this.productRepository.update(productId, input)
  }

  async delete(productId: string): Promise<void> {
    const existingProduct = await this.productRepository.findById(productId)

    if (!existingProduct?.isActive()) {
      throw new NotFoundException('Product not found')
    }

    await this.productRepository.softDelete(productId)
  }

  private toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      productTypeId: product.productTypeId,
      insuranceCompanyId: product.insuranceCompanyId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
