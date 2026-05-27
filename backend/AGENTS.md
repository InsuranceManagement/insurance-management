# AGENTS - Insurance Management

Este documento resume o projeto ate agora: arquitetura, organizacao de pastas e endpoints com tipagens.

## Visao geral da arquitetura

- Backend: NestJS (TypeScript) com Prisma + PostgreSQL.
- Frontend: Next.js (app router) com componentes em `frontend/src/shared`.
- Docker: `compose.yml` sobe `db` (Postgres 17) e `api` (backend).
- Persistencia: Prisma Client com adapter `PrismaPg`.
- Validacao global: `ValidationPipe` com `whitelist`, `transform` e `forbidNonWhitelisted`.
- Documentacao: Swagger em `/docs`.

## Organizacao de pastas

```
.
├── compose.yml
├── AGENTS.md
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── generated/prisma/   # Prisma Client gerado
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── main.ts
│   │   ├── common/
│   │   │   └── config/
│   │   └── modules/
│   │       ├── database/             # PrismaService
│   │       ├── user/                 # controller, service, repo, dto, inputs
│   │       ├── insurance-company/    # controller, service, repo, dto, inputs
│   │       └── products-type/        # vazio ate o momento
│   └── test/
└── frontend/
    ├── AGENTS.md
    └── src/
        ├── app/          # layout e pagina inicial
        └── shared/       # componentes, hooks, lib
```

## Modelos de dados (Prisma)

- `User`: id (uuid), name, email (unique), password, createdAt, updatedAt, deletedAt.
- `InsuranceCompany`: id (uuid), name, color, createdAt, updatedAt, deletedAt, products.
- `ProductType`: id, name (unique), description, createdAt, updatedAt, deletedAt, products.
- `Products`: id, name, productTypeId, insuranceCompanyId, createdAt, updatedAt, deletedAt, clients, visits.
- `Client`: id (uuid), name, email (unique), cpf (unique), cnpj (unique), phoneNumber, birthDate, createdAt, updatedAt, deletedAt, products, visits.
- `Visit`: id, name, description, clientId, productId, date, createdAt, updatedAt, deletedAt.

## Endpoints e tipagens

### Base

- `GET /`
  - Response: `string` ("Hello World!")

### Users

- `POST /users`
  - Request body: `CreateUserDto`
    - `name: string`
    - `email: string` (IsEmail)
    - `password: string` (MinLength 8, regex: 1 uppercase + 1 lowercase + 1 number)
  - Response: `AuthResponseDto`
    - `accessToken: string`
    - `user: { id: string, name: string, email: string }`

- `POST /users/login`
  - Request body: `LoginDto`
    - `email: string` (IsEmail)
    - `password: string`
  - Response: `AuthResponseDto`

- `GET /users/:id`
  - Response: `UserResponseDto`
    - `id: string`
    - `name: string`
    - `email: string`
    - `createdAt: Date`
    - `updatedAt: Date`

- `GET /users`
  - Query: `ListUsersDto`
    - `skip?: number` (Min 0, default 0)
    - `take?: number` (Min 1, Max 100, default 10)
    - `searchTerm?: string`
  - Response: `{ users: UserResponseDto[], total: number }`

- `PATCH /users/:id`
  - Request body: `UpdateUserDto`
    - `name?: string`
    - `email?: string` (IsEmail)
    - `password?: string` (MinLength 8, regex: 1 uppercase + 1 lowercase + 1 number)
  - Response: `void`

- `DELETE /users/:id`
  - Response: `void` (soft delete no banco)

### Insurance companies

- `POST /insurance-companies`
  - Request body: `CreateInsuranceCompanyDto`
    - `name: string`
    - `color: string` (hex `#RRGGBB`)
  - Response: `InsuranceCompanyResponseDto`
    - `id: string`
    - `name: string`
    - `color: string`
    - `createdAt: Date`
    - `updatedAt: Date`

- `GET /insurance-companies/:id`
  - Response: `InsuranceCompanyResponseDto`

- `GET /insurance-companies`
  - Query: `ListInsuranceCompaniesDto`
    - `skip?: number` (Min 0, default 0)
    - `take?: number` (Min 1, Max 100, default 10)
    - `searchTerm?: string`
  - Response: `{ insuranceCompanies: InsuranceCompanyResponseDto[], total: number }`

- `PATCH /insurance-companies/:id`
  - Request body: `UpdateInsuranceCompanyDto`
    - `name?: string`
    - `color?: string` (hex `#RRGGBB`)
  - Response: `void`

- `DELETE /insurance-companies/:id`
  - Response: `void` (soft delete no banco)

## Backend - fluxo de camadas

- Controller: recebe HTTP, valida DTO, chama Service.
- Service: regras de negocio, verificacoes de existencia, hash de senha, JWT.
- Repository: Prisma queries, paginacao, soft delete.
- PrismaService: conexao e ciclo de vida.

## Convencoes de mapeamento de dominio

- Repositories devem usar tipos gerados do Prisma (ex.: `Prisma.ModelGetPayload`) em vez de tipos manuais `Record`.
- O mapeamento de Prisma para dominio deve ficar na entity de dominio, via metodo estatico `fromPrisma(...)`.
- `Chart` e `ChartType` seguem este padrao: repository somente consulta/persiste, e a entity concentra a transformacao para dominio.

## Frontend - resumo

- App Router com layout global em `frontend/src/app/layout.tsx`.
- Pagina inicial em `frontend/src/app/page.tsx` com cards de metricas e fila de analise.
- Componentes reutilizaveis em `frontend/src/shared/components`.
