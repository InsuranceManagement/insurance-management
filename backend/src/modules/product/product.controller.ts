import { DeleteManyDto } from '@/common/dto/delete-many.dto'
import { ProductService } from '@/modules/product/product.service'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@ApiBearerAuth()
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
  list() {
    return this.productService.list()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateProductDto) {
    return this.productService.update(id, input)
  }

  @Delete()
  delete(@Body() input: DeleteManyDto) {
    return this.productService.delete(input.ids)
  }
}
