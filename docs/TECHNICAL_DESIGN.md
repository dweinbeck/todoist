# Technical Design

## System Architecture

Tasks is a server-rendered Next.js 16 application using the App Router with React Server Components for data fetching and Server Actions for mutations. The architecture follows a layered pattern: **Pages** (server components that fetch data) call **Services** (business logic and Prisma queries), while **Client Components** (interactive UI) invoke **Server Actions** (thin orchestration layer that validates input via Zod schemas, delegates to services, and triggers path revalidation).

Data is stored in PostgreSQL accessed through Prisma ORM. The application uses a singleton Prisma client pattern to avoid connection pool exhaustion during development hot reloads. All UI components are custom-built with Tailwind CSS 4 -- no external component library is used.

```
+---------------------------+
|        Browser            |
|  (React 19 Client)       |
+---------------------------+
        |           ^
        | Server    | HTML/RSC
        | Actions   | Payload
        v           |
+---------------------------+
|   Next.js 16 App Router   |
|                           |
|  Pages (Server Components)|
|     |           |         |
|  Services    Actions      |
|  (business   ("use server"|
|   logic)      validate +  |
|     |         revalidate) |
|     v                     |
|  Prisma Client            |
+---------------------------+
        |
        v
+---------------------------+
|     PostgreSQL            |
|  (Prisma Postgres local)  |
+---------------------------+
```

## Directory Structure

```
tasks/
├── prisma/
│   └── schema.prisma               # Database schema (6 models)
├── prisma.config.ts                 # Prisma engine + datasource config
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (fonts, metadata)
│   │   ├── globals.css              # Theme tokens (CSS custom properties)
│   │   ├── page.tsx                 # Root redirect to /tasks
│   │   └── tasks/
│   │       ├── layout.tsx           # Tasks layout (sidebar + main area)
│   │       ├── page.tsx             # Welcome/default tasks page
│   │       ├── today/
│   │       │   └── page.tsx         # Today smart view
│   │       ├── completed/
│   │       │   ├── page.tsx         # Completed smart view
│   │       │   └── completed-view.tsx  # Client: project filter
│   │       ├── search/
│   │       │   ├── page.tsx         # Search smart view
│   │       │   └── search-input.tsx # Client: search input
│   │       ├── tags/
│   │       │   ├── page.tsx         # Tag list view
│   │       │   ├── tag-list.tsx     # Client: tag CRUD
│   │       │   └── [tagId]/
│   │       │       └── page.tsx     # Tasks filtered by tag
│   │       └── [projectId]/
│   │           ├── page.tsx         # Project page (server fetch)
│   │           └── project-view.tsx # Client: list/board toggle
│   ├── components/
│   │   ├── ui/                      # Shared UI primitives
│   │   │   ├── badge.tsx            # Colored tag badge
│   │   │   ├── button.tsx           # Button with variants
│   │   │   ├── confirm-dialog.tsx   # Delete confirmation modal
│   │   │   ├── input.tsx            # Styled input
│   │   │   └── modal.tsx            # Dialog modal (native <dialog>)
│   │   └── tasks/                   # Task-specific components
│   │       ├── add-section-button.tsx
│   │       ├── add-task-button.tsx
│   │       ├── board-view.tsx       # Board/Kanban layout
│   │       ├── quick-add-modal.tsx  # Global quick-add task modal
│   │       ├── section-header.tsx   # Section name + delete
│   │       ├── sidebar.tsx          # Navigation sidebar
│   │       ├── subtask-list.tsx     # Subtask display + inline add
│   │       ├── task-card.tsx        # Task card with expand/edit/delete
│   │       └── task-form.tsx        # Task create/edit form
│   ├── actions/                     # Server Actions
│   │   ├── project.ts
│   │   ├── section.ts
│   │   ├── tag.ts
│   │   ├── task.ts
│   │   └── workspace.ts
│   ├── services/                    # Business logic + Prisma queries
│   │   ├── project.service.ts
│   │   ├── section.service.ts
│   │   ├── tag.service.ts
│   │   ├── task.service.ts
│   │   └── workspace.service.ts
│   ├── lib/
│   │   ├── db.ts                    # Prisma singleton client
│   │   ├── utils.ts                 # cn() class name utility
│   │   └── schemas/                 # Zod validation schemas
│   │       ├── project.ts
│   │       ├── section.ts
│   │       ├── tag.ts
│   │       ├── task.ts
│   │       └── workspace.ts
│   ├── types/
│   │   └── index.ts                 # Composite TypeScript types
│   ├── generated/
│   │   └── prisma/                  # Auto-generated Prisma client
│   └── __tests__/
│       ├── schemas.test.ts          # Zod schema validation tests
│       ├── subtask-nesting.test.ts  # One-level nesting constraint tests
│       └── today-filter.test.ts     # Today date boundary tests
├── biome.json                       # Biome linter/formatter config
├── vitest.config.ts                 # Vitest test config
├── tsconfig.json                    # TypeScript config
├── next.config.ts                   # Next.js config
├── postcss.config.mjs               # PostCSS with Tailwind plugin
├── package.json                     # Dependencies and scripts
└── .env                             # DATABASE_URL (local dev)
```

## Data Flows

### Read Path (Server Components)

1. User navigates to a page (e.g., `/tasks/[projectId]`)
2. Next.js renders the server component page
3. Page calls service functions (e.g., `getProject(projectId)`, `getTags()`) in parallel via `Promise.all`
4. Services execute Prisma queries with includes/relations
5. Typed data is returned to the page component
6. Page passes data as props to client components for interactivity

### Write Path (Server Actions)

1. User interacts with a client component (e.g., submits task form)
2. Client component calls a Server Action (e.g., `createTaskAction`)
3. Server Action validates input with Zod `safeParse()`
4. On validation failure: returns `{ error: string }` to the client
5. On validation success: delegates to the service function (e.g., `createTask()`)
6. Service executes Prisma mutation
7. Server Action calls `revalidatePath("/tasks")` to invalidate cached data
8. Returns `{ success: true }` or `{ error: string }` to the client
9. React re-renders affected server components with fresh data

### Sidebar Data Flow

1. `tasks/layout.tsx` (server component) fetches workspaces with projects and tags
2. Workspace query includes `_count.tasks` filtered to `status: "OPEN"` and `parentTaskId: null`
3. Data is mapped to `SidebarWorkspace[]` shape and passed to the Sidebar client component
4. Sidebar renders workspace tree, project links with open-task counts, and nav items

## API Contracts

The application uses Next.js Server Actions rather than REST API endpoints. All mutations are invoked directly from client components.

### Task Actions

**`createTaskAction`**
```json
// Input
{
  "projectId": "string (required)",
  "sectionId": "string | null (optional)",
  "parentTaskId": "string | null (optional)",
  "name": "string (required, 1-500 chars)",
  "description": "string (optional, max 5000 chars)",
  "deadlineAt": "string | null (ISO datetime, optional)",
  "tagIds": "string[] (optional)"
}

// Output (success)
{ "success": true, "taskId": "string" }

// Output (error)
{ "error": "string" }
```

**`updateTaskAction`**
```json
// Input
{
  "id": "string (required)",
  "name": "string (optional, 1-500 chars)",
  "description": "string | null (optional, max 5000 chars)",
  "deadlineAt": "string | null (optional)",
  "sectionId": "string | null (optional)",
  "tagIds": "string[] (optional)"
}

// Output
{ "success": true } | { "error": "string" }
```

**`deleteTaskAction(id: string)`**
```json
// Output
{ "success": true }
```

**`toggleTaskAction(id: string)`**
```json
// Output
{ "success": true }
```

**`assignTaskToSectionAction(taskId: string, sectionId: string | null)`**
```json
// Output
{ "success": true }
```

### Project Actions

**`createProjectAction(formData: FormData)`**
- Fields: `workspaceId` (required), `name` (required, 1-100 chars)
- Output: `{ success: true, projectId: string }` | `{ error: string }`

**`updateProjectAction(formData: FormData)`**
- Fields: `id` (required), `name` (required, 1-100 chars)
- Output: `{ success: true }` | `{ error: string }`

**`deleteProjectAction(id: string)`**
- Output: `{ success: true }`

### Workspace Actions

**`createWorkspaceAction(formData: FormData)`**
- Fields: `name` (required, 1-100 chars)
- Output: `{ success: true }` | `{ error: string }`

**`updateWorkspaceAction(formData: FormData)`**
- Fields: `id` (required), `name` (required, 1-100 chars)
- Output: `{ success: true }` | `{ error: string }`

**`deleteWorkspaceAction(id: string)`**
- Output: `{ success: true }`

### Section Actions

**`createSectionAction(formData: FormData)`**
- Fields: `projectId` (required), `name` (required, 1-100 chars)
- Output: `{ success: true }` | `{ error: string }`

**`updateSectionAction(formData: FormData)`**
- Fields: `id` (required), `name` (required, 1-100 chars)
- Output: `{ success: true }` | `{ error: string }`

**`deleteSectionAction(id: string)`**
- Output: `{ success: true }`

### Tag Actions

**`createTagAction`**
```json
// Input
{
  "name": "string (required, 1-50 chars)",
  "color": "string | null (optional, max 7 chars, hex color)"
}

// Output
{ "success": true, "tagId": "string" } | { "error": "string" }
```

**`updateTagAction`**
```json
// Input
{
  "id": "string (required)",
  "name": "string (optional, 1-50 chars)",
  "color": "string | null (optional, max 7 chars)"
}

// Output
{ "success": true } | { "error": "string" }
```

**`deleteTagAction(id: string)`**
- Output: `{ success: true }`

## Data Models

### Workspace
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | Primary key, CUID |
| name | String | Required |
| projects | Project[] | One-to-many |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### Project
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | Primary key, CUID |
| workspaceId | String | FK -> Workspace (cascade delete) |
| name | String | Required |
| sections | Section[] | One-to-many |
| tasks | Task[] | One-to-many |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### Section
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | Primary key, CUID |
| projectId | String | FK -> Project (cascade delete) |
| name | String | Required |
| order | Float | Default 0 (fractional indexing) |
| tasks | Task[] | One-to-many |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### Task
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | Primary key, CUID |
| projectId | String | FK -> Project (cascade delete) |
| sectionId | String? | FK -> Section (set null on delete) |
| parentTaskId | String? | FK -> Task self-relation (cascade delete) |
| subtasks | Task[] | One-to-many self-relation |
| name | String | Required |
| description | String? | Optional |
| deadlineAt | DateTime? | Optional |
| status | String | Default "OPEN"; values: "OPEN", "COMPLETED" |
| order | Float | Default 0 (fractional indexing) |
| tags | TaskTag[] | Many-to-many via junction |
| createdAt | DateTime | Auto-generated |
| updatedAt | DateTime | Auto-updated |

### Tag
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | Primary key, CUID |
| name | String | Required, unique |
| color | String? | Optional hex color |
| tasks | TaskTag[] | Many-to-many via junction |

### TaskTag (Junction Table)
| Field | Type | Constraints |
|-------|------|-------------|
| taskId | String | FK -> Task (cascade delete) |
| tagId | String | FK -> Tag (cascade delete) |
| | | Composite PK: (taskId, tagId) |

## Error Handling

### Validation Layer
- All inputs are validated with Zod schemas in Server Actions before reaching services
- Validation errors return `{ error: "first issue message" }` to the client
- Client components display errors inline above the form

### Service Layer
- Business rule violations (e.g., subtask nesting) throw `Error` with descriptive messages
- Task Actions catch these errors and return `{ error: message }` to the client
- Project, workspace, section, and tag actions do not have try/catch wrappers -- Prisma errors propagate to Next.js error boundaries

### Database Layer
- Prisma handles constraint violations (unique tags, FK references)
- Cascade deletes are configured at the schema level (no orphaned records)
- `onDelete: SetNull` on Task.sectionId ensures tasks survive section deletion

### Client Layer
- Loading states are tracked in component state to disable buttons during mutations
- Confirmation dialogs are shown before destructive actions (delete workspace, project, section, task)
- Subtask creation alerts on error via `window.alert()` (simplified for MVP)

## Integration Points

| System | Integration Type | Details |
|--------|-----------------|---------|
| PostgreSQL (Prisma Postgres) | Database | Local dev server via `prisma dev`; connection string in DATABASE_URL |
| dan-weinbeck.com | Visual consistency | Replicated CSS custom properties, fonts, and card patterns (no runtime integration) |
| Vercel (planned) | Deployment | Standard Next.js deployment target; `.vercel` in gitignore |

## Architecture Decision Records

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Standalone app (not embedded in personal-brand) | Keeps concerns separate; own DB and independent deploy | Good -- clean separation |
| Postgres + Prisma (not Firebase) | Production-ready relational DB for hierarchical data; type-safe ORM | Good -- strong relational model |
| Replicate theme tokens (not import from personal-brand) | Standalone app cannot import from another repo; CSS custom properties are easily copied | Good -- no cross-repo dependency |
| Server Actions (not REST API) | Next.js native pattern; reduces boilerplate; type-safe end-to-end | Good -- minimal plumbing |
| Services layer between Actions and Prisma | Testable business logic; Actions stay thin (validate, delegate, revalidate) | Good -- clean separation of concerns |
| Prisma singleton pattern in dev | Avoids connection pool exhaustion from HMR re-creating PrismaClient | Good -- prevents "too many clients" errors |
| One-level subtask nesting (app logic, not DB constraint) | Simplicity; database allows arbitrary nesting but application layer enforces the rule | Good -- flexible yet constrained |
| Fractional indexing (Float order field) | Enables inserting items between existing ones without reindexing all siblings | Good -- efficient reordering |
| Zod v4 for validation | Modern schema validation; coerces dates from strings; `.issues[0].message` error pattern | Good -- clean validation flow |
| Native `<dialog>` for modals | Built-in focus trap and backdrop; no dependency on modal library | Good -- zero-dependency modals |
| No component library (custom Tailwind components) | Matches personal-brand approach; full control over styling; small bundle | Good -- consistent with parent project |
| Biome for lint + format (not ESLint + Prettier) | Matches personal-brand tooling; single tool for both concerns; fast | Good -- consistent developer experience |

## Limitations and Tradeoffs

| Limitation | Tradeoff |
|-----------|----------|
| No authentication | Single-user MVP; anyone with access to the URL can manage tasks |
| No drag-and-drop reordering | Reduced complexity; tasks can be moved between sections via edit form; order is managed by fractional Float field |
| Single-level subtask nesting | Simplifies UI and data model; deep nesting would require recursive rendering and complex breadcrumbs |
| No optimistic updates | Mutations wait for server response before updating UI; simpler implementation but slightly slower UX |
| Status is a String, not an Enum | Prisma string field with default "OPEN"; could be extended to additional statuses without a migration |
| Tag update replaces all tags (delete + recreate) | Simpler than diffing; acceptable for small tag counts per task |
| No pagination on task lists | All tasks load at once; acceptable for personal use with moderate task counts |
| Search is case-insensitive contains (not full-text) | Simple Prisma `contains` with `mode: "insensitive"`; no search index or ranking |
| Board view is read-only columns | Tasks display in columns but cannot be dragged between them; section reassignment is via edit form |
