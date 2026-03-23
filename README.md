# University Database Query Portal

This repository contains the frontend UI for a university database query application built with React, TypeScript, and Vite. The purpose of the app is to provide a simple web interface through which users can run database queries, view results in tables, generate reports, and export results. It now includes a lightweight FastAPI backend that connects to a Neon PostgreSQL database.
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
- Python 3.11+ (for the FastAPI backend)
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

### Frontend: run and test

```bash
npm run dev
```

To run all tests once:
```bash
npm run test:run
```

### Backend API (FastAPI + Neon)

1) Create and activate a virtual environment, then install backend deps:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

If you plan to run the backend tests or install development tools, install the dev/test dependencies as well:

```bash
# from inside the backend folder (same venv)
pip install -r requirements-dev.txt
```

2) Configure environment variables (FastAPI reads these):

- `DATABASE_URL` – Neon connection string (required)
- `CORS_ORIGINS` – comma-separated allowed origins (default: `http://localhost:5173`)

You can place these in `backend/.env`, then load them before running:

```bash
export $(grep -v '^#' .env | xargs)
```

3) Start the API (default FastAPI app is `api.py` in `backend/`):

```bash
./.venv/bin/uvicorn api:app --reload --port 8000 --app-dir backend
# If 8000 is busy, pick another port: --port 8020
```

API docs: http://127.0.0.1:8000/docs  
Health check: http://127.0.0.1:8000/health

### Frontend ↔ Backend integration

Set the frontend base URL so requests go to FastAPI:

```bash
echo "VITE_API_BASE_URL=http://127.0.0.1:8000" > .env.local
```

Then start the frontend (`npm run dev`). The app’s API helper points to `VITE_API_BASE_URL` (falls back to `http://localhost:8000`).

### Troubleshooting

- **Port in use:** change `--port` on uvicorn and update `VITE_API_BASE_URL` to match.
- **Cannot import module "api":** run uvicorn from the repo root with `--app-dir backend` or `cd backend` first.
- **DATABASE_URL missing:** export it (or load `.env`) before starting uvicorn.

### Login Passwords

Student: npg_fxToVzIC9B5O
Lecturer: pg_yrGw9Z3foAPD
Non Academic Staff: npg_BzpJHbtLY4k0

### Non Functional Requirements

- Performance: Pages should load quickly and remain responsive during queries.
- Usability: The interface should be simple, clear and easy to navigate.
- Reliability: Errors and invalid input should be handled gracefully.
- Security: XSS should be reduced in the UI; SQL injection handled by the backend.
- Maintainability: Code should be modular, reusable and testable.
