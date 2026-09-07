# AGENTS - Frontend

Leia primeiro o `AGENTS.md` raiz e os documentos do harness relacionados a tarefa.

## Next.js e estrutura

- Este projeto usa Next.js 16. Antes de alterar APIs ou convencoes do framework, leia o guia pertinente em `node_modules/next/dist/docs/`.
- App Router em `src/app`; paginas devem apenas compor features. Fluxos ficam em `src/features` e recursos transversais em `src/shared`.
- Centralize contratos HTTP em `src/shared/constants/routes.ts` e use `apiClient`, `useApiQuery` e `useApiMutation`.
- Marque `use client` apenas onde hooks, estado, browser APIs ou bibliotecas client-side exigirem.

## UI e estilo

- Reutilize `src/shared/components/ui`: `Box` para containers, `Typography` para texto, `Button` para acoes e `Modal` para dialogs.
- Botoes apenas com icone precisam de `aria-label`.
- Prefira retornos antecipados, pouca profundidade logica e JSX sem logica complexa.
- Formularios usam React Hook Form, Zod e `zodResolver`; mantenha validacao coerente com os DTOs do backend.

## CRUD e dados

- Cadastros tabulares configuram o `CrudScreen` com colunas, campos de visualizacao, formulario e `sourceRoutes`.
- CRUDs em lote usam rota `deleteMany` e corpo `{ ids: string[] }`; visits usa `deleteById`.
- Models ficam dentro da feature correspondente; schemas compartilhados de cadastro estao em `src/features/schema.ts`.
- Depois de mutacoes, sincronize o cache React Query pela chave da listagem.

## Validacao

Em `frontend/`: `npm run lint` e `npm run build`. Nao ha suite automatizada de frontend detectada; valide manualmente o fluxo alterado quando aplicavel.
