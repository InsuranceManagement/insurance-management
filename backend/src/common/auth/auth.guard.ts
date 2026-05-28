import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { IS_PUBLIC } from './auth.decorators'
import { AuthService, JwtPayload } from './auth.service'

type AuthenticatedRequest = Request & { user?: JwtPayload }

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

    if (isPublic || this.isSwaggerRoute(request)) {
      return true
    }

    const authorization = this.getAuthorizationHeader(request)
    const payload = await this.authService.validateToken(authorization)
    request.user = payload

    return true
  }

  private getAuthorizationHeader(request: Request): string | undefined {
    const header = request.headers.authorization
    return Array.isArray(header) ? header[0] : header
  }

  private isSwaggerRoute(request: Request): boolean {
    const path = request.path || request.url || ''
    return path.startsWith('/docs')
  }
}
