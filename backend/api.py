import os
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Path, Query, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from psycopg_pool import AsyncConnectionPool

# Environment configuration
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required (Neon connection string)")

CORS_ORIGINS = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]

# Database connection pool
pool = AsyncConnectionPool(
    conninfo=DATABASE_URL,
    max_size=5,
    num_workers=3,
    timeout=10,
)

API_KEY = os.getenv("API_KEY")


async def _verify_api_key(x_api_key: Optional[str] = Header(None)):
    """If API_KEY is set, require the same value in the x-api-key header for every request."""
    if API_KEY and x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")


global_deps = [Depends(_verify_api_key)] if API_KEY else []


app = FastAPI(title="Liverpool Database API", version="0.1.0", dependencies=global_deps)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    # Open the pool and validate a connection on startup
    await pool.open(wait=True)


@app.on_event("shutdown")
async def shutdown_event():
    await pool.close()


def _rows_to_dicts(cur, rows: List[tuple]) -> List[Dict[str, Any]]:
    """Convert DB rows to list of dicts using cursor.description for column names."""
    col_names = [d[0] for d in cur.description] if cur and getattr(cur, "description", None) else []
    return [dict(zip(col_names, r)) for r in rows]


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/students")
async def list_students(limit: int = Query(50, ge=1, le=1000), offset: int = Query(0, ge=0)):
    """Return a simple student list expected by the frontend (id, name, email).

    This aliases domain columns so it works across schema variants.
    """
    query = (
        "SELECT s.student_id AS id, s.full_name AS name, COALESCE(sc.contact_value, '') AS email "
        "FROM students s "
        "LEFT JOIN student_contacts sc ON sc.student_id = s.student_id AND sc.contact_type = 'email' AND sc.is_primary = true "
        "ORDER BY s.student_id LIMIT 50;"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                # apply limit/offset
                await cur.execute(query + " LIMIT %s OFFSET %s", (limit, offset))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:  # pragma: no cover - simple demo error handling
        raise HTTPException(status_code=500, detail=str(exc))


# ---------- Lookups (label/value) ----------


@app.get("/lookups/students")
async def lookup_students():
    query = "SELECT student_id AS value, full_name AS label FROM students ORDER BY full_name LIMIT 500;"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query)
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/lookups/lecturers")
async def lookup_lecturers():
    query = "SELECT lecturer_id AS value, full_name AS label FROM lecturers ORDER BY full_name LIMIT 500;"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query)
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/lookups/course-offerings")
async def lookup_course_offerings():
    query = (
        "SELECT course_offering_id AS value, (course_code || ' - ' || COALESCE(section, '')) AS label "
        "FROM course_offerings ORDER BY course_offering_id LIMIT 500;"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query)
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/lookups/semesters")
async def lookup_semesters():
    query = "SELECT semester_id AS value, code AS label FROM semesters ORDER BY start_date DESC LIMIT 50;"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query)
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/lookups/departments")
async def lookup_departments():
    query = "SELECT department_id AS value, name AS label FROM departments ORDER BY name;"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query)
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/lookups/programs")
async def lookup_programs():
    query = "SELECT program_id AS value, name AS label FROM programs ORDER BY name;"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query)
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ---------- Domain resource endpoints (simple list + get by id) ----------


@app.get("/departments")
async def list_departments(limit: int = Query(100, ge=1, le=1000), offset: int = Query(0, ge=0)):
    query = "SELECT department_id, name, faculty, created_at FROM departments ORDER BY department_id"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query + " LIMIT %s OFFSET %s", (limit, offset))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/programs")
async def list_programs(limit: int = Query(100, ge=1, le=1000), offset: int = Query(0, ge=0)):
    query = (
        "SELECT program_id, department_id, name, degree_awarded, duration_years, created_at "
        "FROM programs ORDER BY program_id"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query + " LIMIT %s OFFSET %s", (limit, offset))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/lecturers")
async def list_lecturers(limit: int = Query(100, ge=1, le=1000), offset: int = Query(0, ge=0)):
    query = (
        "SELECT lecturer_id, department_id, full_name, email, created_at "
        "FROM lecturers ORDER BY lecturer_id"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query + " LIMIT %s OFFSET %s", (limit, offset))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/courses")
async def list_courses(limit: int = Query(100, ge=1, le=1000), offset: int = Query(0, ge=0)):
    query = (
        "SELECT course_code, department_id, name, description, level, credits, created_at "
        "FROM courses ORDER BY course_code"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query + " LIMIT %s OFFSET %s", (limit, offset))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/course-offerings")
async def list_course_offerings(limit: int = Query(100, ge=1, le=1000), offset: int = Query(0, ge=0)):
    query = (
        "SELECT course_offering_id, course_code, semester_id, section, schedule_text "
        "FROM course_offerings ORDER BY course_offering_id"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query + " LIMIT %s OFFSET %s", (limit, offset))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/semesters")
async def list_semesters(limit: int = Query(50, ge=1, le=1000), offset: int = Query(0, ge=0)):
    query = "SELECT semester_id, code, start_date, end_date, is_current FROM semesters ORDER BY start_date DESC"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query + " LIMIT %s OFFSET %s", (limit, offset))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/research-projects")
async def list_research_projects(limit: int = Query(100, ge=1, le=1000), offset: int = Query(0, ge=0)):
    query = (
        "SELECT research_project_id, principal_investigator_lecturer_id, title, start_date, end_date, outcomes, created_at "
        "FROM research_projects ORDER BY research_project_id"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query + " LIMIT %s OFFSET %s", (limit, offset))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/research-projects/{project_id}/members")
async def research_project_members(project_id: int = Path(..., alias="project_id")):
    # Return student and lecturer members (union)
    query = (
        "SELECT 'student' AS member_type, student_id AS member_id, member_role, created_at "
        "FROM research_project_members_students WHERE research_project_id = %s "
        "UNION ALL "
        "SELECT 'lecturer' AS member_type, lecturer_id AS member_id, member_role, created_at "
        "FROM research_project_members_lecturers WHERE research_project_id = %s "
        "ORDER BY member_type;"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (project_id, project_id))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/non-academic-staff")
async def list_non_academic_staff(limit: int = Query(100, ge=1, le=1000), offset: int = Query(0, ge=0)):
    query = (
        "SELECT staff_id, department_id, full_name, job_title, employment_type, contract_details, salary_amount, salary_currency, emergency_contact, created_at "
        "FROM non_academic_staff ORDER BY staff_id"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query + " LIMIT %s OFFSET %s", (limit, offset))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/student-employments")
async def list_student_employments(limit: int = Query(100, ge=1, le=1000), offset: int = Query(0, ge=0)):
    query = (
        "SELECT employment_id, student_id, program_id, supervisor_staff_id, job_title, start_date, end_date, created_at "
        "FROM student_employment ORDER BY employment_id"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query + " LIMIT %s OFFSET %s", (limit, offset))
                rows = await cur.fetchall()
                return _rows_to_dicts(cur, rows)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ---------- Queries (generic flexible rows) ----------


@app.get("/queries/students-by-course-and-lecturer")
async def query_students_by_course_and_lecturer(courseOfferingId: int = Query(..., alias="courseOfferingId"), lecturerId: Optional[int] = Query(None, alias="lecturerId")):
    # Try to return students registered for a course offering. LecturerId is optional and may be ignored if schema differs.
    query = (
        "SELECT s.student_id, s.full_name "
        "FROM students s "
        "JOIN enrollments reg ON reg.student_id = s.student_id "
        "WHERE reg.course_offering_id = %s LIMIT 500;"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (courseOfferingId,))
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/queries/final-year-top-students")
async def query_final_year_top_students(minAverage: Optional[float] = Query(None, alias="minAverage")):
    # Basic implementation: return students in final year (year_of_study >= 4). minAverage ignored if no grades table exists.
    query = "SELECT student_id, full_name, year_of_study FROM students WHERE year_of_study >= 4 ORDER BY student_id LIMIT 100;"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query)
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/queries/unregistered-current-semester")
async def query_unregistered_current_semester(semesterId: int = Query(..., alias="semesterId")):
    # Students not registered in any course_offering for the given semester
    query = (
        "SELECT s.student_id, s.full_name "
        "FROM students s "
        "WHERE s.student_id NOT IN (SELECT student_id FROM enrollments reg JOIN course_offerings co ON reg.course_offering_id = co.course_offering_id WHERE co.semester_id = %s) LIMIT 500;"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (semesterId,))
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/queries/student-advisor-contact")
async def query_student_advisor_contact(studentId: int = Query(..., alias="studentId")):
    query = (
        "SELECT l.lecturer_id, l.full_name, l.email "
        "FROM students s JOIN lecturers l ON s.advisor_lecturer_id = l.lecturer_id "
        "WHERE s.student_id = %s LIMIT 1;"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (studentId,))
                row = await cur.fetchone()
                return {"data": dict(zip([d[0] for d in cur.description], row)) if row else None}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/queries/lecturers-by-research-area")
async def query_lecturers_by_research_area(keyword: str = Query(..., alias="keyword")):
    query = (
        "SELECT l.lecturer_id, l.full_name, le.expertise_name "
        "FROM lecturers l JOIN lecturer_expertise le ON le.lecturer_id = l.lecturer_id "
        "WHERE le.expertise_name ILIKE %s LIMIT 200;"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (f"%{keyword}%",))
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/queries/courses-by-department")
async def query_courses_by_department(departmentId: int = Query(..., alias="departmentId")):
    query = "SELECT course_code, name, level, credits FROM courses WHERE department_id = %s ORDER BY course_code LIMIT 500;"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (departmentId,))
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/queries/top-project-supervisors")
async def query_top_project_supervisors(limit: int = Query(10, alias="limit")):
    query = (
        "SELECT principal_investigator_lecturer_id AS lecturer_id, COUNT(*) AS project_count "
        "FROM research_projects GROUP BY principal_investigator_lecturer_id ORDER BY project_count DESC LIMIT %s;"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (limit,))
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/queries/students-by-advisor")
async def query_students_by_advisor(lecturerId: int = Query(..., alias="lecturerId")):
    query = "SELECT student_id, full_name FROM students WHERE advisor_lecturer_id = %s ORDER BY student_id LIMIT 500;"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (lecturerId,))
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/queries/staff-by-department")
async def query_staff_by_department(departmentId: int = Query(..., alias="departmentId")):
    query = "SELECT staff_id, full_name, job_title FROM non_academic_staff WHERE department_id = %s ORDER BY staff_id LIMIT 500;"
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (departmentId,))
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/queries/program-student-employee-supervisors")
async def query_program_student_employee_supervisors(programId: int = Query(..., alias="programId")):
    query = (
        "SELECT se.employment_id, se.student_id, se.supervisor_staff_id, se.job_title "
        "FROM student_employment se WHERE se.program_id = %s ORDER BY se.employment_id LIMIT 500;"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, (programId,))
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ---------- Reports ----------


@app.get("/reports/lecturer-publications")
async def report_lecturer_publications(year: int = Query(..., alias="year"), departmentId: Optional[int] = Query(None, alias="departmentId")):
    params = [year]
    where = "WHERE EXTRACT(YEAR FROM lp.publication_date) = %s"
    if departmentId:
        where += " AND l.department_id = %s"
        params.append(departmentId)
    query = (
        "SELECT lp.publication_id, lp.lecturer_id, l.full_name AS lecturer_name, lp.title, lp.publication_date, lp.venue, lp.doi "
        "FROM lecturer_publications lp JOIN lecturers l ON lp.lecturer_id = l.lecturer_id "
        f"{where} ORDER BY lp.publication_date DESC LIMIT 100;"
    )
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, tuple(params))
                rows = await cur.fetchall()
                return {"data": _rows_to_dicts(cur, rows)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ---------- Dashboard summary ----------


@app.get("/dashboard/summary")
async def dashboard_summary():
    # Gather simple counts and current semester code
    queries = {
        "students": "SELECT COUNT(*) FROM students;",
        "lecturers": "SELECT COUNT(*) FROM lecturers;",
        "courses": "SELECT COUNT(*) FROM courses;",
        "departments": "SELECT COUNT(*) FROM departments;",
        "current_semester": "SELECT code FROM semesters WHERE is_current = true LIMIT 1;",
    }
    try:
        result: Dict[str, Any] = {}
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                for key, q in queries.items():
                    await cur.execute(q)
                    row = await cur.fetchone()
                    result[key] = row[0] if row else None
        # Normalize into expected DashboardSummary shape
        return {
            "totalStudents": int(result.get("students") or 0),
            "totalLecturers": int(result.get("lecturers") or 0),
            "totalCourses": int(result.get("courses") or 0),
            "totalDepartments": int(result.get("departments") or 0),
            "currentSemester": result.get("current_semester") or "",
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

