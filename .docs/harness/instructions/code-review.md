# Revisao de codigo

## Ordem da revisao

1. Confirme o objetivo e se o diff preserva mudancas pre-existentes.
2. Mapeie o impacto entre backend, frontend, Prisma e integracao de notificacoes.
3. Verifique comportamento e regras de dominio antes de estilo.
4. Verifique seguranca, dados e compatibilidade do contrato.
5. Confira testes, comandos executados e riscos residuais.

## Checklist backend

- Controller fino, DTO correto, Swagger e status HTTP coerentes.
- Regra no service e acesso Prisma no repository.
- Referencias e unicidade validadas antes de persistir quando o modulo promete mensagem de dominio.
- Consultas/listagens de modelos soft-delete filtram `deletedAt: null`.
- Exclusao preserva a estrategia do agregado; batch usa `DeleteManyDto`.
- Entity/response nao vaza campos internos; mapper cobre includes opcionais e nulos.
- Schema tem migracao correspondente e client gerado nao foi editado.
- Auth publica apenas o necessario; rate limit, timeout e resposta neutra permanecem.

## Checklist frontend

- Endpoint esta centralizado e coincide em metodo/path/body com o controller.
- Model e Zod coincidem com DTO e formato de datas/respostas.
- Query keys e invalidacoes evitam dados obsoletos.
- Loading, vazio, erro e pending estao tratados; acoes repetidas ficam bloqueadas quando necessario.
- Pagina apenas compoe feature; UI compartilhada e acessibilidade foram reutilizadas.
- Mudancas de Next.js seguem docs locais da v16 e nao ampliam `use client` sem necessidade.

## Como reportar

- Liste achados por severidade, com arquivo/linha, impacto observavel e correcao recomendada.
- Diferencie defeito comprovado de inferencia ou pergunta de produto.
- Se nao houver achados, declare isso e registre lacunas de teste/validacao.
