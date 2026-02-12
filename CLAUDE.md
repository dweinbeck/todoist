# Project Instructions

> Inherits from `~/.claude/CLAUDE.md` — only project-specific overrides below.

---

## Quick Reference
```bash
npm run dev          # Local dev (port 3000)
npm run build        # Next.js build
npm run lint         # Biome lint
npm test             # Vitest
npm run db:push      # Push Prisma schema to DB
npm run db:generate  # Generate Prisma client
```

---

## Project-Specific Zones

### Safe Zones
- `src/app/` — Next.js App Router pages
- `src/components/` — React components
- `src/actions/` — Server actions (task, tag, section, project, workspace)
- `src/lib/schemas/` — Zod validation schemas
- `src/lib/` — Utilities and helpers
- `tests/` — Vitest test files

### Caution Zones
- `prisma/schema.prisma` — Database schema (run migrations after changes)
- `src/lib/auth/` — Firebase Auth integration
- `src/generated/` — Auto-generated Prisma client (never edit manually)

---

## Tech Stack Summary
| Category | Technology |
|----------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Next.js Server Actions |
| Database | PostgreSQL (Prisma 6) |
| Auth | Firebase Auth |
| Validation | Zod 4 |
| Linting | Biome |
| Testing | Vitest |

---

## Key Patterns (Reference)
- **Server actions:** `"use server"` in `src/actions/` — each entity has its own action file
- **Zod schemas:** `src/lib/schemas/` — create/update/reorder schemas per entity with `z.infer<>` type exports
- **Effort levels:** Fibonacci sequence (1,2,3,5,8,13) for task effort — validated in task schema
- **Reorder pattern:** Float-based ordering via `reorderSchema` for drag-and-drop support

---

## Deployment
- **Target:** Not yet configured (early stage)
- **Required env vars:** DATABASE_URL, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, NEXT_PUBLIC_FIREBASE_*

---

## Known Gotchas
| Gotcha | Details |
|--------|---------|
| Prisma 6 | Uses `prisma generate --no-engine` for Edge compatibility |
| Generated files | `src/generated/prisma/` — regenerate after schema changes |
| Default branch | Uses `main` |
