import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class PasswordService {
  async hash(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, 10)
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}
