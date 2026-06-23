# Client Project Tracker

A task management app for tracking client projects — built for the Frontend Developer Technical Assessment.

**Repo:** https://github.com/raezxcv/project-tracker

---

## What it does

You can create, view, edit, and delete client projects. Each project has a name, client, description, status, priority, start date, and due date.

It also has a dashboard that shows you an overview of all your projects at a glance.

---

## Tech Stack

| Tech | Why I used it |
|---|---|
| React 19 | I'm most comfortable with it and it's the industry standard |
| TypeScript | Helps catch mistakes early and makes the code easier to understand |
| Vite | Fast to set up and run |
| Tailwind CSS v4 | Easy to style things quickly without writing separate CSS files |
| Vitest | Simple test runner that works great with Vite |

---

## Features

**Required:**
- ✅ Create, view, edit, and delete projects
- ✅ Form validation (required fields, due date must be after start date)
- ✅ Loading and empty states

**Extras I added:**
- ✅ Dashboard with live stats (total, active, completed, high priority)
- ✅ Search, filter by status/priority, and sort
- ✅ Projects save to localStorage so data stays after refresh
- ✅ Overdue project highlighting
- ✅ Dark mode (follows your system setting, can be toggled)
- ✅ 23 unit tests

---

## Project Structure

```
src/
├── components/     # All UI components (modals, cards, forms, dashboard)
├── hooks/          # useProjects.ts — all project data and CRUD logic lives here
├── types/          # TypeScript types
├── utils/          # Date formatting and form validation helpers
└── App.tsx         # Main layout
```

---

## Setup

Make sure you have **Node.js 18+** installed.

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## Run Tests

```bash
npm run test
```

23 tests total — covers form validation, date utilities, and the project state hook.

---

## Assumptions I Made

1. No backend needed — data is saved in the browser using localStorage
2. On first load, 7 sample projects are shown so there's something to look at
3. Project IDs are generated using `Date.now()` — simple and works fine for a single-user app
4. Dates are stored as plain strings (YYYY-MM-DD) to avoid timezone issues
5. Description and start date are optional — they're not required by the spec
6. This is single-user only — no login or accounts needed

---

## Technical Reflection

### Why did I build it this way?

I kept things simple. All the project data and actions (create, edit, delete) live in one custom hook called `useProjects`. This means each component just handles what it shows on screen — not how data is stored. If I needed to swap localStorage for a real API later, I'd only need to change one file.

I also didn't use any pre-made UI libraries. Everything — the modals, dropdowns, cards — I built from scratch. I wanted to show I can do that without relying on outside tools.

### What tradeoffs did I make?

- I wrote my own form validation instead of using a library like `react-hook-form`. It's simpler and shows I understand how forms work, but a real production app would probably use a library.
- localStorage works great here, but it obviously won't sync across devices or browsers.
- I used simple Tailwind animations instead of a full animation library. Keeps things lightweight.

### What would I improve with more time?

- A project detail page when you click on a project
- End-to-end tests with Playwright or Cypress
- Bulk delete for selecting multiple projects at once
- Keyboard shortcuts (e.g. press N to create a new project)

### What was the hardest part?

Getting the form validation to feel right. I wanted errors to only show after you first try to submit (not while you're still typing), but then update immediately after that. Getting that timing right without weird bugs took a few tries.

### Did I use AI tools?

Yes — I used **Antigravity IDE (Google DeepMind)** and **OpenAI Codex**.

**What I used them for:**
- Helping with folder structure and planning
- Generating first drafts of components and types
- Writing initial unit tests

I read and reviewed everything the AI generated before using it. Nothing was blindly copy-pasted.