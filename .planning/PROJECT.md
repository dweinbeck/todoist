# Todoist-like Tasks App

## What This Is

A standalone task management application modeled after Todoist, accessible from dan-weinbeck.com's Apps page. It provides hierarchical task organization (Workspaces → Projects → Sections → Tasks → Subtasks) with list and board views, sidebar navigation, and full CRUD for all entities. Built as a separate Next.js app with its own Postgres database, visually consistent with the personal-brand site's navy/gold/beige theme.

## Core Value

Users can organize and track tasks in a hierarchical structure with multiple views, making it easy to capture, categorize, and complete work.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hierarchical data model: Workspaces → Projects → Sections → Tasks → Subtasks (one nesting level only)
- [ ] Task fields: name, description, deadline (date/time), tags, subtasks, completion status
- [ ] Project views: List view (grouped by section) and Board view (sections as columns)
- [ ] Sidebar navigation: Add task, Search, Today, Completed, Filters & Tags, Workspaces → Projects with open-task counts
- [ ] Task card UI matches dan-weinbeck.com card format (same styling tokens, hover behavior, layout)
- [ ] Full CRUD for all entities: Workspaces, Projects, Sections, Tasks, Tags
- [ ] Subtask enforcement: subtasks cannot have subtasks (one-level nesting constraint)
- [ ] Today view: tasks with deadline on today's date
- [ ] Completed view: list completed tasks (filterable by project or global)
- [ ] Search: by task name/description, optionally by tag name
- [ ] Board view: sections as columns, add new section as column, move/assign task to section
- [ ] Data persistence via Postgres + Prisma — refresh doesn't lose data
- [ ] Visual consistency: replicate dan-weinbeck.com theme tokens (navy/gold/beige palette, Playfair Display + Inter + JetBrains Mono fonts, card shadows/radii)
- [ ] Accessible from dan-weinbeck.com Apps page (standalone app linked from site)

### Out of Scope

- Sharing/collaboration, invites, multi-user permissions — single-user MVP first
- Recurring tasks, reminders/notifications, natural-language parsing — complexity not needed for MVP
- Mobile app, offline-first, sync across devices — web-first
- Perfect Todoist parity — only requested features
- Drag-and-drop reordering — implement basic "move task to section" via menu instead
- OAuth/social login — not needed for standalone MVP
- Real-time collaboration/websockets — single user

## Context

**Parent site:** dan-weinbeck.com (Next.js 16, App Router, React 19, Tailwind CSS 4, Firebase, Biome, Vitest)

**Integration plan:** This app is standalone in `/Documents/todoist` with its own database and deployment. Will be linked from the personal-brand site's Apps page for access. Future integration may involve embedding or monorepo structure.

**Theme tokens to replicate from personal-brand site:**
- `--background: #fafaf8` (light beige)
- `--foreground: #1b2a4a` (dark navy)
- `--color-primary: #063970` (navy blue)
- `--color-primary-hover: #052d5a`
- `--color-gold: #c8a55a` (warm gold)
- `--color-gold-hover: #b8933e`
- `--color-gold-light: rgba(200, 165, 90, 0.12)`
- `--color-surface: #ffffff`
- `--color-border: rgba(27, 42, 74, 0.1)`
- `--color-text-primary: #1b2a4a`
- `--color-text-secondary: #4a5568`
- `--color-text-tertiary: #8a94a6`
- `--color-sage: #6b8e6f`
- `--color-amber: #d4956c`
- `--shadow-card` and `--shadow-card-hover` values
- `--radius-card: 16px`, `--radius-button: 8px`
- Fonts: Playfair Display (display), Inter (body), JetBrains Mono (mono)

**Card component pattern from personal-brand site:**
- `rounded-2xl`, `shadow-[var(--shadow-card)]`, `hover:shadow-[var(--shadow-card-hover)]`
- Hover: `-translate-y-1` lift animation
- Border: `border border-border`
- Background: `bg-surface`
- Status badges with color-coded backgrounds
- Tag chips with subtle background tints

**Existing personal-brand patterns to match:**
- Biome for linting/formatting (not ESLint)
- Vitest for testing
- `clsx` for conditional classnames
- Route handlers for API endpoints
- Zod for schema validation
- No external component library (custom components only)

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
| Standalone app (not embedded in personal-brand) | Keeps concerns separate, own DB, independent deploy | — Pending |
| Postgres + Prisma | Production-ready, type-safe ORM, standard for Next.js | — Pending |
| Replicate theme tokens (not import) | Standalone app can't import from personal-brand; copy CSS variables | — Pending |
| Biome + Vitest (match personal-brand tooling) | Consistency across repos for future integration | — Pending |
| No component library | Match personal-brand approach: custom components with Tailwind | — Pending |
| One-level subtask nesting | Simplicity; enforced in app logic not DB constraint | — Pending |

---
*Last updated: 2026-02-10 after initialization*
