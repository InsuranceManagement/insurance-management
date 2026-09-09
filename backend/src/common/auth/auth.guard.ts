import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { IS_PUBLIC } from './auth.decorators'
import { AuthService, JwtPayload } from './auth.service'
import { AUTH_COOKIE_NAME } from './cookie.constants'

type AuthenticatedRequest = Request & {
  user?: JwtPayload
  cookies?: Record<string, string>
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()

    if (isPublic || request.method === 'OPTIONS' || this.isSwaggerRoute(request)) {
      return true
    }

    const tokenValue: unknown = request.cookies?.[AUTH_COOKIE_NAME]
    const token = typeof tokenValue === 'string' ? tokenValue : undefined
    const payload = await this.authService.validateToken(token)
    request.user = payload

    return true
  }

  private isSwaggerRoute(request: Request): boolean {
    const path = request.path || request.url || ''
    return path.startsWith('/docs')
  }
}
