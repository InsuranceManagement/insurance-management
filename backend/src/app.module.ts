import { DashboardModule } from '@/modules/dashboard/dashboard.module'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { AuthGuard } from './common/auth/auth.guard'
import { AuthModule } from './common/auth/auth.module'

import { ChartTypeModule } from './modules/chart-type/chart-type.module'
import { ChartModule } from './modules/chart/chart.module'
import { ClientModule } from './modules/client/client.module'
import { PrismaModule } from './modules/database/prisma.module'
import { InsuranceCompanyModule } from './modules/insurance-company/insurance-company.module'
import { ProductTypeModule } from './modules/product-type/product-type.module'
import { ProductModule } from './modules/product/product.module'
import { UserModule } from './modules/user/user.module'

import { minutes, ThrottlerModule } from '@nestjs/throttler'
import { CustomThrottlerGuard } from './common/auth/auth.throttler.guard'

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: minutes(1),
        limit: 100,
      },
    ]),

    PrismaModule,
    AuthModule,
    UserModule,
    InsuranceCompanyModule,
    ProductModule,
    ClientModule,
    ProductTypeModule,
    ChartTypeModule,
    ChartModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
