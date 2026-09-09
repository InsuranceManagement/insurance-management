# Contexto base

## Proposito

**Detectado:** aplicacao web para administrar seguradoras, tipos de produto, produtos, clientes e visitas, com autenticacao e dashboard configurado por graficos. Evidencias: `backend/src/app.module.ts`, `frontend/src/app/(protected)` e `backend/prisma/seed-data.ts`.

## Stack

- Backend: TypeScript, NestJS 11, Prisma 7 com adapter PostgreSQL, class-validator, Swagger, JWT, bcrypt, Helmet e throttling.
- Frontend: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, componentes Radix/shadcn, React Query, React Hook Form/Zod, Highcharts e FullCalendar.
- Dependencias sao independentes em `backend/package.json` e `frontend/package.json`; nao ha package raiz.

## Arquitetura resumida

- Backend modular. O caminho predominante e controller -> service -> repository -> Prisma; entities fazem mapeamento de dominio e DTOs validam a borda HTTP.
- `AuthGuard` e throttler globais protegem a API; registro, login, recuperacao de senha e raiz sao publicos. Swagger fica em `/docs`.
- Frontend separa paginas em `src/app`, fluxos em `src/features` e infraestrutura compartilhada em `src/shared`.
- O frontend centraliza rotas em `src/shared/constants/routes.ts`, usa Axios e React Query e envia o JWT salvo em `localStorage`.
- Dashboard busca configuracoes de `GET /charts` e usa o `apiRoute` persistido para carregar KPIs/series.
- Notificacoes sao obtidas por um servico HTTP externo configurado por `NOTIFICATIONS_API_URL`; nao ha tabelas locais de notificacao no schema Prisma.

## Restricoes criticas

- Fonte do harness: implementacao. Nao apresente intencao como fato.
- Ignore `infra/` integralmente.
- Preserve alteracoes pre-existentes e nao exponha segredos ou dados pessoais.
- O backend rejeita propriedades nao declaradas nos DTOs.
- Respeite soft delete nos modelos com `deletedAt`; confirme a semantica diferente de visits/charts antes de uniformizar.
- Nao edite o client Prisma gerado.
- No frontend, leia a documentacao local do Next.js 16 antes de usar APIs do framework.

## Caminhos

- Composicao backend: `backend/src/app.module.ts`, `backend/src/main.ts`.
- Dominio backend: `backend/src/modules`; seguranca compartilhada: `backend/src/common`.
- Dados: `backend/prisma/schema.prisma`, `backend/prisma/migrations`, `backend/prisma/seed.ts`.
- Rotas frontend: `frontend/src/app`, `frontend/src/shared/constants/routes.ts`.
- Features/UI: `frontend/src/features`, `frontend/src/shared/components`.
- Cliente HTTP/estado: `frontend/src/shared/lib/api-client.ts`, `frontend/src/shared/hooks`, `frontend/src/shared/context/auth-context.tsx`.

## Validacao

- Backend, em `backend/`: `npm run format:check`, `npm run lint`, `npm run build`, `npm run test`; `npm run test:e2e` requer ambiente/banco. O lint pode alterar arquivos.
- Frontend, em `frontend/`: `npm run lint`, `npm run build`.
