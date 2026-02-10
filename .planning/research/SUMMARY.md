# Research Summary: Task Management App

## Stack Recommendation

**Core:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
**Database:** PostgreSQL + Prisma 7 (singleton pattern)
**Tooling:** Biome (lint/format) + Vitest (tests) + Zod (validation)
**Utilities:** clsx (classnames), server-only (boundary enforcement)
**Optional:** nuqs (URL state), fractional-indexing (ordering)

Match personal-brand site: fonts (Playfair Display, Inter, JetBrains Mono), theme tokens (navy/gold/beige), card patterns.

## Table Stakes Features

- Task CRUD with completion toggle
- Hierarchical organization (Workspaces → Projects → Sections → Tasks)
- Due dates/deadlines
- List view grouped by section
- Sidebar navigation with task counts
- Search by name/description

## Differentiating Features (In Scope)

- Board/Kanban view (sections as columns)
- Subtasks (1 level only, enforced)
- Tags/labels with filtering
- Today + Completed smart views
- Quick-add task modal
- View toggle (List/Board)

## Architecture Highlights

- **Layout:** Persistent sidebar via Next.js layout (state preserved on navigation)
- **Data flow:** Server Components fetch → Client Components interact → Server Actions mutate → revalidatePath
- **Subtask constraint:** Enforced in service layer (check parent's parentTaskId is null)
- **Ordering:** Float-based fractional indexing for sections/tasks
- **Sections:** Single source of truth for both List and Board views

## Critical Pitfalls to Avoid

1. **Prisma connection pool** — Use globalThis singleton pattern
2. **Item ordering** — Use fractional indexing, not sequential integers
3. **Subtask nesting** — Enforce 1-level limit in service layer + UI
4. **Timezone for Today** — Filter using browser timezone, store UTC
5. **N+1 queries** — Use Prisma `include` for eager loading
6. **Stale data** — `revalidatePath()` after every mutation
7. **Cascade deletes** — Confirmation dialogs showing impact
8. **Tailwind 4 config** — `postcss.config.mjs` + `@tailwindcss/postcss`

## Build Order

1. Project setup + data model + migrations
2. API layer (Server Actions + Services)
3. Layout + Sidebar + Navigation
4. Task CRUD UI (forms, cards, modals)
5. Project views (List + Board)
6. Smart views (Today, Completed, Search, Tags)
7. Polish + Tests + Quality gates

---
*Synthesized: 2026-02-10*
