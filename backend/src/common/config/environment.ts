import 'dotenv/config'

export const environment = {
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [],
  PORT: Number(process.env.PORT) || 8080,
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN_SECONDS: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 3600,
  RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL || '',
  RESET_PASSWORD_TOKEN_TTL_MINUTES: Number(process.env.RESET_PASSWORD_TOKEN_TTL_MINUTES) || 30,
  NOTIFICATIONS_API_URL: process.env.NOTIFICATIONS_API_URL || '',
}
