import { Product } from '@/modules/product/entities/product'
import { ProductRepository } from '@/modules/product/product.repository'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { ProductResponseDto } from './dto/product-response.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(input: CreateProductDto): Promise<ProductResponseDto> {
    await this.assertParentReferencesAreActive(input.productTypeId, input.insuranceCompanyId)

    const product = await this.productRepository.create(input)

    if (!product) {
      throw new BadRequestException(
        'Não é possível associar produtos a seguradoras ou tipos de produto excluídos.',
      )
    }

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

    const productTypeId = input.productTypeId ?? existingProduct.productTypeId
    const insuranceCompanyId = input.insuranceCompanyId ?? existingProduct.insuranceCompanyId

    await this.assertParentReferencesAreActive(productTypeId, insuranceCompanyId)

    const updated = await this.productRepository.update(
      productId,
      input,
      productTypeId,
      insuranceCompanyId,
    )

    if (!updated) {
      throw new BadRequestException(
        'Não é possível associar produtos a seguradoras ou tipos de produto excluídos.',
      )
    }
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

  private async assertParentReferencesAreActive(
    productTypeId: string,
    insuranceCompanyId: string,
  ): Promise<void> {
    const availability = await this.productRepository.getParentAvailability(
      productTypeId,
      insuranceCompanyId,
    )

    if (!availability.productType.exists) {
      throw new NotFoundException('Tipo de produto não encontrado')
    }

    if (!availability.insuranceCompany.exists) {
      throw new NotFoundException('Seguradora não encontrada')
    }

    if (!availability.productType.isActive) {
      throw new BadRequestException('Não é possível associar produtos a um tipo excluído.')
    }

    if (!availability.insuranceCompany.isActive) {
      throw new BadRequestException('Não é possível associar produtos a uma seguradora excluída.')
    }
  }
}
