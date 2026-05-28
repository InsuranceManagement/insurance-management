import { CreateProductTypeDto } from '@/modules/product-type/dto/create-product-type.dto'
import { UpdateProductTypeDto } from '@/modules/product-type/dto/update-product-type.dto'
import { ProductTypeService } from '@/modules/product-type/services/product-type.service'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'



import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Product Types')
@Controller('product-types')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @Post()
  create(@Body() input: CreateProductTypeDto) {
    return this.productTypeService.create(input)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.productTypeService.getById(id)
  }

  @Get()
  list() {
    return this.productTypeService.list()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateProductTypeDto) {
    return this.productTypeService.update(id, input)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productTypeService.delete(id)
  }
}
