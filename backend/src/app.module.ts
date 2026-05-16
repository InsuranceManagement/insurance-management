import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ClientModule } from './modules/client/client.module'
import { PrismaModule } from './modules/database/prisma.module'
import { InsuranceCompanyModule } from './modules/insurance-company/insurance-company.module'
import { ProductTypeModule } from './modules/product-type/product-type.module'
import { ProductModule } from './modules/product/product.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    PrismaModule,
    UserModule,
    InsuranceCompanyModule,
    ProductModule,
    ClientModule,
    ProductTypeModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
