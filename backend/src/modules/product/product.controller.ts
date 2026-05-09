import { ProductService } from '@/modules/product/product.service'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateProductDto } from './dto/create-product.dto'
import { ListProductsDto } from './dto/list-products.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() input: CreateProductDto) {
    return this.productService.create(input)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.productService.getById(id)
  }

  @Get()
  list(@Query() query: ListProductsDto) {
    return this.productService.list(query)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateProductDto) {
    return this.productService.update(id, input)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id)
  }
}
