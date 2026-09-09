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

  async validateToken(token?: string): Promise<JwtPayload> {
    if (!token) {
      throw new UnauthorizedException('Sessão ausente')
    }

    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token)
    } catch {
      throw new UnauthorizedException('Token de autenticação inválido ou expirado')
    }
  }
}
