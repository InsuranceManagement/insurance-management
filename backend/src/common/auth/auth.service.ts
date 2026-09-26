import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SessionService } from '@/modules/session/session.service'

export type JwtPayload = {
  sub: string
  id: string
  name: string
  email: string
  sid: string
  tokenType: 'access'
  iat?: number
  exp?: number
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async validateToken(token?: string): Promise<JwtPayload> {
    if (!token) {
      throw new UnauthorizedException('Sessão ausente')
    }

    let payload: JwtPayload

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token)
    } catch {
      throw new UnauthorizedException('Invalid or expired access token')
    }

    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload.sub !== 'string' ||
      payload.sub.length === 0 ||
      typeof payload.sid !== 'string' ||
      payload.sid.length === 0 ||
      payload.tokenType !== 'access'
    ) {
      throw new UnauthorizedException('Invalid access token')
    }

    if (!(await this.sessionService.isActiveForUser(payload.sid, payload.sub))) {
      throw new UnauthorizedException('Invalid or revoked session')
    }

    return payload
  }

  async validateOptionalToken(token?: string): Promise<JwtPayload | undefined> {
    if (!token) {
      return undefined
    }

    try {
      return await this.validateToken(token)
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return undefined
      }

      throw error
    }
  }
}
