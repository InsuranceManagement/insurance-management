# Instrucoes de arquitetura

## Backend

- Mantenha cada capacidade em `backend/src/modules/<modulo>` e registre novos modulos em `backend/src/app.module.ts`.
- Preserve o fluxo controller -> service -> repository -> `PrismaService`.
  - Controller: transporte HTTP, decorators, DTOs e status.
  - Service: regras de negocio, verificacao de existencia/unicidade, erros e resposta.
  - Repository: Prisma, includes/selects, ordenacao e semantica de exclusao.
  - Entity: representacao de dominio e mapeamento de registros.
- Use `inputs/` para contratos internos desacoplados dos decorators HTTP e `dto/` para entrada/saida documentada.
- Dependencias entre modulos devem passar por providers exportados. Exemplo detectado: `ChartService` consulta `ChartTypeService`.
- Integracoes HTTP externas devem ficar atras de um client/service dedicado, como `NotificationsMsClient`; aplique timeout, traducao de erros e autenticacao no adaptador.
- Mudancas persistentes exigem schema + migracao + regeneracao do Prisma. Nao altere `backend/generated/prisma` manualmente.

## Frontend

- Use `frontend/src/app` para roteamento/layout; paginas devem delegar para uma feature.
- Coloque fluxos de negocio/UI em `frontend/src/features/<Feature>`; mantenha componentes, hooks, models, config e libs reutilizaveis em `frontend/src/shared`.
- Todo endpoint consumido deve existir em `frontend/src/shared/constants/routes.ts`; requests passam por `apiClient` e hooks React Query.
- Reutilize `CrudScreen` para cadastros com tabela e operacoes em lote. Visits e dashboard tem fluxos proprios por calendario e configuracao dinamica.
- Auth e Query providers pertencem ao layout raiz; o layout `(protected)` aplica `AuthGuard`, sidebar e header.

## Mudancas transversais

- Ao alterar uma API, atualize em conjunto: DTO/controller/service/repository, Swagger, rota central do frontend, model/schema/hook consumidor e testes.
- Preserve nomes e formatos da API em ingles, enquanto mensagens e rotulos de interface seguem predominantemente pt-BR.
- Nao mova responsabilidades entre camadas apenas por conveniencia local; refatoracoes estruturais devem cobrir todos os modulos afetados.
- `infra/` esta fora do escopo deste harness.
