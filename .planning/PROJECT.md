# Tasks-like Tasks App

## What This Is

A standalone task management application accessible from dan-weinbeck.com's Apps page. It provides hierarchical task organization (Workspaces > Projects > Sections > Tasks > Subtasks) with list and board views, sidebar navigation, smart views (Today, Completed, Search, Tags), a quick-add modal, and full CRUD for all entities. Built as a separate Next.js 16 app with its own Postgres database, visually consistent with the personal-brand site's navy/gold/beige theme.

## Core Value

Users can organize and track tasks in a hierarchical structure with multiple views, making it easy to capture, categorize, and complete work.

## Requirements

### Validated

- ✓ ORG-01 through ORG-05: Workspace, project, section CRUD with persistence — v1.0
- ✓ TASK-01 through TASK-07: Full task CRUD, status toggle, section assignment, ordering — v1.0
- ✓ SUB-01 through SUB-04: Subtask creation, one-level nesting enforcement, display — v1.0
- ✓ TAG-01 through TAG-04: Tag CRUD, multi-tag assignment, tag-based filtering — v1.0
- ✓ VIEW-01 through VIEW-07: List/board views, task cards with expand, styled to match personal-brand — v1.0
- ✓ SMART-01 through SMART-04: Today, Completed, Search, Filters & Tags views — v1.0
- ✓ NAV-01 through NAV-05: Sidebar with tree nav, smart view links, task counts, quick-add — v1.0
- ✓ STYLE-01 through STYLE-03: Theme tokens, fonts, card patterns from dan-weinbeck.com — v1.0
- ✓ DATA-01 through DATA-03: Postgres/Prisma persistence, full hierarchy, cascade deletes — v1.0
- ✓ QUAL-01 through QUAL-04: Lint, build, types, unit tests — v1.0

### Active

(None — all v1 requirements shipped. Next milestone TBD.)

### Out of Scope

- Sharing/collaboration, invites, multi-user permissions — single-user MVP first
- Recurring tasks, reminders/notifications, natural-language parsing — complexity not needed for MVP
- Mobile app, offline-first, sync across devices — web-first
- Feature creep — only requested features
- Drag-and-drop reordering — implement basic "move task to section" via menu instead
- OAuth/social login — not needed for standalone MVP
- Real-time collaboration/websockets — single user
- File attachments — storage infrastructure not needed for MVP
- Comments/activity log — collaboration feature, single user

## Context

**Parent site:** dan-weinbeck.com (Next.js 16, App Router, React 19, Tailwind CSS 4, Firebase, Biome, Vitest)

**Integration plan:** This app is standalone with its own database and deployment. Will be linked from the personal-brand site's Apps page for access. Future integration may involve embedding or monorepo structure.

**Current state (v1.0 shipped):**
- ~14,800 lines of TypeScript/TSX across 77 files
- 6 Prisma models: Workspace, Project, Section, Task, Tag, TaskTag
- 16 passing tests (subtask nesting, today filter, schema validation)
- Tech stack: Next.js 16, React 19, Prisma 7, Tailwind CSS 4, Biome 2.3, Vitest, Zod v4

**Theme tokens replicated from personal-brand site:**
- `--background: #fafaf8` (light beige)
- `--foreground: #1b2a4a` (dark navy)
- `--color-primary: #063970` (navy blue)
- `--color-gold: #c8a55a` (warm gold)
- Fonts: Playfair Display (display), Inter (body), JetBrains Mono (mono)

## Constraints

- **Tech stack**: Next.js (App Router), React, TypeScript, Tailwind CSS 4, Postgres + Prisma
- **Styling**: Must replicate dan-weinbeck.com theme tokens — no new design system
- **Tooling**: Biome for lint/format, Vitest for tests (matching personal-brand conventions)
- **Scope**: Standalone app; minimal changes outside new tasks app area
- **Security**: No secrets committed; no API keys in source
- **Nesting**: Subtasks limited to one level — enforced in application logic
- **Database**: Standalone schema — own tables, not sharing Firebase with personal-brand

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Standalone app (not embedded in personal-brand) | Keeps concerns separate, own DB, independent deploy | ✓ Good |
| Postgres + Prisma 7 | Production-ready, type-safe ORM, standard for Next.js | ✓ Good |
| Replicate theme tokens (not import) | Standalone app can't import from personal-brand; copy CSS variables | ✓ Good |
| Biome 2.3 + Vitest (match personal-brand tooling) | Consistency across repos for future integration | ✓ Good |
| No component library | Match personal-brand approach: custom components with Tailwind | ✓ Good |
| One-level subtask nesting | Simplicity; enforced in app logic not DB constraint | ✓ Good |
| Prisma singleton pattern | Avoids connection pool exhaustion in dev (research pitfall #1) | ✓ Good |
| Fractional indexing for ordering | Enables insertions without reindexing (research pitfall #2) | ✓ Good |
| Prisma 7 client at `@/generated/prisma/client` | Prisma 7 generates to new path vs Prisma 5/6 | ✓ Good |
| Zod v4 for validation | Modern schema validation with `.issues[0].message` pattern | ✓ Good |

---
*Last updated: 2026-02-10 after v1.0 milestone*
