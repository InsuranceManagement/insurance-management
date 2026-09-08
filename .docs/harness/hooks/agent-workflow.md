# Workflow do agente

## Antes de comecar

1. Leia o `AGENTS.md` aplicavel, `.docs/harness/prompts/base-context.md` e os documentos roteados para a tarefa.
2. Verifique `git status --short`; identifique alteracoes do usuario e preserve-as.
3. Delimite backend, frontend ou ambos. Nao inspecione nem altere `infra/`.
4. Localize implementacao e testes com `rg`; trate o codigo como evidencia primaria.
5. Se a decisao depender de regra de produto ausente, registre a pergunta ou peca direcao em vez de inventar.

## Enquanto trabalha

- Mantenha a mudanca no menor conjunto coerente de camadas.
- Backend: atualize DTO/input/entity/service/repository/schema conforme a responsabilidade; nunca edite o Prisma gerado.
- Frontend: mantenha paginas finas, rotas HTTP centralizadas e reutilize UI/hooks existentes.
- Ao mudar contrato, sincronize backend, `frontend/src/shared/constants/routes.ts`, models/schemas/hooks frontend, Swagger e testes afetados.
- Nao misture formatacao ou refatoracao alheia ao objetivo.
- Nao registre nem copie segredos, tokens, senhas, hashes ou PII para docs/testes.

## Antes de finalizar

1. Revise o diff e confirme que mudancas pre-existentes nao foram absorvidas.
2. Rode a menor validacao relevante e depois os comandos completos indicados em `.docs/harness/instructions/testing.md` quando viavel.
3. Como `backend npm run lint` usa `--fix`, revise novamente o diff apos executa-lo.
4. Confirme imports, contratos HTTP, filtros de `deletedAt`, migracao/client Prisma e estados de erro/loading quando aplicaveis.
5. Verifique que toda documentacao referenciada existe e que fatos novos usam os rotulos do harness.

## Relatorio

- Comece pelo resultado.
- Liste arquivos/areas alterados e validacoes com sucesso.
- Informe comandos nao executados, falhas e dependencia de banco/ambiente.
- Separe claramente `Detectado`, `Inferencia` e `Pergunta em aberto`.
- Mencione riscos residuais concretos; nao declare sucesso sem evidencia.
