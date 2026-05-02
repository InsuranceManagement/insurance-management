import { Module } from '@nestjs/common'
import { PrismaModule } from '../database/prisma.module'
import { InsuranceCompanyController } from './insurance-company.controller'
import { InsuranceCompanyRepository } from './insurance-company.repository'
import { InsuranceCompanyService } from './services/insurance-company.service'

@Module({
  imports: [PrismaModule],
  controllers: [InsuranceCompanyController],
  providers: [InsuranceCompanyService, InsuranceCompanyRepository],
})
export class InsuranceCompanyModule {}
