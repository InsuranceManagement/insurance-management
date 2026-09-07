import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AUTH_COOKIE_NAME } from './common/auth/cookie.constants'
import { doubleCsrfProtection } from './common/auth/csrf'
import { environment } from './common/config/environment'
import { createValidationException } from './common/validation/validation-exception.factory'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')

  app.use(helmet())
  app.use(cookieParser())

  app.enableCors({
    origin: environment.ALLOWED_ORIGINS.length > 0 ? environment.ALLOWED_ORIGINS : false,
    credentials: true,
  })

  app.use(doubleCsrfProtection)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: createValidationException,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Insurance Management API')
    .setDescription('Insurance Management system API')
    .setVersion('0.0.1')
    .addCookieAuth(AUTH_COOKIE_NAME)
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/docs', app, document)

  await app.listen(environment.PORT)
  logger.log(`API running on http://localhost:${environment.PORT}`)
  logger.log(`Swagger docs available at http://localhost:${environment.PORT}/docs`)
}
void bootstrap()
