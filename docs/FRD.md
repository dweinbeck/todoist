# Functional Requirements Document (FRD)

## Goals

- Provide a hierarchical task management system (Workspace > Project > Section > Task > Subtask) for personal productivity
- Offer multiple views (list, board, today, completed, search, tags) for flexible task visualization
- Replicate the dan-weinbeck.com design system (navy/gold/beige palette) for visual consistency across apps
- Persist all data in PostgreSQL with full cascade delete semantics

## Non-Goals

- Multi-user collaboration, sharing, or invitations (single-user MVP)
- Recurring tasks, reminders, or notifications
- Natural language parsing for task creation
- Mobile native app or offline-first support
- Drag-and-drop reordering (uses manual ordering instead)
- OAuth or social login
- Real-time collaboration via WebSockets
- File attachments or comments/activity log
- Calendar view or priority levels

## User Persona

**Dan** -- A developer and personal-brand site owner who needs a task management tool accessible from his portfolio site. He wants hierarchical organization of tasks across multiple projects and workspaces, with the ability to quickly capture tasks and view them by deadline, completion status, or tag. He values a clean interface that matches his site's aesthetic.

## Scenarios

### S1: Workspace and Project Setup

Dan opens the app for the first time and sees a welcome screen prompting him to create a workspace. He clicks the "+" button next to "Workspaces" in the sidebar, enters "Personal" as the workspace name, and presses Enter. The workspace appears in the sidebar. He then clicks the "+" on the workspace to add a project called "Website Redesign." The project appears nested under the workspace with a zero task count.

### S2: Creating and Organizing Tasks

Dan navigates to his "Website Redesign" project. He clicks "Add task" and fills in a task name ("Design homepage mockup"), adds a description, sets a deadline for today, and selects the "design" tag. He submits the form and sees the task card appear with the name, deadline, and tag badge. He then creates a section called "In Progress" and creates more tasks within it.

### S3: Working with Subtasks

Dan expands a task card by clicking on it and sees the subtask area. He clicks "+ Add subtask" and enters "Choose color palette." The subtask appears within the expanded task. He marks the subtask as completed by clicking its checkbox, and the subtask shows a strikethrough. The parent task card shows "1/1" subtask progress.

### S4: Using Smart Views

Dan clicks "Today" in the sidebar to see all tasks with today's deadline. He sees his "Design homepage mockup" task listed. He clicks "Completed" in the sidebar to see previously finished tasks, optionally filtering by project. He uses the "Search" view to find tasks by name or description. He navigates to "Filters & Tags" to see all his tags and clicks one to view all tasks with that tag.

### S5: Board View

Dan toggles from list view to board view using the view toggle in the project header. He sees his sections displayed as columns (including a "No Section" column for unsectioned tasks). Each column shows its task cards, and he can add tasks directly within a column or add a new section column.

### S6: Quick Add Task

Dan is browsing the Today view and remembers a task he needs to capture. He clicks the "Add Task" button at the top of the sidebar, which opens a modal. He selects a project from the dropdown (grouped by workspace), enters the task name, optionally sets a deadline and tags, and submits. The task is created in the selected project.

## End-to-End Workflows

### Task Creation Workflow

1. User clicks "Add task" (inline button or sidebar quick-add modal)
2. User enters task name (required), optionally description, deadline, section, and tags
3. Client validates input via Zod schema
4. Server Action validates again and calls task service
5. Service creates task in PostgreSQL via Prisma with auto-calculated order
6. `revalidatePath("/tasks")` triggers UI refresh
7. Task card appears in the appropriate section/project with all metadata

### Task Completion Workflow

1. User clicks the circular checkbox on a task card
2. Client calls `toggleTaskAction` Server Action
3. Service toggles status between "OPEN" and "COMPLETED"
4. Path revalidation triggers re-render
5. Task card shows strikethrough styling (completed) or returns to normal (reopened)

### Hierarchical Delete Workflow

1. User clicks the delete button on a workspace, project, or task
2. Confirmation dialog appears with warning about cascading deletion
3. User confirms
4. Server Action calls the appropriate service delete function
5. Prisma cascade rules propagate the deletion (Workspace -> Projects -> Sections/Tasks; Task -> Subtasks; Task -> TaskTags)
6. Path revalidation updates sidebar counts and task lists

## Requirements

### Organization

| ID | Requirement | Status |
|----|-------------|--------|
| ORG-01 | User can create, edit, and delete workspaces | Complete |
| ORG-02 | User can create, edit, and delete projects within a workspace | Complete |
| ORG-03 | User can create, edit, and delete sections within a project | Complete |
| ORG-04 | Sections have a user-defined order within a project | Complete |
| ORG-05 | Workspaces, projects, and sections persist across page refresh | Complete |

### Tasks

| ID | Requirement | Status |
|----|-------------|--------|
| TASK-01 | User can create a task with name (required), description, deadline, and tags | Complete |
| TASK-02 | User can edit all fields of an existing task | Complete |
| TASK-03 | User can delete a task (with confirmation dialog) | Complete |
| TASK-04 | User can toggle task status between OPEN and COMPLETED | Complete |
| TASK-05 | User can assign/reassign a task to a section | Complete |
| TASK-06 | Tasks belong to a project and optionally to a section | Complete |
| TASK-07 | Tasks have a user-defined order within their section/project | Complete |

### Subtasks

| ID | Requirement | Status |
|----|-------------|--------|
| SUB-01 | User can create subtasks within a task | Complete |
| SUB-02 | Subtasks cannot have their own subtasks (one-level nesting enforced) | Complete |
| SUB-03 | Attempt to create a sub-subtask is blocked with a clear error message | Complete |
| SUB-04 | Subtasks display within the parent task's expanded area | Complete |

### Tags

| ID | Requirement | Status |
|----|-------------|--------|
| TAG-01 | User can create tags with a name and optional color | Complete |
| TAG-02 | User can assign multiple tags to a task | Complete |
| TAG-03 | User can remove tags from a task | Complete |
| TAG-04 | User can view all tasks with a specific tag | Complete |

### Views

| ID | Requirement | Status |
|----|-------------|--------|
| VIEW-01 | Project list view displays tasks grouped by section | Complete |
| VIEW-02 | Project board view displays sections as columns with task cards | Complete |
| VIEW-03 | User can toggle between list and board view per project | Complete |
| VIEW-04 | Board view supports adding a new section as a column | Complete |
| VIEW-05 | Task cards show name, due date, tags, and completion toggle | Complete |
| VIEW-06 | Task cards expand to show description and subtasks | Complete |
| VIEW-07 | Task cards match dan-weinbeck.com card styling (rounded-2xl, shadow, hover lift) | Complete |

### Smart Views

| ID | Requirement | Status |
|----|-------------|--------|
| SMART-01 | Today view shows all open tasks with deadline on today's date | Complete |
| SMART-02 | Completed view shows all completed tasks, filterable by project | Complete |
| SMART-03 | Search finds tasks by name or description (case-insensitive) | Complete |
| SMART-04 | Filters & Tags view lists all tags with task counts and allows filtering by tag | Complete |

### Navigation

| ID | Requirement | Status |
|----|-------------|--------|
| NAV-01 | Sidebar displays Add Task, Today, Completed, Search, and Filters & Tags links | Complete |
| NAV-02 | Sidebar displays workspace > project tree | Complete |
| NAV-03 | Each project in sidebar shows open-task count | Complete |
| NAV-04 | Add Task button opens a modal for quick task creation | Complete |
| NAV-05 | Sidebar persists across page navigation (layout-based) | Complete |

### Styling

| ID | Requirement | Status |
|----|-------------|--------|
| STYLE-01 | App replicates dan-weinbeck.com theme tokens (navy/gold/beige palette) | Complete |
| STYLE-02 | App uses same fonts (Playfair Display, Inter, JetBrains Mono) | Complete |
| STYLE-03 | Task cards use same card patterns as personal-brand site | Complete |

### Data

| ID | Requirement | Status |
|----|-------------|--------|
| DATA-01 | All data persists in PostgreSQL via Prisma | Complete |
| DATA-02 | Database schema supports the full hierarchy (Workspace > Project > Section > Task > Subtask) | Complete |
| DATA-03 | Deleting a parent entity cascades to children (with confirmation dialog) | Complete |

### Quality

| ID | Requirement | Status |
|----|-------------|--------|
| QUAL-01 | Lint passes (Biome) | Complete |
| QUAL-02 | Build succeeds (Next.js) | Complete |
| QUAL-03 | TypeScript compiles without errors | Complete |
| QUAL-04 | Unit tests pass for subtask nesting constraint and Today filter logic | Complete |

## Coverage

- **Total v1 requirements:** 43
- **Shipped:** 43
- **Adjusted:** 0
- **Dropped:** 0
- **Coverage:** 100%
