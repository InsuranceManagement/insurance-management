import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(
    _context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    return Promise.reject(
      new HttpException(
        {
          message: 'Muitas tentativas realizadas. Aguarde alguns instantes e tente novamente.',
          retryAfterSeconds: throttlerLimitDetail.timeToBlockExpire,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    )
  }
}
