import type { Response } from 'express'
import { environment } from '../config/environment'
import { AUTH_COOKIE_NAME } from './cookie.constants'

const cookieOptions = {
  httpOnly: true,
  secure: environment.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export function setAuthCookie(response: Response, token: string): void {
  response.cookie(AUTH_COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: environment.JWT_EXPIRES_IN_SECONDS * 1000,
  })
}

export function clearAuthCookie(response: Response): void {
  response.clearCookie(AUTH_COOKIE_NAME, cookieOptions)
}
