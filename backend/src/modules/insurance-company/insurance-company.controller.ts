import { CreateInsuranceCompanyDto } from '@/modules/insurance-company/dto/create-insurance-company.dto'
import { ListInsuranceCompaniesDto } from '@/modules/insurance-company/dto/list-insurance-companies.dto'
import { UpdateInsuranceCompanyDto } from '@/modules/insurance-company/dto/update-insurance-company.dto'
import { InsuranceCompanyService } from '@/modules/insurance-company/services/insurance-company.service'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Insurance Companies')
@Controller('insurance-companies')
export class InsuranceCompanyController {
  constructor(private readonly insuranceCompanyService: InsuranceCompanyService) {}

  @Post()
  create(@Body() input: CreateInsuranceCompanyDto) {
    return this.insuranceCompanyService.create(input)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.insuranceCompanyService.getById(id)
  }

  @Get()
  list(@Query() query: ListInsuranceCompaniesDto) {
    return this.insuranceCompanyService.list(query)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateInsuranceCompanyDto) {
    return this.insuranceCompanyService.update(id, input)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.insuranceCompanyService.delete(id)
  }
}
