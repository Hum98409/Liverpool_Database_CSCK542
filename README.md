# University Database Query Portal

This repository contains the frontend UI for a university database query application built with React, TypeScript, and Vite. The purpose of the app is to provide a simple web interface through which users can run database queries, view results in tables, generate reports, and export results.
## What this app includes

The UI supports a query-driven workflow and is designed around academic database use cases. The application includes:

- A dashboard page with summary information
- A query centre for running multiple academic queries
- A reports page for displaying and downloading report data
- CSV and PDF export support
- Mock API responses using MSW
- Unit tests using Vitest and React Testing Library

The query UI supports these academic queries:

1. Find all students enrolled in a specific course taught by a particular lecturer
2. List all students with an average grade above 70% who are in their final year of studies
3. Identify students who have not registered for any courses in the current semester
4. Retrieve the contact information for the faculty advisor of a specific student
5. Search for lecturers with expertise in a particular research area
6. List all courses taught by lecturers in a specific department
7. Identify lecturers who have supervised the most student research projects
8. Generate a report on the publications of lecturers in the past year
9. Retrieve the names of students advised by a specific lecturer
10. Find all staff members employed in a specific department
11. Identify employees who supervise student employees in a particular program

## Prerequisites

Before running the project, install the following tools on your machine:

- Node.js, preferably the current LTS version
- npm, which normally comes with Node.js
- Git
- Visual Studio Code, if you want an easy editor experience

You can confirm Node and npm are installed correctly by running:

```bash
node -v
npm -v
```

The node_modules folder is not stored in Git, which is normal. After cloning the repository, install all dependencies by running:

```bash
npm install
```

To start the development server, run:


```bash
npm run dev
```

To run all tests once:
```bash
npm run test:run
```
