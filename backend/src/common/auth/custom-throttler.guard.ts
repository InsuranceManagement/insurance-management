import { ExecutionContext, Injectable } from '@nestjs/common'
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(_context: ExecutionContext): Promise<void> {
    throw new ThrottlerException(
      'Muitas tentativas realizadas. Aguarde alguns instantes e tente novamente.',
    )
  }
}
