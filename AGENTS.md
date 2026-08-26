# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

npm monorepo with two workspaces:

- **`frontend/`** — React 19 + TypeScript + Vite + Tailwind CSS 4 + react-router-dom 7 (BrowserRouter), TanStack Query, Radix UI (shadcn-style components in `src/components/ui/`)
- **`backend/`** — Node.js / Express API (routes / controllers / services / repositories pattern)

## Commands

Run inside `frontend/` unless noted. On this machine use `npm.cmd` / `npx.cmd` (PowerShell execution policy blocks the `.ps1` shims):

- Dev server: `npm.cmd run dev`
- Lint: `npm.cmd run lint` (oxlint)
- Typecheck: `npx.cmd tsc --noEmit`
- Build: `npm.cmd run build`

## Architecture Rules

### Layout / page chrome (IMPORTANT)

- Pages MUST be **pure content** — they render only their own markup.
- The shared `frontend/src/components/layout/Layout.tsx` renders `<Navbar />`, `<main><Outlet /></main>`, and `<Footer />` exactly once, via the pathless layout route in `frontend/src/App.tsx`:

  ```tsx
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      {/* ...all other routes nested here... */}
    </Route>
  </Routes>
  ```

- **NEVER import or render `Layout`, `Navbar`, or `Footer` inside a page component.** Doing so double-renders the navbar and footer.
- New pages: create the page component, then nest its `<Route>` inside the `<Route element={<Layout />}>` block in `App.tsx`.

### Conventions

- Path alias `@/` maps to `frontend/src/`.
- Use existing UI primitives in `src/components/ui/` and shared states in `src/components/common/` (`ErrorState`, `EmptyState`, `LoadingState`).
- Match existing page styling: `max-w-7xl` containers, `anim-fade-up` / `anim-delay-N` entrance classes, dark-mode variants (`dark:`) on all colors.
