# Skill: corrigir bug

## Quando usar

Para comportamento incorreto, regressao, erro de contrato, falha de build/teste ou inconsistencia entre backend e frontend.

## Leitura obrigatoria

- `AGENTS.md` aplicavel, `.docs/harness/prompts/base-context.md` e `.docs/harness/hooks/agent-workflow.md`.
- `.docs/harness/instructions/coding-standards.md`, `.docs/harness/instructions/testing.md`, `.docs/harness/instructions/security.md`.
- Specs do dominio/API/dados afetados.

## Passos

1. Registre esperado, atual e uma reproducao minima.
2. Rastreie do sintoma ate a causa: tela/hook/rota ou controller/DTO/service/repository/schema.
3. Verifique causas recorrentes: contrato divergente, cache nao invalidado, campo rejeitado pelo pipe, `deletedAt` ausente, relacao nao incluida, data/timezone, JWT/CORS ou servico externo.
4. Escreva um teste que falhe pela causa quando houver harness de teste; nao fixe apenas o sintoma.
5. Aplique a menor correcao coerente com as camadas e sincronize consumidores.
6. Rode o teste de regressao, testes relacionados, lint e build.
7. Revise se a correcao muda dados, seguranca ou compatibilidade.

## Comandos

- Backend: `npm run test -- <spec>`, depois `npm run format:check`, `npm run lint`, `npm run build`, `npm run test`; e2e se necessario/viavel.
- Frontend: `npm run lint`, `npm run build` e reproducao manual documentada.

## Conclusao

- A causa raiz esta explicada e a reproducao nao falha mais.
- Ha teste de regressao ou justificativa concreta para sua ausencia.
- Nao houve mudanca colateral de exclusao, auth, dados ou contrato.
