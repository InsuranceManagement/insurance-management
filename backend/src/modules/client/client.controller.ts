import { ClientService } from '@/modules/client/services/client.service'
import { CreateClientDto } from '@/modules/client/dto/create-client.dto'
import { UpdateClientDto } from '@/modules/client/dto/update-client.dto'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ClientWithProductsResponseDto } from '@/modules/client/dto/client-with-products-response.dto'

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
  @ApiOkResponse({ type: ClientWithProductsResponseDto, isArray: true })
  list() {
    return this.clientService.list()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateClientDto) {
    return this.clientService.update(id, input)
  }

  @Get(':id/products')
  listProducts(@Param('id') id: string) {
    return this.clientService.listProducts(id)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.clientService.delete(id)
  }
}
