import { environment } from '@/common/config/environment'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { NotificationsMsClient } from './notifications-ms.client'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './services/notifications.service'

@Module({
  imports: [
    JwtModule.register({
      secret: environment.JWT_SECRET,
      signOptions: {
        expiresIn: environment.JWT_EXPIRES_IN_SECONDS,
      },
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsMsClient],
})
export class NotificationsModule {}
