# Padroes de codigo

## Gerais

- TypeScript e a linguagem dos dois aplicativos; prefira tipos explicitos nas bordas e evite `any` novo.
- Use os aliases existentes: `@/*` aponta para `backend/src/*` ou `frontend/src/*`; backend tambem usa `@generated/prisma`.
- Siga o estilo do arquivo tocado. Backend usa majoritariamente aspas simples e sem ponto e virgula; frontend usa majoritariamente aspas duplas e sem ponto e virgula.
- Nomes tecnicos e rotas sao em ingles; textos de usuario sao predominantemente pt-BR.

## Backend

- Nomeie classes por papel: `*Controller`, `*Service`, `*Repository`, `*Dto`; interfaces internas ficam em `inputs/` e entidades em `entities/`.
- DTOs de criacao devem declarar e validar cada campo. Updates parciais podem usar `PartialType`; preserve a excecao de notifications, cujo PUT exige todas as sete chaves, mesmo quando nulas.
- O pipe global transforma valores, remove apenas campos permitidos e rejeita propriedades extras; nao dependa de dados nao declarados.
- Lance excecoes Nest coerentes com as regras atuais: `NotFoundException` para agregado/referencia ausente, `BadRequestException` para duplicidade/intervalo invalido e `UnauthorizedException` para credenciais.
- Listagens ativas devem filtrar `deletedAt: null`. Ao mapear Prisma, prefira `Prisma.<Model>GetPayload` e `Entity.fromPrisma`.
- Operacoes batch de cadastros recebem `DeleteManyDto` com `ids` nao vazio e unico. Nao converta exclusao soft em fisica sem decisao explicita.
- Datas HTTP sao ISO 8601; converta para `Date` no repository e devolva tipos coerentes.

## Frontend

- Antes de usar APIs do Next.js, consulte a documentacao instalada para a versao 16.
- Paginas devem ser pequenas; componentes interativos recebem `use client` no limite mais baixo possivel.
- Reutilize `Box`, `Typography`, `Button`, `Modal` e demais componentes em `src/shared/components/ui`.
- Formularios usam React Hook Form + Zod; schemas devem espelhar validacoes relevantes dos DTOs, inclusive CPF/CNPJ, telefone, CEP e senha.
- Nao chame Axios diretamente em features novas: adicione a rota em `frontend/src/shared/constants/routes.ts` e use os hooks compartilhados.
- Defina chaves de query estaveis e invalide a listagem depois de mutacoes.
- Use guard clauses e extraia logica complexa do JSX. Botoes icon-only precisam de `aria-label`.
