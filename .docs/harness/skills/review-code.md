# Skill: revisar codigo

## Quando usar

Para revisar diff, branch, commit ou implementacao sem necessariamente altera-la.

## Leitura obrigatoria

- `AGENTS.md`, `.docs/harness/prompts/base-context.md`, `.docs/harness/hooks/agent-workflow.md`.
- `.docs/harness/instructions/code-review.md`, `.docs/harness/instructions/security.md`, `.docs/harness/instructions/testing.md`.
- Specs e `AGENTS.md` locais das areas tocadas.

## Passos

1. Leia status/diff e separe mudancas do escopo de alteracoes pre-existentes.
2. Entenda o comportamento anterior e novo no codigo, nao apenas na descricao.
3. Trace mudancas de API entre controller/DTO e routes/models/hooks do frontend.
4. Revise regras de dominio, relacoes, `deletedAt`, batches, datas e integracao externa.
5. Procure falhas de auth, validacao, exposicao de dados, XSS e segredos.
6. Avalie testes contra os ramos alterados; rode checks somente quando autorizado/viavel.
7. Reporte primeiro bugs acionaveis por severidade; inclua caminho/linha, impacto e correcao.

## Comandos

- Inspecao: `git status --short`, `git diff --check`, `git diff`, `rg`.
- Backend: `npm run format:check`, `npm run lint`, `npm run build`, `npm run test` quando apropriado. Lint pode editar.
- Frontend: `npm run lint`, `npm run build`.

## Conclusao

- Cada achado e reproduzivel ou sustentado por fluxo concreto.
- Inferencias/perguntas estao rotuladas e separadas de defeitos.
- Se nao houver achados, validacoes e lacunas de teste sao informadas.
