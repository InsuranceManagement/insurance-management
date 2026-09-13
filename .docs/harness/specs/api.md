# API detectada

## Convencoes globais

- Sem prefixo/versionamento global; porta padrao 8080.
- Swagger em `GET /docs`.
- Todas as rotas exigem Bearer JWT, exceto as marcadas **Publica** abaixo e o Swagger.
- JSON e validado por `ValidationPipe` com transformacao, whitelist e rejeicao de propriedades extras.
- Listagens retornam arrays sem paginacao detectada.
- Deletes tabulares usam `DELETE` com corpo `{ "ids": string[] }`; Visit e a excecao individual.

## Rotas

### Base e usuarios

| Metodo | Path | Acesso | Contrato resumido |
| --- | --- | --- | --- |
| GET | `/` | Publica | Retorna `Hello World!` |
| POST | `/users` | Publica | Cria user e retorna `{ accessToken, user }` |
| POST | `/users/login` | Publica | Credenciais -> `{ accessToken, user }` |
| POST | `/users/forgot-password` | Publica | E-mail -> mensagem neutra |
| POST | `/users/reset-password` | Publica | Token + nova senha -> mensagem |
| GET | `/users` | JWT | `UserResponseDto[]` |
| GET | `/users/:id` | JWT | `UserResponseDto` |
| PATCH | `/users/:id` | JWT | Update parcial |
| DELETE | `/users` | JWT | Soft delete batch por `ids` |

### Cadastros principais

Cada grupo abaixo oferece `POST /recurso`, `GET /recurso`, `GET /recurso/:id`, `PATCH /recurso/:id` e `DELETE /recurso` batch:

| Recurso | Path | Criacao |
| --- | --- | --- |
| Seguradoras | `/insurance-companies` | `name`, `color` hexadecimal `#RRGGBB` |
| Tipos de produto | `/product-types` | `name`, `description` |
| Produtos | `/products` | `name`, `productTypeId`, `insuranceCompanyId` |
| Charts | `/charts` | `name`, `description`, `apiRoute`, `chartTypeId`, `order`, `unit?` |
| Chart types | `/chart-types` | `name`, `description`, `size` |

Todos exigem JWT. Seguradoras, tipos de produto e produtos usam soft delete; charts e chart types usam delete fisico.

### Clientes

| Metodo | Path | Contrato |
| --- | --- | --- |
| POST | `/clients` | Cria cliente |
| GET | `/clients` | Clientes ativos com address e products |
| GET | `/clients/:id` | Cliente ativo com address e products |
| GET | `/clients/:id/products` | Produtos ativos do cliente |
| PATCH | `/clients/:id` | Update parcial; address aninhado e products substituiveis |
| DELETE | `/clients` | Soft delete batch |

Criacao exige `name`, `email`, `phoneNumber`, `birthDate`, `address`; aceita `cpf?`, `cnpj?`, `productIds?`, mas ao menos CPF/CNPJ e obrigatorio. Address exige street, district, state, city e number; cep/complement sao opcionais.

### Visitas

| Metodo | Path | Contrato |
| --- | --- | --- |
| POST | `/visits` | `name`, `description`, `clientId` UUID, `date` ISO |
| GET | `/visits` | Filtros opcionais inclusivos `startDate`, `endDate` |
| GET | `/visits/:id` | Uma visita |
| PATCH | `/visits/:id` | Campos parciais da criacao |
| DELETE | `/visits/:id` | Delete fisico; resposta 204 |

### Dashboard

Todos sao `GET` protegidos:

- `/dashboard/kpi-total-clients`
- `/dashboard/kpi-total-products`
- `/dashboard/kpi-total-insurance-companies`
- `/dashboard/kpi-total-product-types`
- `/dashboard/clients-by-insurance-company`
- `/dashboard/clients-growth-by-month`
- `/dashboard/client-document-distribution`
- `/dashboard/client-age-range`
- `/dashboard/product-types-by-insurance-company`

KPIs retornam numero; series retornam `ChartPoint[]`; o ultimo retorna o payload de heatmap. As configuracoes seed de Chart apontam para essas rotas.

### Notificacoes

**Detectado:** `NotificationRuleModule` e importado pelo `AppModule`, registrando as rotas protegidas `GET/POST/DELETE /notification-rules`, `GET/PATCH /notification-rules/:id` e `POST /notification-rules/:id/preview`. O modulo tambem registra o agendador diario de regras as 09:00 em `America/Sao_Paulo`. Evidencias: `backend/src/app.module.ts`, `backend/src/modules/notification-rule/notification-rule.controller.ts`, `backend/src/modules/notification-rule/notification-rule.scheduler.ts`.

| Metodo | Path | Contrato |
| --- | --- | --- |
| GET | `/notifications/logs` | Logs do servico externo |
| POST | `/notifications/templates` | Cria template externo |
| PUT | `/notifications/templates/:id` | Atualiza template externo |

O POST aceita `name`, `description` anulavel, `subject`, `body`, e opcionais `variableSchema`, `isActive`, `notificationTypeId`. O PUT exige as sete chaves; cada uma pode ser nula por exigencia do servico externo.

## Tipos e regras compartilhadas

- `UserResponseDto`: id, name, email, createdAt, updatedAt; nunca password.
- Password: minimo 8, com maiuscula, minuscula, numero e especial.
- Chart size: `1x1 | 2x1 | 4x4 | 8x4`.
- Respostas de create/get de entidades usam DTOs; updates/deletes de cadastros retornam vazio na implementacao atual.
- O contrato executavel mais atualizado e o Swagger gerado dos controllers/DTOs.

## Consumido pelo frontend

**Detectado:** `frontend/src/shared/constants/routes.ts` cobre auth, seguradoras, tipos de produto, produtos, clientes, charts-list, visits, regras de notificacao, templates e logs de notificacoes. Dashboard usa `apiRoute` retornado por Chart. Usuarios administrativos e chart types nao possuem telas frontend detectadas.

**Detectado:** a tela `/logs` consome `GET /notifications/logs` como `NotificationLog[]`, sem parametros de paginacao ou filtros no servidor. A busca, os filtros e a paginacao sao locais, com ordenacao decrescente por `timestamp`. Evidencias: `frontend/src/features/ApplicationLogs/models/notification-log.ts`, `frontend/src/features/ApplicationLogs/hooks/use-application-logs.ts`.
