FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build


FROM node:22-alpine AS production-deps

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force


FROM node:22-alpine

RUN apk add --no-cache wget

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy package files for metadata
COPY package*.json ./

# Copy only runtime dependencies and runtime artifacts
COPY --from=production-deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/generated ./generated
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Run migrations, run seed once, and start the compiled app.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && exec node dist/src/main.js"]