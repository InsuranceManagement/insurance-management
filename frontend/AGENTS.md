<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Directives

### UI Components

- Prefer reusing components from `src/shared/components/ui` before creating custom markup.
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
