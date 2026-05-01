import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class PasswordService {
  hash(plainPassword: string): string {
    return bcrypt.hash(plainPassword, 10)
  }

  compare(plainPassword: string, hashedPassword: string): boolean {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}
