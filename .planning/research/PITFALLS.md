# Pitfalls Research: Task Management App

## Pitfall 1: Prisma Connection Pool Exhaustion in Dev

**What goes wrong:** Next.js hot-reloads create new PrismaClient instances, each with its own connection pool. Results in "too many connections" errors.

**Warning signs:** Random database connection errors during development after making file changes.

**Prevention:**
- Use the globalThis singleton pattern for PrismaClient
- Configure connection_limit appropriately (default: num_cpus * 2 + 1)

**Phase:** 1 (Project Setup)

---

## Pitfall 2: Item Ordering with Integer Positions

**What goes wrong:** Using sequential integers (1, 2, 3) for section/task ordering requires bulk updates when items are reordered. Every item after the insertion point needs updating.

**Warning signs:** Slow reorder operations, race conditions with concurrent updates, N+1 update queries.

**Prevention:**
- Use fractional indexing (float-based ordering) — average neighbors' positions for new position
- Float precision allows ~53 consecutive halvings before exhaustion (theoretical; in practice much more)
- For MVP: simple `Float` column with averaging is sufficient
- If exhaustion occurs: periodic normalization (unlikely for personal use)
- Alternative: lexicographic string ordering (unlimited precision) via `fractional-indexing` package

**Phase:** 1 (Data Model) + 5 (Board View reordering)

---

## Pitfall 3: Subtask Nesting Depth Not Enforced

**What goes wrong:** Without enforcement, subtasks can create subtasks, leading to infinite nesting, broken UI, and recursive query performance issues.

**Warning signs:** UI breaks with deeply nested tasks, performance degradation on task queries.

**Prevention:**
- Enforce in service layer: check if `parentTaskId` refers to a root task (where `parentTaskId IS NULL`)
- Add Zod validation at the action layer
- UI should not render "add subtask" button on subtasks
- Test this constraint explicitly

**Phase:** 2 (API Layer) + 4 (Task UI)

---

## Pitfall 4: Timezone Handling for "Today" View

**What goes wrong:** Storing deadlines as UTC but filtering "today" based on server time shows wrong tasks for users in different timezones. Tasks appear/disappear at wrong times.

**Warning signs:** Tasks showing in "Today" view when they shouldn't, or missing from it.

**Prevention:**
- Store deadlines as ISO timestamps (UTC) in the database
- Send user's timezone offset from the browser with queries
- Filter "Today" using the user's local day boundaries, not server time
- For single-user MVP: can initially hardcode timezone or use browser timezone via client-side filtering
- Document this behavior

**Phase:** 6 (Today View)

---

## Pitfall 5: Board View / List View Data Divergence

**What goes wrong:** Board view (sections as columns) and list view (sections as groups) represent the same data differently. If the data model doesn't treat sections as the single source of truth, views can show inconsistent states.

**Warning signs:** Task appears in one view but not the other, section changes don't sync between views.

**Prevention:**
- Sections are the canonical grouping — both views read from the same data
- Tasks without a section appear in a "No Section" group/column in both views
- View toggle is purely a UI concern, not a data concern
- The `sectionId` on Task is the single source of truth

**Phase:** 5 (Project Views)

---

## Pitfall 6: N+1 Query Problems with Hierarchical Data

**What goes wrong:** Fetching projects → sections → tasks → subtasks → tags can create cascading queries. Each level multiplies the number of database calls.

**Warning signs:** Slow page loads, many sequential database queries in dev console.

**Prevention:**
- Use Prisma's `include` for eager loading: `include: { sections: { include: { tasks: { include: { subtasks: true, tags: true } } } } }`
- For sidebar counts, use a single aggregate query, not per-project queries
- Consider `select` to limit returned fields for list views

**Phase:** 2 (API Layer)

---

## Pitfall 7: Server Action Error Handling

**What goes wrong:** Server Actions that throw errors don't provide useful feedback to users. Unhandled errors crash the client component.

**Warning signs:** Blank error messages, unhandled promise rejections, forms that silently fail.

**Prevention:**
- Return structured results from Server Actions: `{ success: true, data } | { success: false, error: string }`
- Use Zod for input validation before hitting the database
- Catch Prisma-specific errors (unique constraint violations, foreign key errors) and return user-friendly messages
- Use `useActionState` or `useTransition` for loading/error states

**Phase:** 2 (API Layer) + 4 (Task UI)

---

## Pitfall 8: Cascade Deletes Destroying Too Much Data

**What goes wrong:** Deleting a workspace cascades to projects → sections → tasks → subtasks → task-tag relations. User deletes a workspace and loses everything with no undo.

**Warning signs:** User reports data loss, missing tasks after deleting a parent entity.

**Prevention:**
- Confirmation dialogs for destructive actions (delete workspace, project)
- Show impact: "This will delete 3 projects and 47 tasks"
- Consider soft delete for workspaces/projects (add `deletedAt` column) — but for MVP, hard delete with confirmation is acceptable
- Prisma's `onDelete: Cascade` handles referential integrity

**Phase:** 4 (CRUD UI) + 8 (Polish)

---

## Pitfall 9: Stale Data After Mutations

**What goes wrong:** After creating/updating/deleting a task, the sidebar counts, project views, and smart views (Today, Completed) show stale data.

**Warning signs:** Task count doesn't update after completing a task, new tasks don't appear until page refresh.

**Prevention:**
- Use `revalidatePath()` in Server Actions after mutations
- `revalidatePath('/tasks')` for sidebar (affects counts across all views)
- `revalidatePath('/tasks/[projectId]')` for project-specific changes
- For optimistic updates: use `useOptimistic` hook for instant feedback (completion toggle)

**Phase:** 2 (API Layer) + 4 (Task UI)

---

## Pitfall 10: Tailwind CSS 4 Configuration Issues with Next.js 16

**What goes wrong:** Tailwind 4 uses a different PostCSS setup than v3. Wrong configuration causes styles not to load, random warnings about PostCSS plugins.

**Warning signs:** Styles not applied, console warnings about PostCSS, Tailwind classes not working.

**Prevention:**
- Use `postcss.config.mjs` (not `.js`) with `@tailwindcss/postcss` plugin
- Import Tailwind via `@import "tailwindcss"` in globals.css
- Use `@theme inline` block for custom CSS variables
- Ensure styles are imported from within the `src/app` directory

**Phase:** 1 (Project Setup)

---
*Researched: 2026-02-10*
