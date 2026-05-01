import { environment } from '@/common/config/environment'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../database/prisma.module'
import { PasswordService } from './services/password.service'
import { UserService } from './services/user.service'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: environment.JWT_SECRET,
      signOptions: {
        expiresIn: environment.JWT_EXPIRES_IN_SECONDS,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, PasswordService],
})
export class UserModule {}
