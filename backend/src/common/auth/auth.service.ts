import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

export type JwtPayload = {
  sub: string
  id: string
  name: string
  email: string
  iat?: number
  exp?: number
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateToken(authorization?: string): Promise<JwtPayload> {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação ausente ou malformado')
    }

    const token = authorization.slice('Bearer '.length).trim()

    if (!token) {
      throw new UnauthorizedException('Token de autenticação ausente ou malformado')
    }

    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token)
    } catch {
      throw new UnauthorizedException('Token de autenticação inválido ou expirado')
    }
  }
}
