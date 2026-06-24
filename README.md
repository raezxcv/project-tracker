# Client Project Tracker

This is a small React project for tracking client projects. Users can add, edit, delete, search, filter, and sort projects. The app also has a dashboard that shows project totals.

Live demo: https://project-tracker-git-main-raely-ivan-reyes-projects.vercel.app

## Setup Instructions

1. Clone the repository.
2. Open the project folder in your terminal.
3. Install the dependencies:

```bash
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
```

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
npm run test
```

## Assumptions Made

- This project is only a frontend app, so it does not use a backend or database.
- Project data is saved in the browser using localStorage.
- Sample project data is shown when the app is opened for the first time.
- The app is made for a small project tracking use case, not a full company project management system.
