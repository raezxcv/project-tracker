# Client Project Tracker

A simple app for tracking client projects.

Users can add, edit, delete, search, filter, and sort projects. The app also has a small dashboard that shows project totals.

Live demo: https://project-tracker-git-main-raely-ivan-reyes-projects.vercel.app

## Features Implemented

- View all client projects
- Add a new project
- Edit project details
- Delete a project
- Validate required form fields
- Check that due date is not earlier than start date
- Show loading, empty, and error states
- Search projects
- Filter projects by status and priority
- Sort projects
- Show a dashboard summary
- Responsive design for mobile screens
- Unit tests

## Setup Instructions

Clone the project, then install the packages:

```bash
npm install
```

## Technology Choices

- React was used to build the app.
- TypeScript was used to help catch code errors.
- Vite was used to run the app locally.
- Tailwind CSS was used for styling.
- Vitest was used for tests.
- localStorage was used to save project data in the browser.

## How to Run the Application

Start the app:

```bash
npm run dev
```

Open this in the browser:

```text
http://localhost:5173
```

Run the tests:

```bash
npm run test
```

Build the app:

```bash
npm run build
```

## Assumptions Made

- This app does not use a backend.
- Project data is saved in localStorage.
- Sample projects are shown on the first load.
- The app is made for one user only.
