import { ClientService } from '@/modules/client/services/client.service'
import { CreateClientDto } from '@/modules/client/dto/create-client.dto'
import { LinkClientProductDto } from '@/modules/client/dto/link-client-product.dto'
import { UpdateClientDto } from '@/modules/client/dto/update-client.dto'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() input: CreateClientDto) {
    return this.clientService.create(input)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.clientService.getById(id)
  }

  @Get()
  list() {
    return this.clientService.list()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateClientDto) {
    return this.clientService.update(id, input)
  }

  @Post(':id/products')
  addProduct(@Param('id') id: string, @Body() input: LinkClientProductDto) {
    return this.clientService.addProduct(id, input.productId)
  }

  @Get(':id/products')
  listProducts(@Param('id') id: string) {
    return this.clientService.listProducts(id)
  }

  @Delete(':id/products/:productId')
  removeProduct(@Param('id') id: string, @Param('productId') productId: string) {
    return this.clientService.removeProduct(id, productId)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.clientService.delete(id)
  }
}
