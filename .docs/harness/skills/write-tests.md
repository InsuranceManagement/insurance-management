# Skill: escrever testes

## Quando usar

Para ampliar cobertura, proteger regra existente, caracterizar legado ou criar regressao de bug.

## Leitura obrigatoria

- `AGENTS.md`, `.docs/harness/prompts/base-context.md`, `.docs/harness/hooks/agent-workflow.md`.
- `.docs/harness/instructions/testing.md`, `.docs/harness/instructions/coding-standards.md` e `.docs/harness/instructions/security.md`.
- Codigo e specs do comportamento testado.

## Passos

1. Identifique o contrato observavel e os ramos de maior risco.
2. Escolha a menor camada fiel:
   - service unitario com repository mockado para regras;
   - repository/integracao para Prisma e soft delete;
   - e2e para guards, DTOs, status e wiring;
   - frontend para usuario/cache/renderizacao quando um runner for introduzido.
3. Cubra caminho feliz, ausente/duplicado/invalido e limites relevantes.
4. Use dados sinteticos; nunca copie PII, tokens, hashes ou segredos reais/seed.
5. Torne tempo, aleatoriedade e integracoes externas deterministicas por mock/fake.
6. Garanta isolamento e cleanup do banco em testes de integracao.
7. Rode o arquivo isolado e a suite.

## Comandos

- Backend: `npm run test -- <arquivo>`, `npm run test`, `npm run test:cov`; e2e com banco configurado.
- Qualidade backend: `npm run format:check`, `npm run lint`, `npm run build`.
- Frontend: antes de adicionar testes, registre e configure explicitamente runner/script; sempre rode `npm run lint` e `npm run build`.

## Conclusao

- Testes falham pelo comportamento errado e passam pelo correto.
- Nomes descrevem regra, fixtures sao seguras e nao ha dependencia de ordem.
- Lacunas de ambiente/cobertura estao declaradas.
