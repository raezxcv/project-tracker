Client Project Tracker

A simple project tracker app made for the Frontend Developer Technical Assessment.

Live Demo: https://project-tracker-git-main-raely-ivan-reyes-projects.vercel.app
GitHub Repo: https://github.com/raezxcv/project-tracker

About the Project

This app is used to manage client projects. Users can add new projects, edit existing projects, delete projects, and view all projects in one place.

Each project includes the client name, project name, description, status, priority, start date, and due date.

I also added extra features like search, filters, sorting, a dashboard summary, dark mode, and a Kanban-style board.

Tech Stack
React
TypeScript
Vite
Tailwind CSS
Vitest

I used React and TypeScript because I am comfortable with them and they help make the code easier to organize. I used Vite because it is fast and easy to set up. Tailwind CSS was used for styling.

Features
Required Features
Create projects
View project list
Edit project details
Delete projects
Form validation
Loading state
Empty state
Extra Features
Search projects
Filter by status
Filter by priority
Sort projects
Dashboard summary
Save data using localStorage
Drag and drop projects between status columns
Kanban board view
Overdue project highlighting
Dark mode
Unit tests
Project Structure
src/
├── components/     # UI components
├── hooks/          # Project state and CRUD logic
├── types/          # TypeScript types
├── utils/          # Helper functions
└── App.tsx         # Main app layout

Most of the project logic is inside useProjects.ts. This keeps the components cleaner because they mainly focus on the UI.

How to Run the Project

Make sure Node.js 18 or higher is installed.

npm install
npm run dev

Then open:

http://localhost:5173
How to Run Tests
npm run test

The tests cover validation, date helpers, and project state logic.

Assumptions
No backend is required for this assessment.
Project data is stored in localStorage.
Sample projects are shown on first load.
This is only for one user, so there is no login system.
Dates are stored as YYYY-MM-DD strings.
Description and start date are optional fields.
