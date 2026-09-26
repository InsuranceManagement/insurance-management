import { Public } from '@/common/auth/auth.decorators'
import { LoginDto } from '@/modules/user/dto/login.dto'
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto'
import { UserService } from '@/modules/user/services/user.service'
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import type { Request, Response } from 'express'
import { JwtPayload } from '@/common/auth/auth.service'
import { AUTH_COOKIE_NAME } from '@/common/auth/cookie.constants'
import { clearAuthCookie, setAuthCookie } from '@/common/auth/cookie.utils'
import { AuthResponseDto } from './dto/auth-response.dto'
import { CsrfResponseDto } from './dto/csrf-response.dto'
import { generateCsrfToken } from '@/common/auth/csrf'
import { minutes, Throttle } from '@nestjs/throttler'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

const AUTH_RATE_LIMIT_WINDOW = minutes(1)

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: AUTH_RATE_LIMIT_WINDOW } })
  @Post('login')
  @ApiOkResponse({ type: AuthResponseDto })
  login(@Body() input: LoginDto, @Res({ passthrough: true }) response: Response) {
    return this.loginSession(input, response)
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: AUTH_RATE_LIMIT_WINDOW } })
  @Post('forgot-password')
  forgotPassword(@Body() input: ForgotPasswordDto) {
    return this.userService.requestPasswordReset(input)
  }

  @Public()
  @Throttle({ default: { limit: 4, ttl: AUTH_RATE_LIMIT_WINDOW } })
  @Post('reset-password')
  resetPassword(@Body() input: ResetPasswordDto) {
    return this.userService.resetPassword(input)
  }

  @Public()
  @Get('csrf')
  @ApiOkResponse({ type: CsrfResponseDto })
  csrf(@Req() request: Request, @Res({ passthrough: true }) response: Response): CsrfResponseDto {
    return { csrfToken: generateCsrfToken(request, response) }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  logout(@Res({ passthrough: true }) response: Response) {
    clearAuthCookie(response)
  }

  @Get('me')
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  getCurrentUser(@Req() request: Request & { user?: JwtPayload }) {
    return this.userService.getById(request.user!.sub)
  }

  @Get(':id')
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  getById(@Param('id') id: string, @Req() request: Request & { user?: JwtPayload }) {
    this.assertOwnAccount(id, request.user!.sub)
    return this.userService.getById(id)
  }

  @Patch(':id')
  @ApiCookieAuth(AUTH_COOKIE_NAME)
  update(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
    @Req() request: Request & { user?: JwtPayload },
  ) {
    this.assertOwnAccount(id, request.user!.sub)
    return this.userService.update(id, input)
  }

  private assertOwnAccount(targetUserId: string, authenticatedUserId: string) {
    if (targetUserId !== authenticatedUserId) {
      throw new ForbiddenException('Acesso negado')
    }
  }

  private async loginSession(input: LoginDto, response: Response) {
    const session = await this.userService.login(input)
    setAuthCookie(response, session.accessToken)
    return { user: session.user }
  }
}
