# adviser-ui

Frontend for [Med AI Adviser](https://github.com/vzateychuk/adviser-ui) — React + Vite + TypeScript UI for the REST API.

## Layout in the monorepo workspace

When used as a git submodule inside the backend repo (`fsm/frontend/`):

```
fsm/
├── docs/openapi/openapi.json   # API contract (source of truth)
└── frontend/                   # this repository
```

Standalone clone is also supported — keep a vendored copy at `openapi/openapi.json` (updated via `npm run sync:openapi` when the backend repo is available).

## Prerequisites

- Node.js 20+
- Backend API running at `http://localhost:8000` (see backend README)

## Setup

```bash
cp .env.example .env
npm install
npm run gen:api
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server at http://localhost:5173 |
| `npm run build` | Production build |
| `npm run sync:openapi` | Copy OpenAPI schema from backend (`../docs/openapi/openapi.json`) |
| `npm run gen:api` | Sync schema + regenerate TanStack Query client (orval) |
| `npm run typecheck` | TypeScript check without emit |
| `npm run check` | `gen:api` + `typecheck` (CI smoke) |
| `npm run test` | Unit tests (vitest) |
| `npm run lint` | ESLint |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend REST API base URL |

## Project structure (feature-sliced)

```
src/
  app/           # Router, providers, root App
  core/          # Config, HTTP client, generated API hooks
  shared/        # Reusable UI components
  features/      # chat, documents, profile, layout
```

Generated OpenAPI client lives in `src/core/api/generated/` and is committed to the repo. Feature modules expose facade hooks (e.g. `features/profile/useProfile.ts`) so UI does not depend directly on orval output names.

## OpenAPI workflow

1. Backend changes API → exports `docs/openapi/openapi.json` → commits.
2. Frontend: `npm run gen:api` → review generated diff → commit.
3. TypeScript surfaces breaking changes at compile time.

## Development

Terminal 1 (backend):

```bash
cd ..   # fsm root
uv run python -m src.api.main
```

Terminal 2 (frontend):

```bash
npm run dev
```

Open http://localhost:5173 — CORS is preconfigured for the Vite dev origin.
