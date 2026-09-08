# AGENTS - Insurance Management

Roteador raiz para agentes de codigo. O harness usa a implementacao como fonte primaria.

## Leitura obrigatoria

- `.docs/harness/README.md`
- `.docs/harness/prompts/base-context.md`
- `.docs/harness/hooks/agent-workflow.md`
- As instrucoes, specs e skills relacionadas a tarefa.
- Para backend, tambem `backend/AGENTS.md`.
- Para frontend, tambem `frontend/AGENTS.md`.

## Roteamento

- Arquitetura e limites: `.docs/harness/instructions/architecture.md` e `.docs/harness/specs/architecture.md`.
- Convencoes: `.docs/harness/instructions/coding-standards.md`.
- Testes e validacao: `.docs/harness/instructions/testing.md`.
- Autenticacao, dados sensiveis ou integracoes: `.docs/harness/instructions/security.md`.
- Revisao: `.docs/harness/instructions/code-review.md`.
- Produto, dominio, API e persistencia: o arquivo correspondente em `.docs/harness/specs/`.
- Implementar, corrigir, testar, refatorar ou revisar: a skill correspondente em `.docs/harness/skills/`.

## Regras do repositorio

- Fonte: `source`. Confirme fatos no codigo e cite caminhos.
- Use `Detectado`, `Inferencia`, `Desconhecido` ou `Pergunta em aberto` ao registrar conhecimento.
- `infra/` esta fora do escopo: nao inspecione, altere, documente nem use como evidencia.
- Preserve mudancas nao relacionadas e nunca exponha segredos de arquivos de ambiente.
- Nao edite `backend/generated/prisma`; altere o schema e gere o client.
- Nao roteie tarefas normais para `.docs/harness/requests/`.

## Validacao

- Backend: em `backend/`, execute `npm run format:check`, `npm run lint`, `npm run build`, `npm run test`; use `npm run test:e2e` quando banco e ambiente permitirem. O lint aplica correcoes: revise o diff.
- Frontend: em `frontend/`, execute `npm run lint` e `npm run build`.

## Caminhos importantes

- Backend: `backend/src`, `backend/prisma/schema.prisma`, `backend/prisma/migrations`.
- Frontend: `frontend/src/app`, `frontend/src/features`, `frontend/src/shared`.

Antes de finalizar, siga `.docs/harness/hooks/agent-workflow.md`.
