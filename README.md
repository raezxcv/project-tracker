Client Project Tracker

<<<<<<< HEAD
This is a small React project for tracking client projects. Users can add, edit, delete, search, filter, and sort projects. The app also has a dashboard that shows project totals.

Live demo: https://project-tracker-git-main-raely-ivan-reyes-projects.vercel.app

## Setup Instructions

1. Clone the repository.
2. Open the project folder in your terminal.
3. Install the dependencies:
=======
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
>>>>>>> a1419ab7f3441a97f5e0df70bed0424d7e83d101

npm install
```

## Technology Choices

- React for building the user interface
- TypeScript for safer JavaScript code
- Vite for running and building the app
- Tailwind CSS for styling
- Vitest for unit tests
- localStorage for saving project data in the browser

## How to Run the Application

Start the development server:

```bash
npm run dev

<<<<<<< HEAD
Then open the local link shown in the terminal. It is usually:

```text
http://localhost:5173
```

To build the app:

```bash
npm run build
```

To run the tests:

```bash
=======
Then open:

http://localhost:5173
How to Run Tests
>>>>>>> a1419ab7f3441a97f5e0df70bed0424d7e83d101
npm run test

<<<<<<< HEAD
## Assumptions Made

- This project is only a frontend app, so it does not use a backend or database.
- Project data is saved in the browser using localStorage.
- Sample project data is shown when the app is opened for the first time.
- The app is made for a small project tracking use case, not a full company project management system.
=======
The tests cover validation, date helpers, and project state logic.

Assumptions
No backend is required for this assessment.
Project data is stored in localStorage.
Sample projects are shown on first load.
This is only for one user, so there is no login system.
Dates are stored as YYYY-MM-DD strings.
Description and start date are optional fields.
>>>>>>> a1419ab7f3441a97f5e0df70bed0424d7e83d101
