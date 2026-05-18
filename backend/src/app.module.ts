import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthGuard } from './common/auth/auth.guard'
import { AuthModule } from './common/auth/auth.module'
import { PrismaModule } from './modules/database/prisma.module'
import { ClientModule } from './modules/client/client.module'
import { InsuranceCompanyModule } from './modules/insurance-company/insurance-company.module'
import { ProductModule } from './modules/product/product.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    InsuranceCompanyModule,
    ProductModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
