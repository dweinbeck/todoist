# Features Research: Task Management App

## Feature Categories

### Table Stakes (Must Have)

These features are expected in any task management app. Missing them = users leave.

| Feature | Complexity | Dependencies | Notes |
|---------|-----------|--------------|-------|
| Create/edit/delete tasks | Low | Data model | Core CRUD |
| Task completion toggle | Low | Task status field | Checkbox UX, immediate feedback |
| Task name + description | Low | Data model | Description is optional/expandable |
| Due dates/deadlines | Medium | Date picker UI, Today view | ISO timestamps, browser timezone for display |
| Project organization | Low | Workspace/Project hierarchy | Group tasks into projects |
| Sections within projects | Medium | Section model, ordering | Group tasks within a project |
| List view | Low | Section grouping | Default view, tasks grouped by section |
| Sidebar navigation | Medium | Layout component | Persistent across navigation |
| Search | Medium | Text search query | By task name/description minimum |
| Task counts | Low | Aggregate queries | Open tasks per project in sidebar |

### Differentiators (Competitive Advantage)

| Feature | Complexity | Dependencies | In Scope? |
|---------|-----------|--------------|-----------|
| Board/Kanban view | Medium | Sections as columns | Yes — requested |
| Subtasks (1 level) | Medium | Self-relation, nesting constraint | Yes — requested |
| Tags/labels | Medium | Many-to-many relation | Yes — requested |
| Today view | Low | Date filtering | Yes — requested |
| Completed view | Low | Status filtering | Yes — requested |
| Filters & Tags sidebar | Medium | Tag listing, filter UI | Yes — requested |
| Quick add task (modal) | Medium | Modal component, form | Yes — requested |
| View toggle (List/Board) | Low | View state per project | Yes — requested |

### Anti-Features (Deliberately NOT Building)

| Feature | Reason | Risk if Included |
|---------|--------|-----------------|
| Real-time collaboration | Single-user MVP; massive complexity | WebSocket infrastructure, conflict resolution |
| Recurring tasks | Complex scheduling logic | Cron jobs, timezone edge cases |
| Natural language parsing | AI/NLP dependency | Unreliable, scope creep |
| Notifications/reminders | Push infrastructure needed | Service worker, email integration |
| Calendar view | Beyond MVP scope | Complex date grid rendering |
| Priority levels | Not requested; adds UI complexity | Decision fatigue for users |
| Comments/activity log | Collaboration feature; single user | Extra data model, UI complexity |
| File attachments | Storage infrastructure | S3/blob storage, upload UI |
| Drag-and-drop | Nice-to-have; complex to implement well | Touch support, accessibility, animation |
| Dark mode | Not requested for MVP | Theme switching infrastructure |
| Keyboard shortcuts | Nice-to-have post-MVP | Focus management complexity |
| Undo/redo | Nice UX but complex state management | Optimistic updates, rollback logic |

## Todoist Sidebar Structure (Reference)

Todoist's sidebar includes:
- **Inbox** (default project for uncategorized tasks)
- **Today** (tasks due today)
- **Upcoming** (future scheduled tasks)
- **Filters & Labels** (custom filter views)
- **Favorites** (pinned projects/filters/labels)
- **Projects** (expandable tree with task counts)

**Our simplified version:**
- Add Task (modal trigger)
- Search
- Today
- Completed
- Filters & Tags
- Workspaces → Projects (with counts)

## Todoist View Options (Reference)

Todoist supports: List, Board, Day Calendar, Week Calendar, Month Calendar.
Sorting by: alphabetical, assignee, due date, creation date, priority, project.
Filtering by: assignee, date, deadline, priority, label, workspace.

**Our simplified version:**
- List view (grouped by section)
- Board view (sections as columns)
- No sorting/filtering options for MVP

## Feature Dependencies

```
Data Model → API Layer → UI Components
                ↓
         Sidebar ← Task Counts
                ↓
    List View → Board View (shares Section model)
                ↓
    Today/Completed (filter views on Task data)
                ↓
    Search (query on Task name/description)
```

---
*Researched: 2026-02-10*
