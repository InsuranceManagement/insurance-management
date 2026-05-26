import { environment } from '@/common/config/environment'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'

@Module({
  imports: [
    JwtModule.register({
      secret: environment.JWT_SECRET,
      signOptions: {
        expiresIn: environment.JWT_EXPIRES_IN_SECONDS,
      },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
