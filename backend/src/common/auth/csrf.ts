import { doubleCsrf } from 'csrf-csrf'
import { randomBytes } from 'crypto'
import type { Request } from 'express'

import { environment } from '../config/environment'
import { AUTH_COOKIE_NAME, CSRF_HEADER_NAME } from './cookie.constants'

if (environment.NODE_ENV === 'production' && !environment.CSRF_SECRET) {
  throw new Error('CSRF_SECRET must be configured in production')
}

const csrfSecret = environment.CSRF_SECRET || randomBytes(32).toString('hex')

const csrf = doubleCsrf({
  getSecret: () => csrfSecret,
  getSessionIdentifier: (request: Request) => request.cookies?.[AUTH_COOKIE_NAME] ?? 'anonymous',
  cookieName: environment.NODE_ENV === 'production' ? '__Host-csrf-token' : 'csrf_token',
  cookieOptions: {
    httpOnly: true,
    secure: environment.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
  getCsrfTokenFromRequest: (request: Request) => request.headers[CSRF_HEADER_NAME],
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
})

export const { generateCsrfToken, doubleCsrfProtection } = csrf
