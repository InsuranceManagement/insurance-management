# AGENTS - Backend

Leia primeiro o `AGENTS.md` raiz e os documentos do harness relacionados a tarefa.

## Estrutura detectada

- NestJS 11 em `src/`, Prisma 7/PostgreSQL em `prisma/` e client gerado em `generated/prisma/`.
- Modulos: user, insurance-company, product-type, product, client, visit, chart-type, chart, dashboard e notifications.
- Fluxo predominante: controller -> service -> repository -> `PrismaService`; DTOs validam HTTP, inputs tipam portas internas e entities mapeiam persistencia para dominio.
- O guard JWT e o throttler sao globais. Rotas publicas exigem `@Public()`.

## Regras locais

- Mantenha controllers finos; regras e erros HTTP ficam no service; consultas e mutacoes Prisma ficam no repository.
- Use DTOs com `class-validator` e Swagger na fronteira HTTP. O `ValidationPipe` rejeita campos nao declarados.
- Prefira tipos gerados, como `Prisma.ModelGetPayload`, e mapeamento `fromPrisma` na entity. Preserve a convencao do modulo tocado quando ele ainda usa mapper privado.
- Respeite a estrategia de exclusao de cada agregado: a maioria dos cadastros usa `deletedAt`; charts, chart types e visits atualmente usam exclusao fisica.
- Nao edite `generated/prisma/`. Para mudar dados: ajuste `prisma/schema.prisma`, crie migracao e rode `npm run prisma:generate`.
- Nao registre tokens, senhas, hashes, dados pessoais ou corpos sensiveis.

## Validacao

Em `backend/`: `npm run format:check`, `npm run lint`, `npm run build`, `npm run test`; rode `npm run test:e2e` com `DATABASE_URL` e banco disponiveis. `npm run lint` inclui `--fix`, portanto revise o diff.
