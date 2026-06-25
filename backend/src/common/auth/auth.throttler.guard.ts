import { Injectable } from '@nestjs/common'
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(): never {
    throw new ThrottlerException(
      'Muitas tentativas realizadas. Aguarde alguns instantes e tente novamente.',
    )
  }
}
