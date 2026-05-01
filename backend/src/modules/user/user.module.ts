import { environment } from '@/common/config/environment'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../database/prisma.module'
import { PasswordService } from './services/password.service'
import { UserService } from './services/user.service'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'

const jwtSecret = environment.JWT_SECRET
if (!jwtSecret) {
  throw new Error('JWT_SECRET is required')
}

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: environment.JWT_EXPIRES_IN_SECONDS,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, PasswordService],
})
export class UserModule {}
