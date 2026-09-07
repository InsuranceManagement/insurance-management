# Visao geral do projeto

## Identidade

- **Detectado:** nome apresentado: Insurance Management.
- **Detectado:** sistema web em pt-BR para operacao de uma carteira de seguros. O metadata do frontend descreve “Insurance operation and policy dashboard”; o codigo implementa cadastros, agenda e dashboard.
- **Desconhecido:** organizacao proprietaria, perfis de usuario, metas comerciais, requisitos regulatorios e ambientes suportados.

## Capacidades implementadas

- Cadastro e login de usuarios, recuperacao e redefinicao de senha.
- CRUD de seguradoras, tipos de produto, produtos e clientes.
- Associacao N:N entre clientes e produtos e endereco 1:1 por cliente.
- Agenda de visitas por cliente, com filtros de intervalo.
- Dashboard de KPIs, distribuicoes e evolucao da carteira.
- Configuracao de charts/chart types que determina quais widgets o frontend carrega.
- Proxy autenticado para logs e templates de um servico externo de notificacoes.

Evidencias: `backend/src/modules`, `frontend/src/features`, `frontend/src/app/(protected)` e `backend/prisma/schema.prisma`.

## Aplicativos

- `backend/`: API NestJS, porta padrao 8080, Swagger em `/docs`, persistencia PostgreSQL.
- `frontend/`: Next.js App Router, porta padrao do Next em desenvolvimento, API configurada por `NEXT_PUBLIC_API_URL`.
- Nao ha workspace/package raiz; instale e execute dependencias separadamente.

## Configuracao detectada

| Aplicativo | Variaveis |
| --- | --- |
| Backend | `ALLOWED_ORIGINS`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN_SECONDS`, `RESET_PASSWORD_URL`, `RESET_PASSWORD_TOKEN_TTL_MINUTES`, `NOTIFICATIONS_API_URL` |
| Frontend | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BASE_PATH` |

Nao ha arquivo de exemplo de ambiente detectado. Defaults relevantes: porta 8080, JWT 3600 segundos e token de reset 30 minutos.

## Limites de conhecimento

- **Detectado:** o harness descreve somente backend e frontend.
- **Desconhecido:** processo oficial de setup local do banco, dados obrigatorios por ambiente, suporte de browsers e politica de observabilidade.
- **Pergunta em aberto:** o sistema e multiusuario sem isolamento ou ainda requer autorizacao por papel/tenant?
