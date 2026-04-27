import 'dotenv/config'

export const environment = {
  PORT: Number(process.env.PORT) || 3002,
  DATABASE_URL: process.env.DATABASE_URL || '',
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || '',
  MINIO_ACCESS_KEY: process.env.MINIO_ROOT_USER || '',
  MINIO_SECRET_KEY: process.env.MINIO_ROOT_PASSWORD || '',
  MINIO_BUCKET: process.env.MINIO_BUCKET || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN_SECONDS: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 3600,
}
