# Arquitetura detectada

## Visao de componentes

1. O browser renderiza o frontend Next.js e mantem usuario/JWT no `AuthProvider`.
2. Features chamam `apiClient` por rotas centralizadas; o interceptor adiciona `Authorization: Bearer`.
3. A API NestJS aplica Helmet, CORS, validacao, throttling e JWT globalmente.
4. Controllers delegam a services; services aplicam regras; repositories usam `PrismaService`.
5. Prisma 7 usa `PrismaPg` para PostgreSQL e conecta no lifecycle do modulo.
6. O modulo notifications chama um servico HTTP externo; o restante dos modulos persiste localmente.

## Backend

- Entrada: `backend/src/main.ts`; composicao: `backend/src/app.module.ts`.
- Compartilhado: auth, configuracao, validacao e DTO batch em `backend/src/common`.
- Modulos persistidos: user, session, insurance-company, product-type, product, client, visit, chart-type, chart e dashboard.
- Integracao: notifications possui controller/service/client e entities de mapeamento, mas nao repository Prisma.
- Alias `@/*` resolve para `src/*`; `@generated/prisma` resolve para o client em `generated/prisma`.
- O schema usa relacoes Prisma diretas; nao ha camada de eventos, filas ou cache detectada.

## Frontend

- O layout raiz instala React Query, auth, tooltip e toaster.
- O grupo `(protected)` envolve dashboard/cadastros/visitas em `AuthGuard`, sidebar e header.
- Rotas publicas: `/login`, `/forgot-password`, `/reset-password`; `/` redireciona para `/dashboard`. O cadastro publico foi removido.
- Features de cadastro configuram o generico `CrudScreen`; visits usa FullCalendar; dashboard usa Highcharts/KPI.
- `frontend/src/shared/constants/routes.ts` descreve metodo e path. `apiClient` resolve path, query, body e cancelamento.
- React Query centraliza cache e toasts; mutations podem invalidar a chave da listagem.

## Fluxos especiais

- Dashboard: `GET /charts` retorna `apiRoute`, tipo, ordem e unidade. O frontend ordena, separa KPI dos demais e faz requests para cada `apiRoute`.
- Password reset: a API gera token aleatorio, armazena somente hash/expiracao e opcionalmente pede envio ao servico de notificacoes.
- Auth: cada login cria uma sessao persistida ligada ao `sid` do JWT. O guard valida a sessao e o usuario no banco em toda requisicao; logout revoga somente a sessao atual e troca/reset de senha revogam todas. A limpeza diaria roda as 02:00 em `America/Sao_Paulo`.
- Templates/logs: a API adapta payloads do servico externo e assina um JWT de feature quando `JWT_SECRET` existe.

## Decisoes nao detectadas

- Nao ha DDD formal, CQRS, mensageria, cache distribuido, roles/permissions ou tenancy implementados.
- Nao ha contrato de versionamento/prefixo global de API.
- Nao ha padrao uniforme de exclusao: cadastros principais usam soft delete; visits/charts/chart types usam delete fisico.
