# Client Project Tracker

A responsive frontend application for a digital agency to manage and track client projects — built as a Frontend Developer Technical Assessment.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | 6 | Static typing |
| [Vite](https://vite.dev/) | 8 | Dev server and build tool |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Utility-first styling |

No backend, no external UI libraries, no authentication.

---

## Features Implemented

### Required
- ✅ **Project List** — responsive layout: table on desktop, card stack on mobile
- ✅ **Create Project** — modal form with all 8 fields
- ✅ **Edit Project** — same modal component, pre-filled for editing
- ✅ **Delete Project** — accessible confirmation dialog before removal
- ✅ **Form Validation** — client name, project name, status, priority (required); due date ≥ start date
- ✅ **UI States** — loading skeleton, empty state, error banner

### Bonus
- ✅ **Search** — filters by client name or project name
- ✅ **Filter by Status** — dropdown filter
- ✅ **Filter by Priority** — dropdown filter
- ✅ **Sort** — by due date, start date, priority, or project name
- ✅ **Dashboard Summary** — live counts grouped by status
- ✅ **Responsive Design** — fully mobile-optimised
- ✅ **localStorage Persistence** — project state survives page refreshes
- ✅ **Overdue Highlighting** — red badge on past-due, incomplete projects
- ✅ **Clear Filters** — one-click reset for active filter state
- ✅ **Unit Tests** — 23 unit tests covering state hook, date utils, and form validation

---

## Project Structure

```
src/
  components/
    DashboardSummary.tsx   # Status count cards
    ProjectToolbar.tsx     # Search + filters + sort + add button
    ProjectList.tsx        # Responsive table / card list
    ProjectCard.tsx        # Mobile card view
    ProjectFormModal.tsx   # Create & edit form modal
    ConfirmDialog.tsx      # Delete confirmation dialog

  data/
    test_data.json         # 7 seed projects

  hooks/
    useProjects.ts         # Project state + CRUD + localStorage
    useProjects.test.ts    # Hook unit tests (with timers & localStorage mock)

  types/
    project.ts             # Types and constants

  utils/
    projectValidation.ts   # Form validation logic
    projectValidation.test.ts # Validation unit tests
    formatDate.ts          # Date display + overdue check
    formatDate.test.ts     # Date utility unit tests

  App.tsx                  # Layout shell, composes all components
  main.tsx                 # React root
  index.css                # Tailwind + Google Fonts + base styles
```

---

## Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm install
```

---

## Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Run Tests

To run the unit test suite:

```bash
npm run test
```

For watch/interactive mode:

```bash
npm run test:watch
```

---

## Build for Production

```bash
npm run build
```

The output is placed in `dist/`. Preview with:

```bash
npm run preview
```

---

## Assumptions Made

1. **No backend required** — all project data is managed in React state and persisted to `localStorage`.
2. **JSON is the seed source** — on first load, if no localStorage data exists, `test_data.json` is used as the initial dataset.
3. **IDs are generated client-side** — `Date.now()` is used as a simple unique ID generator for new projects. This is sufficient for a single-user, no-sync app.
4. **Dates are stored as ISO strings** (`YYYY-MM-DD`) — locale formatting happens at render time to avoid timezone issues.
5. **Description is optional** — the spec defines it in the model but does not list it as a required field in the validation rules.
6. **Start Date is optional** — the spec only validates that due date ≥ start date *if both are provided*.

---

## Technical Reflection

### Why this implementation approach?

I chose a custom hook (`useProjects`) to centralise all project state and CRUD logic, keeping components lean and focused on rendering. This pattern is idiomatic React and makes the data layer easy to test or swap out (e.g. replacing localStorage with an API call requires changes in only one file).

Tailwind v4 with `@tailwindcss/vite` keeps the styling pipeline simple — no config file needed, just `@import "tailwindcss"` in CSS and all utilities are available.

### What tradeoffs did you make?

- **No external form library** — I implemented validation from scratch. This keeps dependencies minimal and demonstrates understanding of controlled forms, but a library like `react-hook-form` would be more robust at scale.
- **Table vs. card layout** — I chose to use a CSS breakpoint (`md`) to switch between a full table (desktop) and stacked cards (mobile), rather than a single adaptive component. This gives a genuinely different, optimised experience on each screen size.
- **No animations library** — transitions are handled with Tailwind's `transition-*` utilities. This is lightweight and sufficient for this scale.

### What would you improve given more time?

- **Drag-and-drop reordering** of projects in the list
- **Project detail page** — click a row to see full description and activity log
- **Keyboard shortcuts** — e.g. `N` to open new project modal
- **End-to-End (E2E) tests** — using Playwright or Cypress to test full user journeys (CRUD lifecycle, dark mode toggling)
- **Optimistic updates** — show changes instantly and roll back on failure (relevant once a real API is introduced)
- **Multi-select + bulk delete**

### Most challenging part?

Managing the interaction between form validation (should errors show immediately, or only after first submit?), the controlled form state, and the modal open/close lifecycle. The chosen approach — validate on submit, then re-validate on every subsequent change — gives the best UX: no premature error messages, but instant feedback once you know the form has issues.

### Did you use AI tools?

Yes — see disclosure below.

---

## AI Disclosure

**Tools used:** Antigravity IDE (powered by Google DeepMind)

**How used:**
- Planning the folder architecture and component breakdown
- Generating initial TypeScript type definitions and utility functions
- Scaffolding component boilerplate (form modal, confirm dialog)
- Reviewing and improving code structure and accessibility attributes
- Writing this README

All generated code was reviewed, understood, and verified against the project requirements before acceptance.
