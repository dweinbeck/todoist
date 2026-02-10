# Architecture Research: Task Management App

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, theme)
│   ├── globals.css             # Theme tokens (replicated from personal-brand)
│   ├── page.tsx                # Redirect to /tasks or landing
│   └── tasks/
│       ├── layout.tsx          # Tasks layout (sidebar + main area)
│       ├── page.tsx            # Default view (workspace/project list)
│       ├── today/
│       │   └── page.tsx        # Today view
│       ├── completed/
│       │   └── page.tsx        # Completed view
│       ├── search/
│       │   └── page.tsx        # Search results
│       ├── tags/
│       │   └── page.tsx        # Filters & Tags view
│       └── [projectId]/
│           ├── page.tsx        # Project view (list/board)
│           └── _components/    # Route-specific components
│               ├── list-view.tsx
│               ├── board-view.tsx
│               └── view-toggle.tsx
├── components/
│   ├── ui/                     # Shared UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx            # Task card (matches personal-brand)
│   │   ├── modal.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   └── tasks/                  # Task-specific shared components
│       ├── sidebar.tsx
│       ├── task-card.tsx
│       ├── task-form.tsx
│       ├── section-column.tsx
│       └── subtask-list.tsx
├── lib/
│   ├── db.ts                   # Prisma singleton
│   ├── schemas/                # Zod validation schemas
│   │   ├── workspace.ts
│   │   ├── project.ts
│   │   ├── section.ts
│   │   ├── task.ts
│   │   └── tag.ts
│   └── utils.ts                # Shared utilities (cn, dates, etc.)
├── actions/                    # Server Actions (thin orchestration)
│   ├── workspace.ts
│   ├── project.ts
│   ├── section.ts
│   ├── task.ts
│   └── tag.ts
├── services/                   # Business logic (testable)
│   ├── workspace.service.ts
│   ├── project.service.ts
│   ├── section.service.ts
│   ├── task.service.ts
│   └── tag.service.ts
└── types/
    └── index.ts                # Shared type definitions
```

## Component Architecture

### Server vs Client Component Boundaries

**Server Components (default):**
- Layout components (sidebar shell, main area)
- Data fetching (project lists, task lists, counts)
- Page components

**Client Components ('use client'):**
- Task card (interactive: completion toggle, expand/collapse)
- Task form (modal with form state)
- Board view (column interactions, move task)
- View toggle (list/board switch)
- Sidebar navigation (active state, collapse)
- Search input (controlled input)

### Layout Architecture

```
┌─────────────────────────────────────────┐
│ Root Layout (fonts, theme providers)     │
│ ┌─────────────────────────────────────┐ │
│ │ Tasks Layout                         │ │
│ │ ┌──────────┬────────────────────┐   │ │
│ │ │ Sidebar  │ Main Content       │   │ │
│ │ │          │ (page.tsx renders)  │   │ │
│ │ │ - Add    │                    │   │ │
│ │ │ - Search │ Project Header     │   │ │
│ │ │ - Today  │ [List | Board]     │   │ │
│ │ │ - Done   │                    │   │ │
│ │ │ - Tags   │ Task Cards...      │   │ │
│ │ │ - Projs  │                    │   │ │
│ │ └──────────┴────────────────────┘   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Key insight:** Next.js App Router layouts preserve state on navigation. The sidebar layout wraps all `/tasks/*` routes, so it persists while navigating between projects, today, completed, etc.

## Data Model

```prisma
model Workspace {
  id        String   @id @default(cuid())
  name      String
  projects  Project[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  name        String
  sections    Section[]
  tasks       Task[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Section {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  name      String
  order     Float    @default(0)  // Fractional indexing for reordering
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id           String    @id @default(cuid())
  projectId    String
  project      Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  sectionId    String?
  section      Section?  @relation(fields: [sectionId], references: [id], onDelete: SetNull)
  parentTaskId String?
  parentTask   Task?     @relation("TaskSubtasks", fields: [parentTaskId], references: [id], onDelete: Cascade)
  subtasks     Task[]    @relation("TaskSubtasks")
  name         String
  description  String?
  deadlineAt   DateTime?
  status       String    @default("OPEN")  // OPEN | COMPLETED
  order        Float     @default(0)
  tags         TaskTag[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique
  color String?
  tasks TaskTag[]
}

model TaskTag {
  taskId String
  task   Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)
  tagId  String
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([taskId, tagId])
}
```

## Data Flow

### Read Path (Server Components)
```
Page (Server Component)
  → Service function (business logic)
    → Prisma query (DB access)
      → Returns typed data
  → Renders with data as props to Client Components
```

### Write Path (Server Actions)
```
Client Component (form/interaction)
  → Server Action (thin: validate → service → revalidate)
    → Service function (business logic + constraints)
      → Prisma mutation
    → revalidatePath('/tasks/[projectId]')
  → UI updates via React re-render
```

### Key Queries

**Sidebar counts:**
```sql
SELECT p.id, p.name, COUNT(t.id) as open_count
FROM "Project" p
LEFT JOIN "Task" t ON t."projectId" = p.id AND t.status = 'OPEN' AND t."parentTaskId" IS NULL
GROUP BY p.id
```

**Today view:**
```sql
WHERE t."deadlineAt" >= start_of_today AND t."deadlineAt" < start_of_tomorrow
AND t.status = 'OPEN' AND t."parentTaskId" IS NULL
```

**Subtask constraint (app logic):**
```typescript
// In task.service.ts
if (parentTaskId) {
  const parent = await prisma.task.findUnique({ where: { id: parentTaskId } })
  if (parent?.parentTaskId) {
    throw new Error('Subtasks cannot have subtasks')
  }
}
```

## Build Order (Dependencies)

```
Phase 1: Project setup + data model
  ↓ (foundation for everything)
Phase 2: API layer (Server Actions + Services)
  ↓ (CRUD before UI)
Phase 3: Layout + Sidebar + Navigation
  ↓ (shell before content)
Phase 4: Task CRUD UI (forms, cards, modals)
  ↓ (core interaction)
Phase 5: Project views (List + Board)
  ↓ (views consume task data)
Phase 6: Smart views (Today, Completed, Search, Tags)
  ↓ (filter views on existing data)
Phase 7: Polish + Tests + Quality gates
```

---
*Researched: 2026-02-10*
