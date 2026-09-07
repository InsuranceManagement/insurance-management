# Skill: implementar feature

## Quando usar

Para adicionar comportamento, endpoint, campo persistido, tela, fluxo ou integracao em backend/frontend.

## Leitura obrigatoria

- `AGENTS.md` e o `AGENTS.md` do aplicativo tocado.
- `.docs/harness/prompts/base-context.md`, `.docs/harness/hooks/agent-workflow.md`.
- `.docs/harness/instructions/architecture.md`, `.docs/harness/instructions/coding-standards.md`, `.docs/harness/instructions/testing.md` e `.docs/harness/instructions/security.md`.
- Specs de feature, dominio, API e dados relacionadas.

## Passos

1. Defina comportamento observavel, ator, contrato, erros e fora de escopo; marque regras ausentes como pergunta.
2. Encontre a feature/modulo mais semelhante e siga sua estrutura.
3. Backend: implemente DTO/input -> controller -> service -> repository/entity; registre o modulo/provider.
4. Se houver dados, altere schema, crie migracao, regenere Prisma e revise soft/hard delete/relacoes.
5. Frontend: adicione rota central, model/schema, hooks, feature e pagina; reutilize `CrudScreen`/UI quando adequado.
6. Sincronize Swagger e contratos ponta a ponta.
7. Adicione testes de regra, erro e regressao; faca verificacao manual do fluxo visual quando nao houver runner.
8. Atualize o harness somente se a mudanca alterar conhecimento duravel.

## Comandos

- Backend: `npm run prisma:generate` quando aplicavel; depois `npm run format:check`, `npm run lint`, `npm run build`, `npm run test` e e2e com banco.
- Frontend: `npm run lint`, `npm run build`.

## Conclusao

- Contrato, camadas e consumidores estao sincronizados.
- Migracao e generated client sao coerentes, sem edicao manual.
- Caminhos feliz/erro relevantes foram testados.
- Diff contem apenas o escopo e nenhum segredo/PII.
