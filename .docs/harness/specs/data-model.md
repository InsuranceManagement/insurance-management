# Modelo de dados detectado

Fonte autoritativa: `backend/prisma/schema.prisma`. Banco: PostgreSQL; Prisma Client gerado em `backend/generated/prisma`.

## Modelos

| Model Prisma | Chave e campos principais | Relacoes | Exclusao |
| --- | --- | --- | --- |
| `User` | UUID; name; email unique; password; campos de reset; timestamps | Nenhuma | Soft por `deletedAt` |
| `InsuranceCompany` | UUID; name; color; timestamps | 1:N `Products` | Soft |
| `ProductType` | ID string fornecido; name unique; description | 1:N `Products` | Soft |
| `Products` | ID string fornecido; name; FKs de tipo/seguradora | N:1 ProductType, N:1 InsuranceCompany, N:N Client | Soft |
| `Client` | UUID; name; email unique; cpf/cnpj unique opcionais; phone; birthDate | N:N Products, 1:1 Address, 1:N Visit | Soft |
| `Address` | UUID; dados postais; clientId unique | Pertence a Client | Campo `deletedAt`; sem rota propria |
| `ChartType` | ID string; name unique; description; size | 1:N Chart | Fisica |
| `Chart` | ID string; name unique; apiRoute; order; unit?; chartTypeId | N:1 ChartType | Fisica |
| `Visit` | UUID; name; description; clientId; date | N:1 Client | Campo `deletedAt`, mas rota apaga fisicamente |

Todos possuem `createdAt` e `updatedAt`; todos exceto Chart e ChartType possuem `deletedAt`.

## Relacoes e integridade

- A relacao Client-Products e N:N implicita; Prisma administra a tabela de juncao.
- Address tem `clientId @unique`, impondo no maximo um endereco por cliente.
- Product exige ProductType e InsuranceCompany existentes por foreign key.
- Visit exige Client existente por foreign key; o service restringe a cliente ativo.
- Nao ha `onDelete` explicito no schema; use o comportamento Prisma/banco vigente e teste deletes fisicos com relacoes.
- Nao ha indices explicitos alem de PKs e uniques declarados.

## Semantica de repository

- Listagens de User, InsuranceCompany, ProductType, Products e Client filtram `deletedAt: null`.
- Dashboard tambem exclui registros soft-deleted e relacoes com produtos/tipos inativos.
- Client cria Address aninhado, conecta Product IDs e substitui a associacao com `set` no update.
- Soft delete batch marca timestamp. Existem metodos individuais que anonimizam alguns campos unicos, mas os controllers atuais usam batch; nao presuma liberacao de e-mail/CPF/CNPJ apos exclusao.
- Chart e ChartType usam `deleteMany`; Visit usa `deleteMany` por ID e remove a linha.

## IDs

- User, InsuranceCompany, Client, Address e Visit usam UUID default do banco.
- Product recebe `randomUUID()` no repository.
- ProductType deriva ID do nome: trim, espacos para underscore, uppercase.
- Chart e ChartType atualmente usam o nome como ID sem normalizacao; update de nome pode atualizar o ID.

## Migrations e seed

- Migrations ficam em `backend/prisma/migrations`; `prisma.config.ts` configura schema, migrations e seed.
- `backend/prisma/seed.ts` percorre `seedData` e faz upsert por `id`.
- O seed inclui user, catalogos, charts, seguradoras, produtos, clientes e enderecos. Trate credenciais/dados de seed como sensiveis e nao os replique no harness.

## Mudancas

1. Altere `schema.prisma`.
2. Gere/revise uma migracao com nome descritivo.
3. Execute `npm run prisma:generate`.
4. Atualize inputs/DTOs/entities/repositories e consumidores frontend.
5. Valide migracao sobre banco descartavel antes de dados reais.
