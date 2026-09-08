# Skill: refatorar

## Quando usar

Para melhorar estrutura, nomes, tipos ou duplicacao sem mudar comportamento externo.

## Leitura obrigatoria

- `AGENTS.md` aplicavel, `.docs/harness/prompts/base-context.md`, `.docs/harness/hooks/agent-workflow.md`.
- `.docs/harness/instructions/architecture.md`, `.docs/harness/instructions/coding-standards.md`, `.docs/harness/instructions/testing.md`.
- `.docs/harness/specs/api.md` e `.docs/harness/specs/data-model.md` se a area tocar contratos ou persistencia.

## Passos

1. Declare invariantes: rotas, payloads, erros, ordenacao, exclusao e UI que nao podem mudar.
2. Capture comportamento com testes antes de mover codigo, especialmente em services/repositories.
3. Refatore em etapas pequenas seguindo limites existentes.
4. Backend: nao mova regra para controller nem Prisma para service; preserve mappers e filtros ativos.
5. Frontend: preserve pagina fina, rotas centralizadas, query keys e componentes compartilhados.
6. Nao combine mudanca de schema/API com “refatoracao” sem explicitar a mudanca comportamental.
7. Rode testes a cada etapa e revise diff final por formatacao incidental.

## Comandos

- Backend: `npm run format:check`, `npm run lint`, `npm run build`, `npm run test`; e2e quando o limite HTTP/dados mudar.
- Frontend: `npm run lint`, `npm run build` e smoke manual da feature.

## Conclusao

- Contrato observavel permanece igual e testes demonstram isso.
- Dependencias e responsabilidades ficaram coerentes com a arquitetura.
- Nao ha alteracoes incidentais, generated code manual ou migracao escondida.
