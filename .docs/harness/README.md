# Harness - Insurance Management

## Estado e fonte

- **Modo:** `source`.
- **Gerado em:** 2026-09-07.
- **Detectado:** nao existem os inputs opcionais project-plan/project-analysis nem metadados equivalentes; o codigo e a configuracao dos aplicativos sao a evidencia primaria.
- **Escopo excluido:** `infra/` nao foi usado como fonte e nao deve ser roteado por este harness.

## Como usar

1. Leia `.docs/harness/prompts/base-context.md` e `.docs/harness/hooks/agent-workflow.md`.
2. Abra somente as instructions e specs relacionadas a tarefa.
3. Use uma skill para fluxos de implementacao, correcao, testes, refatoracao ou revisao.
4. Reconfirme no codigo qualquer fato que possa ter mudado desde esta geracao.

## Mapa

| Necessidade | Documento |
| --- | --- |
| Contexto rapido | `.docs/harness/prompts/base-context.md` |
| Arquitetura e limites | `.docs/harness/instructions/architecture.md`, `.docs/harness/specs/architecture.md` |
| Padroes de implementacao | `.docs/harness/instructions/coding-standards.md` |
| Testes | `.docs/harness/instructions/testing.md` |
| Seguranca | `.docs/harness/instructions/security.md` |
| Revisao | `.docs/harness/instructions/code-review.md` |
| Produto e funcionalidades | `.docs/harness/specs/project-overview.md`, `.docs/harness/specs/features.md` |
| Dominio, API e banco | `.docs/harness/specs/domain.md`, `.docs/harness/specs/api.md`, `.docs/harness/specs/data-model.md` |
| Fluxos operacionais | `.docs/harness/skills/*.md` |

## Convencao de evidencias

- **Detectado:** observado diretamente no codigo ou configuracao.
- **Inferencia:** conclusao plausivel que nao esta expressa como contrato.
- **Desconhecido:** a fonte disponivel nao responde.
- **Pergunta em aberto:** decisao necessaria para evitar uma suposicao de produto.

## Perguntas em aberto

- Qual e o modelo de autorizacao pretendido? Hoje qualquer JWT valido alcanca todas as rotas protegidas; nao ha papeis ou ownership detectados.
- A exclusao fisica de visits, charts e chart types e intencional, apesar de outros cadastros usarem soft delete?
- Qual e o contrato operacional/SLA do servico externo de notificacoes?
- Qual nivel de cobertura e quais fluxos frontend devem receber testes automatizados?

O inventario autoritativo deste harness esta em `.docs/harness/manifest.json`.
