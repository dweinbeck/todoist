# Requirements: Todoist-like Tasks App

**Defined:** 2026-02-10
**Core Value:** Users can organize and track tasks in a hierarchical structure with multiple views

## v1 Requirements

### Organization

- [ ] **ORG-01**: User can create, edit, and delete workspaces
- [ ] **ORG-02**: User can create, edit, and delete projects within a workspace
- [ ] **ORG-03**: User can create, edit, and delete sections within a project
- [ ] **ORG-04**: Sections have a user-defined order within a project
- [ ] **ORG-05**: Workspaces, projects, and sections persist across page refresh

### Tasks

- [ ] **TASK-01**: User can create a task with name (required), description, deadline (date/time), and tags
- [ ] **TASK-02**: User can edit all fields of an existing task
- [ ] **TASK-03**: User can delete a task (with confirmation)
- [ ] **TASK-04**: User can toggle task status between OPEN and COMPLETED
- [ ] **TASK-05**: User can assign/reassign a task to a section via menu
- [ ] **TASK-06**: Tasks belong to a project and optionally to a section
- [ ] **TASK-07**: Tasks have a user-defined order within their section/project

### Subtasks

- [ ] **SUB-01**: User can create subtasks within a task (same fields as tasks)
- [ ] **SUB-02**: Subtasks cannot have their own subtasks (one-level nesting enforced)
- [ ] **SUB-03**: Attempt to create a sub-subtask is blocked with a clear message
- [ ] **SUB-04**: Subtasks display within the parent task's expanded area

### Tags

- [ ] **TAG-01**: User can create tags with a name and optional color
- [ ] **TAG-02**: User can assign multiple tags to a task
- [ ] **TAG-03**: User can remove tags from a task
- [ ] **TAG-04**: User can view all tasks with a specific tag

### Views

- [ ] **VIEW-01**: Project list view displays tasks grouped by section
- [ ] **VIEW-02**: Project board view displays sections as columns with task cards
- [ ] **VIEW-03**: User can toggle between list and board view per project
- [ ] **VIEW-04**: Board view supports adding a new section as a column
- [ ] **VIEW-05**: Task cards show: name, due date (if any), tags, completion toggle
- [ ] **VIEW-06**: Task cards expand to show description and subtasks
- [ ] **VIEW-07**: Task cards match dan-weinbeck.com card format (same styling tokens)

### Smart Views

- [ ] **SMART-01**: Today view shows all tasks with deadline on today's date
- [ ] **SMART-02**: Completed view shows all completed tasks (filterable by project)
- [ ] **SMART-03**: Search finds tasks by name or description text
- [ ] **SMART-04**: Filters & Tags view lists all tags and allows filtering by tag

### Navigation

- [ ] **NAV-01**: Sidebar displays: Add Task, Search, Today, Completed, Filters & Tags
- [ ] **NAV-02**: Sidebar displays workspace → project tree
- [ ] **NAV-03**: Each project in sidebar shows open-task count
- [ ] **NAV-04**: Add Task button opens a modal for quick task creation
- [ ] **NAV-05**: Sidebar persists across page navigation (layout-based)

### Styling

- [ ] **STYLE-01**: App replicates dan-weinbeck.com theme tokens (navy/gold/beige palette)
- [ ] **STYLE-02**: App uses same fonts (Playfair Display, Inter, JetBrains Mono)
- [ ] **STYLE-03**: Task cards use same card patterns as personal-brand site (rounded-2xl, shadow, hover lift)

### Data

- [ ] **DATA-01**: All data persists in PostgreSQL via Prisma
- [ ] **DATA-02**: Database schema supports the full hierarchy (Workspace → Project → Section → Task → Subtask)
- [ ] **DATA-03**: Deleting a parent entity cascades to children (with confirmation dialog)

### Quality

- [ ] **QUAL-01**: Lint passes (Biome)
- [ ] **QUAL-02**: Build succeeds (Next.js)
- [ ] **QUAL-03**: TypeScript compiles without errors
- [ ] **QUAL-04**: Unit tests pass for subtask nesting constraint and Today filter logic

## v2 Requirements

### Enhanced UX

- **UX-01**: Drag-and-drop reordering for tasks and sections
- **UX-02**: Keyboard shortcuts for common actions
- **UX-03**: Undo/redo with toast notifications
- **UX-04**: Dark mode support

### Advanced Views

- **ADV-01**: Calendar view for deadline visualization
- **ADV-02**: Sorting options (by date, name, creation date)
- **ADV-03**: Priority levels on tasks
- **ADV-04**: Custom filters with saved views

### Integration

- **INT-01**: Embed in dan-weinbeck.com Apps page (iframe or monorepo)
- **INT-02**: Share authentication with personal-brand site

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time collaboration | Single-user MVP; massive complexity (WebSockets, conflict resolution) |
| Recurring tasks | Complex scheduling logic, cron infrastructure |
| Notifications/reminders | Push infrastructure, email integration |
| Natural language parsing | AI/NLP dependency, unreliable for MVP |
| Mobile app | Web-first approach |
| Offline-first/sync | Single device, single user for now |
| File attachments | Storage infrastructure (S3/blob) |
| Comments/activity log | Collaboration feature; single user |
| OAuth/social login | Not needed for standalone MVP |
| Perfect Todoist parity | Only requested features |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ORG-01 | Phase 2 | Pending |
| ORG-02 | Phase 2 | Pending |
| ORG-03 | Phase 2 | Pending |
| ORG-04 | Phase 2 | Pending |
| ORG-05 | Phase 2 | Pending |
| TASK-01 | Phase 3 | Pending |
| TASK-02 | Phase 3 | Pending |
| TASK-03 | Phase 3 | Pending |
| TASK-04 | Phase 3 | Pending |
| TASK-05 | Phase 3 | Pending |
| TASK-06 | Phase 3 | Pending |
| TASK-07 | Phase 3 | Pending |
| SUB-01 | Phase 3 | Pending |
| SUB-02 | Phase 3 | Pending |
| SUB-03 | Phase 3 | Pending |
| SUB-04 | Phase 3 | Pending |
| TAG-01 | Phase 3 | Pending |
| TAG-02 | Phase 3 | Pending |
| TAG-03 | Phase 3 | Pending |
| TAG-04 | Phase 5 | Pending |
| VIEW-01 | Phase 4 | Pending |
| VIEW-02 | Phase 4 | Pending |
| VIEW-03 | Phase 4 | Pending |
| VIEW-04 | Phase 4 | Pending |
| VIEW-05 | Phase 4 | Pending |
| VIEW-06 | Phase 4 | Pending |
| VIEW-07 | Phase 4 | Pending |
| SMART-01 | Phase 5 | Pending |
| SMART-02 | Phase 5 | Pending |
| SMART-03 | Phase 5 | Pending |
| SMART-04 | Phase 5 | Pending |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 5 | Pending |
| NAV-04 | Phase 5 | Pending |
| NAV-05 | Phase 2 | Pending |
| STYLE-01 | Phase 1 | Pending |
| STYLE-02 | Phase 1 | Pending |
| STYLE-03 | Phase 4 | Pending |
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 3 | Pending |
| QUAL-01 | Phase 1 | Pending |
| QUAL-02 | Phase 1 | Pending |
| QUAL-03 | Phase 1 | Pending |
| QUAL-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 43 total
- Mapped to phases: 43
- Unmapped: 0

---
*Requirements defined: 2026-02-10*
*Last updated: 2026-02-10 after roadmap creation*
