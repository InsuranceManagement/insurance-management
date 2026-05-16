<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Directives

### UI Components

- Prefer reusing components from `src/shared/components/ui` before creating custom markup.
- Use the `Modal` component from `ui/modal` for all popup dialogs instead of raw shadcn `Dialog` primitives. It encapsulates the standard layout (`title`, `children`, `footer`, `trigger`).
- Use `Box` for layout containers instead of raw `div` in app-level components.
- Use `Typography` for textual content instead of raw `h1`, `p`, and `span` whenever possible.
- Use `Button` from `ui/button` for all clickable actions. Avoid native `button` unless strictly necessary.
- For icon-only buttons, always include `aria-label`.

### Code Style

- Keep indentation consistent with the existing file style.
- Avoid deep logical nesting. Prefer flatter code.
- Prefer early return over `if/else` blocks.
- Avoid long `if/else if/else` chains. Use guard clauses or mapping objects when possible.
- Keep JSX clean: move complex logic to variables, helper functions, or reusable custom hooks before `return`.

## CRUD Screen Playbook

Use this checklist when creating a new CRUD screen.

### 1) Add API Routes (if missing)

- File: `src/shared/constants/routes.ts`
- Add route group with the same shape used by `CrudScreen`:
	- `list`
	- `create`
	- `updateById`
	- `deleteById`

Example:

```ts
myEntities: {
	list: { method: "GET", path: "/my-entities" },
	create: { method: "POST", path: "/my-entities" },
	getById: { method: "GET", path: (id: string) => `/my-entities/${id}` },
	updateById: { method: "PATCH", path: (id: string) => `/my-entities/${id}` },
	deleteById: { method: "DELETE", path: (id: string) => `/my-entities/${id}` },
}
```

### 2) Create Entity Model

- File: `src/features/models/<entity-name>.ts`
- Extend `Entity` (or `EntityWithName` when needed by screen constraints).
- Create payload type for create/edit form (for example `UpsertPayload`).

Example:

```ts
import { type EntityWithName } from "@/shared/models/entity"

export interface MyEntity extends EntityWithName {
	//other props
}

export type MyEntityUpsertPayload = Pick<MyEntity, "name">
```

### 3) Create Validation Schema

- File: `src/features/schema.ts` (or split by feature if needed)
- Add Zod schema + inferred form type.
- Prefer Zod v4 style (`z.string().min(...)`) instead of `required_error`.

### 4) Create Form Component

- File: `src/features/<EntityName>Crud/components/form.tsx`
- Use `react-hook-form` + `zodResolver`.
- Use `Controller` for controlled inputs.
- Keep form contract compatible with `CrudScreen`:
	- `initialValues?: Partial<TPayload>`
	- `onSubmit: (values) => Promise<void> | void`
	- `onCancel?: () => void`
	- `submitLabel?: string`
	- `isSubmitting?: boolean`

### 5) Create Feature Screen Component

- File: `src/features/<EntityName>Crud/<entity-name>-crud.tsx`
- This component configures and calls `CrudScreen`.

### 6) Configure Table Columns

- In feature screen, create `columns: ColumnDef<MyEntity>[]`.
- Use simple `accessorKey` + optional `cell` renderers.
- Reuse `Box` and `Typography` for consistent visual language.

### 7) Configure View Screen (EntityViewModal)

- In feature screen, create `viewFields: EntityViewField<MyEntity>[]`.
- Keep format similar to table columns:
	- `accessorKey`
	- `label`
	- optional `cell`
- Pass to `CrudScreen`:
	- `viewFields`
	- `viewModalTitle`
	- `viewModalSubtitle`

### 8) Wire CrudScreen Props

- Pass all required props from feature screen:
	- `columns`
	- `createForm`
	- `sourceRoutes`
	- `mapEditEntityToFormValues`
	- `viewFields`

Example:

```tsx
<CrudScreen<MyEntity, MyEntityUpsertFormValues>
	title="My Entities"
	columns={columns}
	createForm={MyEntityForm}
	createFormTitle="Nova entidade"
	editFormTitle="Editar entidade"
	mapEditEntityToFormValues={(entity) => ({ name: entity.name })}
	viewFields={viewFields}
	viewModalTitle="Detalhes"
	viewModalSubtitle={(entity) => `#${entity.id}`}
	sourceRoutes={{
		list: routes.myEntities.list,
		create: routes.myEntities.create,
		edit: routes.myEntities.updateById,
		delete: routes.myEntities.deleteById,
	}}
/>
```

### 9) Create App Page

- File: `src/app/<route-segment>/page.tsx`
- Render the feature CRUD component only.

Example:

```tsx
import MyEntityCrud from "@/features/MyEntityCrud/my-entity-crud"

export default function Page() {
	return <MyEntityCrud />
}
```

### 10) Add Sidebar Item

- File: `src/shared/components/AppSidebar/app-sidebar.tsx`
- Add item in `supportItems` (or `mainItems` depending on section).
- Keep `href` aligned with `app/<route-segment>/page.tsx`.

### 11) Quick Validation

- Open screen and test:
	- list loading
	- create modal + submit
	- edit modal + submit
	- delete flow
	- view modal
- Ensure labels/messages follow project language and style.
