# Todoist

> A hierarchical task management application modeled after Todoist, built with Next.js and styled to match dan-weinbeck.com.

## Description

Todoist is a standalone task management web application that provides hierarchical task organization through a Workspace > Project > Section > Task > Subtask structure. Users can create and manage workspaces containing multiple projects, each with named sections to group tasks. Tasks support descriptions, deadlines, tags, and one level of subtasks.

The application offers two project views -- a list view grouped by section and a board (Kanban) view with sections as columns -- along with smart views for Today's tasks, completed tasks, search, and tag-based filtering. A persistent sidebar provides tree navigation across workspaces and projects with live open-task counts, plus a quick-add modal for creating tasks from any page.

Built as a separate Next.js 16 application with its own PostgreSQL database via Prisma, the app replicates the navy/gold/beige design system from dan-weinbeck.com using shared CSS custom properties, fonts (Playfair Display, Inter, JetBrains Mono), and card styling patterns. It is intended to be linked from the personal-brand site's Apps page.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL |
| ORM | Prisma 6.19 (Prisma Postgres) |
| Validation | Zod 4 |
| Linting/Formatting | Biome 2.3 |
| Testing | Vitest 3.2 |
| Utilities | clsx, date-fns |

## Documentation

- [Functional Requirements (FRD)](docs/FRD.md)
- [Technical Design](docs/TECHNICAL_DESIGN.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## Development

```bash
# Install dependencies
npm install

# Start Prisma Postgres local server (required for database)
npx prisma dev

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev

# Run tests
npm test

# Lint and format check
npm run lint

# Auto-format code
npm run format

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (database GUI)
npm run db:studio
```

## License

MIT
