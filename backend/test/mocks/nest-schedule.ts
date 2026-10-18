import { Module } from '@nestjs/common'

// The E2E suite does not test cron jobs; stub the ESM package for Jest's CommonJS runtime.
@Module({})
class ScheduleModuleStub {}

export const ScheduleModule = {
  forRoot: () => ({ module: ScheduleModuleStub }),
}

export function Cron(...args: unknown[]): MethodDecorator {
  void args
  return () => undefined
}
