# Testes e validacao

## Estado detectado

- Backend usa Jest/ts-jest. Existem apenas o teste unitario de `AppController` e o smoke e2e de `GET /`: `backend/src/app.controller.spec.ts` e `backend/test/app.e2e-spec.ts`.
- O e2e importa `AppModule`; `PrismaService.onModuleInit` conecta ao PostgreSQL, portanto requer `DATABASE_URL` valido e banco acessivel.
- Nao ha runner, script ou arquivos de teste automatizado detectados no frontend.
- CI do backend verifica geracao Prisma, Prettier, lint e build; nao ha limiar de cobertura detectado.

## O que testar

- Service: caminho feliz, inexistencia, unicidade, soft/hard delete e referencias invalidas, com repositories mockados.
- DTO/HTTP: campos extras, formatos, status e corpo de erro quando o contrato mudar.
- Repository: filtros `deletedAt: null`, includes/relacoes, ordenacao, batch delete e transacoes quando introduzidas.
- Auth: rotas publicas/protegidas, JWT invalido/expirado, hashing e recuperacao sem enumeracao de e-mail.
- Frontend: quando houver infraestrutura de teste, priorize auth, `CrudScreen`, sincronizacao React Query, calendario e renderizacao dinamica do dashboard. Ate la, registre validacao manual desses fluxos.
- Bugs devem receber teste de regressao na camada mais baixa que reproduza a falha.

## Comandos

Backend, em `backend/`:

```text
npm run format:check
npm run lint
npm run build
npm run test
npm run test:e2e
```

`npm run lint` executa ESLint com `--fix`; confira o diff depois. Rode e2e somente com ambiente/banco configurados e informe quando foi omitido.

Frontend, em `frontend/`:

```text
npm run lint
npm run build
```

## Criterio minimo

- Mudanca documental: referencias, JSON e ausencia de arquivos vazios validados.
- Backend sem mudanca de banco: format check, lint, build e testes unitarios.
- Backend com schema: os anteriores + migracao revisada + `npm run prisma:generate` + e2e quando o banco estiver disponivel.
- Frontend: lint, build e verificacao manual do fluxo tocado.
- Full stack: comandos dos dois aplicativos e verificacao do contrato ponta a ponta.
