# Stack Research: Task Management App

## Core Framework

| Technology | Version | Rationale | Confidence |
|-----------|---------|-----------|------------|
| Next.js | 16.x | App Router, React 19, matches personal-brand site | High |
| React | 19.x | Server Components, `use()` hook, concurrent features | High |
| TypeScript | 5.x | Type safety, Prisma integration | High |
| Tailwind CSS | 4.x | CSS-first config, `@theme inline`, matches personal-brand | High |

## Database & ORM

| Technology | Version | Rationale | Confidence |
|-----------|---------|-----------|------------|
| PostgreSQL | 16+ | Production-ready relational DB, hierarchical data support | High |
| Prisma | 7.x | Type-safe ORM, auto-generated client, migration system | High |

**Prisma singleton pattern (critical for Next.js dev):**
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Self-relations for subtasks:** Prisma supports one-to-many self-relations for parent/child tasks. Since we only need 1 level deep, simple `include: { subtasks: true }` is sufficient — no recursive CTE needed.

## Styling

| Technology | Version | Rationale | Confidence |
|-----------|---------|-----------|------------|
| Tailwind CSS | 4.x | PostCSS-based, `@theme inline` for CSS variables | High |
| @tailwindcss/postcss | 4.x | Required for Tailwind 4 with PostCSS | High |
| clsx | 2.1.1 | Conditional classnames, matches personal-brand | High |

**PostCSS config for Tailwind 4:**
```js
// postcss.config.mjs
export default { plugins: { "@tailwindcss/postcss": {} } }
```

**Theme tokens:** Replicate personal-brand CSS variables in globals.css with `@theme inline` block.

## Validation

| Technology | Version | Rationale | Confidence |
|-----------|---------|-----------|------------|
| Zod | 3.x | Schema validation, matches personal-brand patterns | High |

## Tooling

| Technology | Version | Rationale | Confidence |
|-----------|---------|-----------|------------|
| Biome | 2.x | Lint + format, matches personal-brand | High |
| Vitest | 3.x | Fast tests, matches personal-brand | High |

## Optional / Recommended

| Technology | Version | Rationale | Confidence |
|-----------|---------|-----------|------------|
| nuqs | 2.8.x | Type-safe URL state (filters, search, view toggles) | Medium |
| fractional-indexing | 3.2.0 | Ordering sections/tasks without bulk updates | Medium |
| server-only | latest | Prevent accidental client imports of server code | High |

## What NOT to Use

| Technology | Reason |
|-----------|--------|
| shadcn/ui | Personal-brand doesn't use it; custom components only |
| ESLint/Prettier | Personal-brand uses Biome instead |
| tRPC | Overkill for single-app; use Server Actions + Route Handlers |
| Redux/Zustand | Server Components handle most state; React state for the rest |
| Drizzle | User chose Prisma |
| Firebase | Standalone app with own Postgres; Firebase is personal-brand's DB |

## Fonts (from personal-brand)

- **Display:** Playfair Display (700, 800) → `--font-display`
- **Body:** Inter (400, 500, 600) → `--font-inter`
- **Mono:** JetBrains Mono (400) → `--font-jetbrains`

---
*Researched: 2026-02-10*
