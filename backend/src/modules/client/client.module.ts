import { Module } from '@nestjs/common'
import { PrismaModule } from '../database/prisma.module'
import { ClientController } from './client.controller'
import { ClientRepository } from './client.repository'
import { ClientService } from './services/client.service'

@Module({
  imports: [PrismaModule],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository],
})
export class ClientModule {}
