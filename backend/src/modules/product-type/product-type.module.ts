import { Module } from '@nestjs/common'
import { PrismaModule } from '../database/prisma.module'
import { ProductTypeController } from './product-type.controller'
import { ProductTypeRepository } from './product-type.repository'
import { ProductTypeService } from './services/product-type.service'

@Module({
  imports: [PrismaModule],
  controllers: [ProductTypeController],
  providers: [ProductTypeService, ProductTypeRepository],
})
export class ProductTypeModule {}
